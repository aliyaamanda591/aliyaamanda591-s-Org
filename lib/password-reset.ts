import { canonicalEmail, digest, hashPassword, randomToken } from './auth-crypto';

export class PasswordResetError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export const RESET_TTL_MS = 10 * 60_000;
export const RESET_RESEND_MS = 60_000;
const INVALID = 'OTP tidak sesuai, kedaluwarsa, atau sudah digunakan. Minta kode baru.';
type ResetRow = { challenge_hash: string; otp_hash: string; user_id: string | null; credential_version: number; attempts: number };
type Sender = (email: string, otp: string, id: string) => Promise<void>;

// Rejection sampling avoids bias. The browser receives a separate 256-bit secret;
// only its hash and a hash binding that secret to the OTP are stored in D1.
export function newOtp() {
  const range = 0x100000000, bound = range - range % 1_000_000;
  let n: number;
  do { n = crypto.getRandomValues(new Uint32Array(1))[0]; } while (n >= bound);
  return String(n % 1_000_000).padStart(6, '0');
}
export async function requestPasswordReset(db: D1Database, emailInput: unknown, send: Sender, now = Date.now()) {
  const email = canonicalEmail(emailInput), emailHash = await digest('reset-email:' + email);
  const requestId = randomToken(), challengeHash = await digest(requestId), otp = newOtp();
  const credential = await db.prepare('SELECT user_id,version FROM credentials WHERE email=?').bind(email).first<{ user_id: string; version: number }>();
  const accepted = await db.prepare(`INSERT INTO password_reset_otps
    (email_hash,challenge_hash,otp_hash,user_id,credential_version,attempts,requested_at,expires_at,ready)
    VALUES (?,?,?,?,?,0,?,?,0) ON CONFLICT(email_hash) DO UPDATE SET
    challenge_hash=excluded.challenge_hash,otp_hash=excluded.otp_hash,user_id=excluded.user_id,
    credential_version=excluded.credential_version,attempts=0,requested_at=excluded.requested_at,
    expires_at=excluded.expires_at,ready=0 WHERE requested_at<=? RETURNING challenge_hash`)
    .bind(emailHash, challengeHash, await digest('reset-otp:' + requestId + ':' + email + ':' + otp), credential?.user_id ?? null, credential?.version ?? 0, now, now + RESET_TTL_MS, now - RESET_RESEND_MS).first();
  if (!accepted) throw new PasswordResetError('Tunggu 60 detik sebelum meminta OTP lagi.', 429);
  try {
    // Unknown addresses get the same response without sending unsolicited mail.
    if (credential) await send(email, otp, challengeHash);
    await db.prepare('UPDATE password_reset_otps SET ready=1 WHERE challenge_hash=?').bind(challengeHash).run();
    await db.prepare('DELETE FROM password_reset_otps WHERE expires_at<?').bind(now - 86_400_000).run();
  } catch {
    await db.prepare('DELETE FROM password_reset_otps WHERE challenge_hash=?').bind(challengeHash).run();
    throw new PasswordResetError('Email OTP belum berhasil dikirim. Coba lagi sebentar atau lanjutkan dengan Google menggunakan email yang sama.', 503);
  }
  return { ok: true, requestId, expiresIn: RESET_TTL_MS / 1000, retryAfter: RESET_RESEND_MS / 1000,
    message: 'Jika email terdaftar, OTP dikirim ke kotak masuknya. Periksa juga folder Spam. Kode berlaku 10 menit.' };
}

export async function finishPasswordReset(db: D1Database, body: Record<string, unknown>, now = Date.now()) {
  const started = Date.now();
  const email = canonicalEmail(body.email);
  if (typeof body.requestId !== 'string' || !/^[a-f0-9]{64}$/.test(body.requestId) || typeof body.otp !== 'string' || !/^\d{6}$/.test(body.otp)) throw new PasswordResetError(INVALID, 401);
  if (body.password !== body.confirm) throw new PasswordResetError('Konfirmasi password tidak sama.');
  const challengeHash = await digest(body.requestId);
  // Each attempt is charged atomically before comparison, including valid ones.
  const row = await db.prepare(`UPDATE password_reset_otps SET attempts=attempts+1
    WHERE challenge_hash=? AND email_hash=? AND ready=1 AND expires_at>? AND attempts<5
    RETURNING challenge_hash,otp_hash,user_id,credential_version,attempts`)
    .bind(challengeHash, await digest('reset-email:' + email), now).first<ResetRow>();
  const otpHash = await digest('reset-otp:' + body.requestId + ':' + email + ':' + body.otp);
  if (!row?.user_id || row.otp_hash !== otpHash) throw new PasswordResetError(INVALID, 401);
  const passwordHash = await hashPassword(body.password);
  // Version CAS + challenge predicate is the single-use boundary. Concurrent
  // resets, password changes, resends, and Google linking cannot reuse this proof.
  const updated = await db.prepare(`UPDATE credentials SET password_hash=?,recovery_hash='',
    version=version+1,email_verified=1,updated_at=? WHERE user_id=? AND email=? AND version=?
    AND EXISTS (SELECT 1 FROM password_reset_otps WHERE challenge_hash=? AND otp_hash=?
      AND ready=1 AND attempts<=5 AND expires_at>?) RETURNING user_id,version`)
    .bind(passwordHash, new Date(now).toISOString(), row.user_id, email, row.credential_version, challengeHash, otpHash, now + Math.max(0, Date.now() - started))
    .first<{ user_id: string; version: number }>();
  if (!updated) throw new PasswordResetError(INVALID, 401);
  await db.batch([
    db.prepare('DELETE FROM sessions WHERE user_id=? AND credential_version<>?').bind(updated.user_id, updated.version),
    db.prepare('DELETE FROM password_reset_otps WHERE challenge_hash=?').bind(challengeHash),
  ]);
  return updated;
}
