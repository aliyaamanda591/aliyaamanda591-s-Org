import { getChatGPTUser } from '@/app/chatgpt-auth';
import { database } from '../database';
import { resolveIdentity } from '../identity';
import { ensureAccount, isOwnerEmail } from '../account-store';
import {
  canonicalEmail,
  checkPassword,
  digest,
  hashPassword,
  normalizedRecovery,
  sessionCookie,
} from '../auth-crypto';
import { verifyGoogleToken } from '../firebase-google';
import { linkVerifiedGoogleAccount } from '../google-account-link';
import {
  FirebaseAuthRestError,
  firebaseSignIn,
  firebaseSignUp,
  firebaseUpdatePassword,
} from '../firebase-auth';
import {
  AuthError,
  getCredential,
  issueSession,
  limit,
  passwordInput,
  replacePassword,
  syncLocalCredentialAfterFirebaseAuth,
} from './session-helpers';

export async function handleGoogleAuthAction(
  body: Record<string, unknown>,
  ip: string,
): Promise<{ data: Record<string, unknown>; cookie?: string }> {
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

export async function handleLogoutAction(
  request: Request,
): Promise<{ data: Record<string, unknown>; cookie?: string }> {
  const { SESSION_COOKIE } = await import('../auth-crypto');
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

export async function handleRegisterAction(
  body: Record<string, unknown>,
  ip: string,
): Promise<{ data: Record<string, unknown>; cookie?: string }> {
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

export async function handleLoginAction(
  body: Record<string, unknown>,
): Promise<{ data: Record<string, unknown>; cookie?: string }> {
  const email = canonicalEmail(body.email);
  await limit('login-email:' + email, 15, 15 * 60000);
  const rawPassword = typeof body.password === 'string' ? body.password : '';
  if (!rawPassword) throw new AuthError('Masukkan kata sandi.', 400);

  const existingCred = await getCredential(email);
  if (existingCred?.recovery_hash === 'local-reset') {
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
    // Fall back to local credential check
  }

  const valid = existingCred
    ? await checkPassword(rawPassword, existingCred.password_hash)
    : await hashPassword('unavailable-password-account').then(() => false);
  if (!existingCred || !valid) {
    throw new AuthError('Email atau kata sandi salah.', 401);
  }

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

export async function handleRecoverAction(
  body: Record<string, unknown>,
): Promise<{ data: Record<string, unknown>; cookie?: string }> {
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

export async function handleActivateAction(
  body: Record<string, unknown>,
): Promise<{ data: Record<string, unknown>; cookie?: string }> {
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

export async function handleChangePasswordAction(
  body: Record<string, unknown>,
): Promise<{ data: Record<string, unknown>; cookie?: string }> {
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
