import { getChatGPTUser } from '@/app/chatgpt-auth';
import { database } from './database';
import { resolveIdentity } from './identity';
import { ensureAccount, isOwnerEmail } from './account-store';
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
} from './auth-crypto';
import { verifyGoogleToken } from './firebase-google';
import { linkVerifiedGoogleAccount } from './google-account-link';
import {
  FirebaseAuthRestError,
  firebaseConfirmPasswordReset,
  firebaseSendPasswordResetEmail,
  firebaseSignIn,
  firebaseSignUp,
  firebaseUpdatePassword,
  firebaseVerifyPasswordResetCode,
} from './firebase-auth';
import { getMailEnvironment, hasCustomMailer, sendBrandedResetEmail } from './recovery-mail';
import { PasswordResetError } from './password-reset';

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function fromBase64Url(encoded: string): string | null {
  try {
    const b64 = encoded.replaceAll('-', '+').replaceAll('_', '/');
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function decodeEmailFromResetToken(token: string): string | null {
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

export class AuthError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

type Credential = {
  user_id: string;
  email: string;
  password_hash: string;
  recovery_hash: string;
  version: number;
  email_verified: number;
};

async function getCredential(email: string) {
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

async function limit(key: string, max: number, windowMs: number) {
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

async function issueSession(userId: string, version: number) {
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

function passwordInput(body: Record<string, unknown>): string {
  if (body.password !== body.confirm) {
    throw new AuthError('Konfirmasi kata sandi tidak sama.');
  }
  try {
    return validatePassword(body.password);
  } catch (error) {
    throw new AuthError(error instanceof Error ? error.message : 'Kata sandi tidak valid.', 400);
  }
}

async function syncLocalCredentialAfterFirebaseAuth(
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

  const userId = existingAccount?.user_id || (firebaseUid ? `firebase_${firebaseUid}` : `email_${crypto.randomUUID()}`);
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

async function replacePassword(
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

export async function handleEmailAuth(
  action: string,
  body: Record<string, unknown>,
  request: Request,
): Promise<{ data: Record<string, unknown>; cookie?: string }> {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'local';

  if (action === 'google') {
    await limit('google-ip:' + ip, 30, 15 * 60000);
    let google;
    try {
      google = await verifyGoogleToken(body.idToken);
    } catch {
      throw new AuthError('Login Google tidak valid atau sudah kedaluwarsa. Silakan coba lagi.', 401);
    }
    let credential;
    try {
      credential = await linkVerifiedGoogleAccount(database(), google);
    } catch {
      throw new AuthError('Akun Google belum berhasil dihubungkan. Coba lagi.', 503);
    }
    return { data: { ok: true }, cookie: await issueSession(credential.user_id, credential.version) };
  }

  if (action === 'logout') {
    const { SESSION_COOKIE } = await import('./auth-crypto');
    const cookie = request.headers
      .get('cookie')
      ?.split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(SESSION_COOKIE + '='))
      ?.slice(SESSION_COOKIE.length + 1);
    if (cookie && /^[a-f0-9]{64}$/.test(cookie)) {
      await database()
        .prepare('DELETE FROM sessions WHERE token_hash=?')
        .bind(await digest(cookie))
        .run();
    }
    const platform = await getChatGPTUser();
    return {
      data: { redirect: platform ? '/signout-with-chatgpt?return_to=%2F' : '/' },
      cookie: sessionCookie('', 0),
    };
  }

  if (
    ![
      'register',
      'login',
      'recover',
      'request-otp',
      'request-reset',
      'verify-reset',
      'reset-otp',
      'confirm-reset',
      'activate',
      'change-password',
    ].includes(action)
  ) {
    throw new AuthError('Halaman tidak ditemukan.', 404);
  }

  await limit('auth-ip:' + ip, 60, 15 * 60000);

  // Branded HTML Password Reset Email (Brevo/Resend/Webhook) OR Zero-Config Firebase Reset Flow
  if (action === 'request-otp' || action === 'request-reset') {
    const email = canonicalEmail(body.email);
    await limit('otp-send-ip:' + ip, 15, 15 * 60000);
    await limit('otp-send-email:' + email, 10, 15 * 60000);

    const existingAccount = await database()
      .prepare('SELECT user_id, display_name FROM accounts WHERE lower(email)=? LIMIT 1')
      .bind(email)
      .first<{ user_id: string; display_name: string }>();
    const existingCred = await getCredential(email);

    const mailEnv = getMailEnvironment();
    if (hasCustomMailer(mailEnv)) {
      await ensurePasswordResetTable();
      const now = Date.now();
      const ttlMs = 15 * 60_000;
      const resendMs = 60_000;
      const token = `${randomToken(24)}.${toBase64Url(email)}`;
      const emailHash = await digest('reset-email:' + email);
      const challengeHash = await digest('reset-link:' + token);
      const otpHash = await digest('reset-link-email:' + token + ':' + email);

      const accepted = await database()
        .prepare(
          `INSERT INTO password_reset_otps
          (email_hash,challenge_hash,otp_hash,user_id,credential_version,attempts,requested_at,expires_at,ready)
          VALUES (?,?,?,?,?,0,?,?,0) ON CONFLICT(email_hash) DO UPDATE SET
          challenge_hash=excluded.challenge_hash,otp_hash=excluded.otp_hash,user_id=excluded.user_id,
          credential_version=excluded.credential_version,attempts=0,requested_at=excluded.requested_at,
          expires_at=excluded.expires_at,ready=0 WHERE requested_at<=? RETURNING challenge_hash`,
        )
        .bind(
          emailHash,
          challengeHash,
          otpHash,
          existingAccount?.user_id ?? existingCred?.user_id ?? null,
          existingCred?.version ?? 0,
          now,
          now + ttlMs,
          now - resendMs,
        )
        .first();

      if (!accepted) {
        throw new AuthError('Tunggu 60 detik sebelum meminta tautan baru.', 429);
      }

      const reqOrigin = new URL(request.url).origin;
      let appUrlEnv = '';
      if (mailEnv.APP_URL && /^https?:\/\//i.test(mailEnv.APP_URL.trim()) && !/MY_APP_URL/i.test(mailEnv.APP_URL)) {
        try {
          appUrlEnv = new URL(mailEnv.APP_URL.trim()).origin;
        } catch {
          appUrlEnv = '';
        }
      }
      const isLocalReq = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(reqOrigin);
      const baseOrigin = isLocalReq && appUrlEnv ? appUrlEnv : reqOrigin;
      const resetUrl = `${baseOrigin}/reset-password?token=${encodeURIComponent(token)}`;
      try {
        await sendBrandedResetEmail(email, resetUrl, mailEnv);
      } catch (err) {
        await database()
          .prepare('DELETE FROM password_reset_otps WHERE challenge_hash=?')
          .bind(challengeHash)
          .run();
        if (err instanceof PasswordResetError) {
          throw new AuthError(err.message, err.status);
        }
        throw new AuthError(
          'Gagal mengirim email reset. Pastikan MAIL_WEBHOOK_SECRET dan pengirim email sudah sesuai.',
          503,
        );
      }

      await database()
        .prepare('UPDATE password_reset_otps SET ready=1 WHERE challenge_hash=?')
        .bind(challengeHash)
        .run();
      await database()
        .prepare('DELETE FROM password_reset_otps WHERE expires_at<?')
        .bind(now - 86_400_000)
        .run();

      return {
        data: {
          ok: true,
          mode: 'branded',
          retryAfter: 60,
          message: `Tautan atur ulang kata sandi telah dikirim ke ${email}.`,
        },
      };
    }

    if (existingAccount || existingCred) {
      // Ensure the account is provisioned in Firebase Auth so Firebase will send the password reset email
      const tempPassword = 'Sidaps!' + randomToken(12);
      await firebaseSignUp(email, tempPassword, existingAccount?.display_name || email.split('@')[0]).catch(
        () => {
          // EMAIL_EXISTS is expected if already in Firebase Auth
        },
      );
    }

    try {
      await firebaseSendPasswordResetEmail(email);
    } catch (error) {
      if (error instanceof FirebaseAuthRestError && error.code === 'EMAIL_NOT_FOUND') {
        // Do not leak whether an unknown email is registered; return same friendly response
      } else if (error instanceof FirebaseAuthRestError) {
        throw new AuthError(error.message, error.status);
      } else {
        throw new AuthError(
          'Gagal menghubungi server email Firebase. Periksa koneksi internet lalu coba lagi.',
          503,
        );
      }
    }

    return {
      data: {
        ok: true,
        mode: 'firebase',
        retryAfter: 60,
        message: `Tautan atur ulang kata sandi telah dikirim ke ${email}.`,
      },
    };
  }

  // Verify token OR oobCode before showing new password form inside Sidaps Portfolio
  if (action === 'verify-reset') {
    const resetToken = typeof body.token === 'string' ? body.token.trim() : '';
    if (resetToken) {
      await ensurePasswordResetTable();
      const email = decodeEmailFromResetToken(resetToken);
      if (!email) {
        return {
          data: {
            ok: false,
            error: 'Tautan reset tidak valid atau sudah kedaluwarsa.',
          },
        };
      }
      const now = Date.now();
      const challengeHash = await digest('reset-link:' + resetToken);
      const otpHash = await digest('reset-link-email:' + resetToken + ':' + email);
      const row = await database()
        .prepare(
          `SELECT email_hash
           FROM password_reset_otps
           WHERE challenge_hash=? AND otp_hash=? AND ready=1 AND expires_at>? AND attempts<8
           LIMIT 1`,
        )
        .bind(challengeHash, otpHash, now)
        .first<{ email_hash: string }>();
      if (!row) {
        return {
          data: {
            ok: false,
            error: 'Tautan reset tidak valid atau sudah kedaluwarsa.',
          },
        };
      }
      return {
        data: {
          ok: true,
          email,
        },
      };
    }

    const oobCode = typeof body.oobCode === 'string' ? body.oobCode.trim() : '';
    if (!oobCode) {
      return {
        data: {
          ok: false,
          error: 'Kode atau tautan reset tidak ditemukan.',
        },
      };
    }
    try {
      const result = await firebaseVerifyPasswordResetCode(oobCode);
      return {
        data: {
          ok: true,
          email: canonicalEmail(result.email),
        },
      };
    } catch (error) {
      if (error instanceof FirebaseAuthRestError) {
        return {
          data: {
            ok: false,
            error: error.message,
          },
        };
      }
      return {
        data: {
          ok: false,
          error: 'Tautan reset tidak valid atau sudah kedaluwarsa.',
        },
      };
    }
  }

  // In-app token OR oobCode reset confirmation inside Sidaps Portfolio
  if (action === 'confirm-reset' || action === 'reset-otp') {
    const resetToken = typeof body.token === 'string' ? body.token.trim() : '';
    if (resetToken) {
      await ensurePasswordResetTable();
      const newPassword = passwordInput(body);
      const email = decodeEmailFromResetToken(resetToken);
      if (!email) {
        throw new AuthError('Tautan reset tidak valid atau sudah kedaluwarsa.', 400);
      }
      const now = Date.now();
      const challengeHash = await digest('reset-link:' + resetToken);
      const expectedOtpHash = await digest('reset-link-email:' + resetToken + ':' + email);
      const row = await database()
        .prepare(
          `UPDATE password_reset_otps SET attempts=attempts+1
           WHERE challenge_hash=? AND otp_hash=? AND ready=1 AND expires_at>? AND attempts<8
           RETURNING challenge_hash,otp_hash,user_id,credential_version,attempts`,
        )
        .bind(challengeHash, expectedOtpHash, now)
        .first<{
          challenge_hash: string;
          otp_hash: string;
          user_id: string | null;
          credential_version: number;
          attempts: number;
        }>();

      if (!row) {
        throw new AuthError('Tautan reset tidak valid atau sudah kedaluwarsa.', 400);
      }

      const encoded = await hashPassword(newPassword);
      const nowIso = new Date(now).toISOString();
      const existingCred = await getCredential(email);
      const existingAccount = await database()
        .prepare('SELECT user_id, email FROM accounts WHERE lower(email)=? LIMIT 1')
        .bind(email)
        .first<{ user_id: string; email: string }>();

      let finalUserId = existingCred?.user_id || existingAccount?.user_id || `email_${crypto.randomUUID()}`;
      let finalVersion = 1;

      if (existingCred) {
        const updated = await database()
          .prepare(
            "UPDATE credentials SET password_hash=?,recovery_hash='local-reset',version=version+1,email_verified=1,updated_at=? WHERE user_id=? AND version=? RETURNING user_id,version",
          )
          .bind(encoded, nowIso, existingCred.user_id, row.credential_version || existingCred.version)
          .first<{ user_id: string; version: number }>();
        if (!updated) {
          throw new AuthError('Tautan reset sudah tidak berlaku. Silakan minta tautan baru.', 409);
        }
        finalUserId = updated.user_id;
        finalVersion = updated.version;
      } else if (existingAccount) {
        await database()
          .prepare(
            "INSERT INTO credentials (user_id,email,password_hash,recovery_hash,version,email_verified,updated_at) VALUES (?,?,?,'local-reset',1,1,?)",
          )
          .bind(finalUserId, email, encoded, nowIso)
          .run();
      } else {
        await database().batch([
          database()
            .prepare(
              'INSERT INTO accounts (user_id,email,display_name,created_at,last_seen_at) VALUES (?,?,?,?,?)',
            )
            .bind(finalUserId, email, email.split('@')[0], nowIso, nowIso),
          database()
            .prepare(
              "INSERT INTO credentials (user_id,email,password_hash,recovery_hash,version,email_verified,updated_at) VALUES (?,?,?,'local-reset',1,1,?)",
            )
            .bind(finalUserId, email, encoded, nowIso),
        ]);
        firebaseSignUp(email, newPassword, email.split('@')[0]).catch(() => {});
      }

      await database().batch([
        database()
          .prepare('DELETE FROM sessions WHERE user_id=? AND credential_version<>?')
          .bind(finalUserId, finalVersion),
        database().prepare('DELETE FROM password_reset_otps WHERE challenge_hash=?').bind(challengeHash),
        database().prepare('UPDATE accounts SET last_seen_at=? WHERE user_id=?').bind(nowIso, finalUserId),
      ]);

      return {
        data: {
          ok: true,
          email,
          message: 'Kata sandi berhasil diperbarui.',
        },
        cookie: await issueSession(finalUserId, finalVersion),
      };
    }

    const oobCode = typeof body.oobCode === 'string' ? body.oobCode.trim() : '';
    if (!oobCode) {
      throw new AuthError(
        'Silakan buka atau tempel tautan reset kata sandi dari email Anda terlebih dahulu.',
        400,
      );
    }
    const newPassword = passwordInput(body);
    try {
      const result = await firebaseConfirmPasswordReset(oobCode, newPassword);
      const email = canonicalEmail(result.email);
      const cred = await syncLocalCredentialAfterFirebaseAuth(email, newPassword);
      return {
        data: {
          ok: true,
          email,
          message: 'Kata sandi berhasil diperbarui.',
        },
        cookie: await issueSession(cred.user_id, cred.version),
      };
    } catch (error) {
      if (error instanceof FirebaseAuthRestError) {
        throw new AuthError(error.message, error.status);
      }
      throw new AuthError('Tautan reset tidak valid atau sudah kedaluwarsa.', 400);
    }
  }

  if (action === 'register') {
    const email = canonicalEmail(body.email),
      name = typeof body.displayName === 'string' ? body.displayName.trim() : '';
    if (name.length < 2 || name.length > 60) {
      throw new AuthError('Nama tampilan harus 2–60 karakter.');
    }
    await limit('register-ip:' + ip, 15, 15 * 60000);
    if (isOwnerEmail(email)) {
      throw new AuthError(
        'Akun pemilik sudah disediakan. Gunakan Masuk atau Lupa sandi untuk mengatur kata sandi.',
        409,
      );
    }
    const existing = await database()
      .prepare('SELECT user_id FROM accounts WHERE lower(email)=?')
      .bind(email)
      .first();
    if (existing || (await getCredential(email))) {
      throw new AuthError(
        'Email sudah terdaftar. Silakan masuk atau klik Lupa sandi untuk mengatur ulang.',
        409,
      );
    }

    const plainPassword = passwordInput(body);
    let firebaseUid: string | undefined;
    try {
      const fbUser = await firebaseSignUp(email, plainPassword, name);
      firebaseUid = fbUser.localId;
    } catch (error) {
      if (error instanceof FirebaseAuthRestError && error.code === 'EMAIL_EXISTS') {
        // If the email already exists in Firebase Auth (e.g. from another session), verify if their password matches
        try {
          const fbExisting = await firebaseSignIn(email, plainPassword);
          firebaseUid = fbExisting.localId;
        } catch {
          throw new AuthError(
            'Email sudah terdaftar di sistem autentikasi. Gunakan menu Masuk atau klik Lupa sandi.',
            409,
          );
        }
      }
      // If Firebase is unreachable in an offline local test, allow local SQLite registration to proceed cleanly
    }

    const encoded = await hashPassword(plainPassword),
      userId = firebaseUid ? 'email_' + firebaseUid : 'email_' + crypto.randomUUID(),
      now = new Date().toISOString();
    try {
      await database().batch([
        database()
          .prepare(
            'INSERT INTO accounts (user_id,email,display_name,created_at,last_seen_at) VALUES (?,?,?,?,?)',
          )
          .bind(userId, email, name, now, now),
        database()
          .prepare(
            'INSERT INTO credentials (user_id,email,password_hash,recovery_hash,version,email_verified,updated_at) VALUES (?,?,?,?,1,1,?)',
          )
          .bind(userId, email, encoded, '', now),
      ]);
    } catch {
      throw new AuthError('Pendaftaran belum berhasil. Email mungkin sudah terdaftar.', 409);
    }
    return { data: { ok: true }, cookie: await issueSession(userId, 1) };
  }

  if (action === 'login') {
    const email = canonicalEmail(body.email);
    await limit('login-email:' + email, 15, 15 * 60000);
    const rawPassword = typeof body.password === 'string' ? body.password : '';
    if (!rawPassword) throw new AuthError('Masukkan kata sandi.', 400);

    const existingCred = await getCredential(email);
    if (existingCred?.recovery_hash === 'local-reset') {
      // Account recently reset via Sidaps branded link; enforce local password hash strictly so stale Firebase passwords cannot log in
      const validLocal = await checkPassword(rawPassword, existingCred.password_hash);
      if (!validLocal) {
        throw new AuthError('Email atau kata sandi salah.', 401);
      }
      await database()
        .prepare('UPDATE accounts SET last_seen_at=? WHERE user_id=?')
        .bind(new Date().toISOString(), existingCred.user_id)
        .run();
      return {
        data: { ok: true },
        cookie: await issueSession(existingCred.user_id, existingCred.version),
      };
    }

    // 1. Try Firebase Auth first (handles both new users and users who reset their password via Firebase Email link)
    try {
      const fbUser = await firebaseSignIn(email, rawPassword);
      const cred = await syncLocalCredentialAfterFirebaseAuth(
        email,
        rawPassword,
        fbUser.displayName,
        fbUser.localId,
      );
      await database()
        .prepare('UPDATE accounts SET last_seen_at=? WHERE user_id=?')
        .bind(new Date().toISOString(), cred.user_id)
        .run();
      return { data: { ok: true }, cookie: await issueSession(cred.user_id, cred.version) };
    } catch {
      // Fall back to local D1/SQLite credential check (for pre-existing accounts or offline tests)
    }

    // 2. Fallback: verify against local D1/SQLite credentials table
    const valid = existingCred
      ? await checkPassword(rawPassword, existingCred.password_hash)
      : await hashPassword('unavailable-password-account').then(() => false);
    if (!existingCred || !valid) {
      throw new AuthError('Email atau kata sandi salah.', 401);
    }

    // Automatically upgrade/sync this verified local account into Firebase Auth in the background
    firebaseSignUp(email, rawPassword).catch(() => {});

    await database()
      .prepare('UPDATE accounts SET last_seen_at=? WHERE user_id=?')
      .bind(new Date().toISOString(), existingCred.user_id)
      .run();
    return {
      data: { ok: true },
      cookie: await issueSession(existingCred.user_id, existingCred.version),
    };
  }

  if (action === 'recover') {
    const email = canonicalEmail(body.email);
    await limit('recover-email:' + email, 5, 15 * 60000);
    const code = normalizedRecovery(body.recoveryCode),
      credential = await getCredential(email),
      encoded = await digest('recovery:' + code);
    if (code.length !== 48 || !credential || credential.recovery_hash !== encoded) {
      throw new AuthError('Email atau kode pemulihan tidak sesuai.', 401);
    }
    const newPass = passwordInput(body);
    const result = await replacePassword(credential, newPass, encoded);
    firebaseSignUp(email, newPass).catch(() => {});
    return { data: { ok: true }, cookie: result.cookie };
  }

  if (action === 'activate') {
    const platform =
      (await getChatGPTUser()) ||
      (await resolveIdentity().then((user) =>
        user?.authMethod === 'google' && user.emailVerified && !user.hasPassword ? user : null,
      ));
    if (!platform) {
      throw new AuthError('Masuk dengan Google terlebih dahulu.', 401);
    }
    const email = canonicalEmail(platform.email);
    await limit('activate-email:' + email, 8, 15 * 60000);
    const password = passwordInput(body),
      existing = await getCredential(email);

    firebaseSignUp(email, password, platform.displayName).catch(() => {});

    if (existing) {
      const result = await replacePassword(existing, password);
      await database()
        .prepare('UPDATE credentials SET email_verified=1 WHERE user_id=?')
        .bind(existing.user_id)
        .run();
      return { data: { ok: true, message: 'Kata sandi website berhasil diaktifkan.' }, cookie: result.cookie };
    }
    await ensureAccount(platform);
    const encoded = await hashPassword(password);
    await database()
      .prepare(
        'INSERT INTO credentials (user_id,email,password_hash,recovery_hash,version,email_verified,updated_at) VALUES (?,?,?,?,1,1,?)',
      )
      .bind(platform.userId, email, encoded, '', new Date().toISOString())
      .run();
    return {
      data: { ok: true, message: 'Kata sandi website berhasil diaktifkan.' },
      cookie: await issueSession(platform.userId, 1),
    };
  }

  const user = await resolveIdentity();
  if (!user) throw new AuthError('Silakan masuk kembali.', 401);
  const email = canonicalEmail(user.email);
  const credential = await getCredential(email);
  const oldPassword = typeof body.oldPassword === 'string' ? body.oldPassword : '';
  if (!credential || !(await checkPassword(oldPassword, credential.password_hash))) {
    throw new AuthError('Password saat ini salah.', 401);
  }
  await limit('change-email:' + user.email, 8, 15 * 60000);
  const newPassword = passwordInput(body);

  // Also update password in Firebase Auth if connected
  try {
    const fbSession = await firebaseSignIn(email, oldPassword);
    await firebaseUpdatePassword(fbSession.idToken, newPassword);
  } catch {
    firebaseSignUp(email, newPassword, user.displayName).catch(() => {});
  }

  const result = await replacePassword(credential, newPassword);
  return {
    data: { ok: true, message: 'Kata sandi berhasil diperbarui.' },
    cookie: result.cookie,
  };
}
