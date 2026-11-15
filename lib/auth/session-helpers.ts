import { database } from '../database';
import {
  canonicalEmail,
  checkPassword,
  digest,
  hashPassword,
  normalizedRecovery,
  randomToken,
  recoveryCode,
  sessionCookie,
  validatePassword,
} from '../auth-crypto';

export class AuthError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export type Credential = {
  user_id: string;
  email: string;
  password_hash: string;
  recovery_hash: string;
  version: number;
  email_verified: number;
};

export function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export function fromBase64Url(encoded: string): string | null {
  try {
    const b64 = encoded.replaceAll('-', '+').replaceAll('_', '/');
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export function decodeEmailFromResetToken(token: string): string | null {
  const dot = token.indexOf('.');
  if (dot <= 0) return null;
  const decoded = fromBase64Url(token.slice(dot + 1));
  if (!decoded) return null;
  try {
    return canonicalEmail(decoded);
  } catch {
    return null;
  }
}

export async function getCredential(email: string) {
  return database()
    .prepare(
      'SELECT user_id,email,password_hash,recovery_hash,version,email_verified FROM credentials WHERE lower(email)=?',
    )
    .bind(email.toLowerCase())
    .first<Credential>();
}

let resetTableEnsured = false;

export async function ensurePasswordResetTable() {
  if (resetTableEnsured) return;
  await database()
    .prepare(
      'CREATE TABLE IF NOT EXISTS password_reset_otps (email_hash text PRIMARY KEY NOT NULL, challenge_hash text NOT NULL, otp_hash text NOT NULL, user_id text, credential_version integer NOT NULL, attempts integer DEFAULT 0 NOT NULL, requested_at integer NOT NULL, expires_at integer NOT NULL, ready integer DEFAULT 0 NOT NULL, FOREIGN KEY (user_id) REFERENCES accounts(user_id) ON UPDATE no action ON DELETE no action)',
    )
    .run();
  await database()
    .prepare(
      'CREATE UNIQUE INDEX IF NOT EXISTS password_reset_otps_challenge_hash_unique ON password_reset_otps (challenge_hash)',
    )
    .run();
  resetTableEnsured = true;
}

export async function limit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const row = await database()
    .prepare(
      'INSERT INTO auth_limits (key,attempts,window_start) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN window_start<? THEN 1 ELSE attempts+1 END,window_start=CASE WHEN window_start<? THEN ? ELSE window_start END RETURNING attempts',
    )
    .bind(await digest(key), now, now - windowMs, now - windowMs, now)
    .first<{ attempts: number }>();
  if (!row || row.attempts > max) {
    throw new AuthError('Terlalu banyak percobaan. Coba lagi dalam 15 menit.', 429);
  }
}

export async function issueSession(userId: string, version: number) {
  const token = randomToken(),
    expires = Date.now() + 7 * 86400000;
  await database().batch([
    database().prepare('DELETE FROM sessions WHERE expires_at<?').bind(Date.now()),
    database().prepare('DELETE FROM auth_limits WHERE window_start<?').bind(Date.now() - 86400000),
    database()
      .prepare(
        'INSERT INTO sessions (token_hash,user_id,credential_version,expires_at,created_at) VALUES (?,?,?,?,?)',
      )
      .bind(await digest(token), userId, version, expires, new Date().toISOString()),
  ]);
  return sessionCookie(token, expires);
}

export function passwordInput(body: Record<string, unknown>): string {
  if (body.password !== body.confirm) {
    throw new AuthError('Konfirmasi kata sandi tidak sama.');
  }
  try {
    return validatePassword(body.password);
  } catch (error) {
    throw new AuthError(error instanceof Error ? error.message : 'Kata sandi tidak valid.', 400);
  }
}

export async function syncLocalCredentialAfterFirebaseAuth(
  email: string,
  plainPassword: string,
  displayName?: string,
  firebaseUid?: string,
): Promise<Credential> {
  const now = new Date().toISOString();
  const encoded = await hashPassword(plainPassword);
  const existing = await getCredential(email);
  if (existing) {
    const matchesLocal = await checkPassword(plainPassword, existing.password_hash);
    if (!matchesLocal || existing.recovery_hash === 'local-reset') {
      const updated = await database()
        .prepare(
          "UPDATE credentials SET password_hash=?,recovery_hash='',version=version+1,email_verified=1,updated_at=? WHERE user_id=? RETURNING version",
        )
        .bind(encoded, now, existing.user_id)
        .first<{ version: number }>();
      const nextVersion = updated?.version ?? existing.version + 1;
      await database()
        .prepare('DELETE FROM sessions WHERE user_id=? AND credential_version<>?')
        .bind(existing.user_id, nextVersion)
        .run();
      return {
        ...existing,
        password_hash: encoded,
        recovery_hash: '',
        version: nextVersion,
        email_verified: 1,
      };
    }
    return existing;
  }

  const existingAccount = await database()
    .prepare('SELECT user_id,display_name FROM accounts WHERE lower(email)=? ORDER BY created_at LIMIT 1')
    .bind(email)
    .first<{ user_id: string; display_name: string }>();

  const userId =
    existingAccount?.user_id || (firebaseUid ? `firebase_${firebaseUid}` : `email_${crypto.randomUUID()}`);
  const finalName = displayName?.trim() || existingAccount?.display_name || email.split('@')[0];

  await database().batch([
    database()
      .prepare(
        'INSERT INTO accounts (user_id,email,display_name,created_at,last_seen_at) VALUES (?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET last_seen_at=excluded.last_seen_at',
      )
      .bind(userId, email, finalName, now, now),
    database()
      .prepare(
        'INSERT INTO credentials (user_id,email,password_hash,recovery_hash,version,email_verified,updated_at) VALUES (?,?,?,?,1,1,?) ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash,email_verified=1,updated_at=excluded.updated_at',
      )
      .bind(userId, email, encoded, '', now),
  ]);

  const created = await getCredential(email);
  if (!created) throw new AuthError('Gagal menyiapkan akun.', 500);
  return created;
}

export async function replacePassword(
  credential: Credential,
  password: unknown,
  expectedRecovery?: string,
) {
  const code = recoveryCode(),
    encoded = await hashPassword(password),
    recoveryHash = await digest('recovery:' + normalizedRecovery(code));
  const sql =
    'UPDATE credentials SET password_hash=?,recovery_hash=?,version=version+1,updated_at=? WHERE user_id=?' +
    (expectedRecovery ? ' AND recovery_hash=?' : '') +
    ' RETURNING version';
  const args = [
    encoded,
    recoveryHash,
    new Date().toISOString(),
    credential.user_id,
    ...(expectedRecovery ? [expectedRecovery] : []),
  ];
  const updated = await database()
    .prepare(sql)
    .bind(...args)
    .first<{ version: number }>();
  if (!updated) throw new AuthError('Kode pemulihan sudah tidak berlaku.');
  await database().prepare('DELETE FROM sessions WHERE user_id=?').bind(credential.user_id).run();
  return { code, cookie: await issueSession(credential.user_id, updated.version) };
}
