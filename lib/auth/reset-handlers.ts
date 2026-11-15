import { database } from '../database';
import { canonicalEmail, digest, hashPassword, randomToken } from '../auth-crypto';
import {
  FirebaseAuthRestError,
  firebaseConfirmPasswordReset,
  firebaseSendPasswordResetEmail,
  firebaseSignUp,
  firebaseVerifyPasswordResetCode,
} from '../firebase-auth';
import { getMailEnvironment, hasCustomMailer, sendBrandedResetEmail } from '../recovery-mail';
import { PasswordResetError } from '../password-reset';
import {
  AuthError,
  decodeEmailFromResetToken,
  ensurePasswordResetTable,
  getCredential,
  issueSession,
  limit,
  passwordInput,
  syncLocalCredentialAfterFirebaseAuth,
  toBase64Url,
} from './session-helpers';

export async function handleRequestResetAction(
  body: Record<string, unknown>,
  request: Request,
  ip: string,
): Promise<{ data: Record<string, unknown> }> {
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
    const tempPassword = 'Sidaps!' + randomToken(12);
    await firebaseSignUp(email, tempPassword, existingAccount?.display_name || email.split('@')[0]).catch(
      () => {},
    );
  }

  try {
    await firebaseSendPasswordResetEmail(email);
  } catch (error) {
    if (error instanceof FirebaseAuthRestError && error.code === 'EMAIL_NOT_FOUND') {
      // Do not leak whether an unknown email is registered
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

export async function handleVerifyResetAction(
  body: Record<string, unknown>,
): Promise<{ data: Record<string, unknown> }> {
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

export async function handleConfirmResetAction(
  body: Record<string, unknown>,
): Promise<{ data: Record<string, unknown>; cookie?: string }> {
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
