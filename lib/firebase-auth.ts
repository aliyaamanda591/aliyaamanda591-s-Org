import firebaseConfig from './firebase-web-config.json';

const IDENTITY_TOOLKIT_BASE = 'https://identitytoolkit.googleapis.com/v1';

export type FirebaseAuthResult = {
  localId: string;
  email: string;
  displayName?: string;
  idToken: string;
};

type IdentityToolkitErrorResponse = {
  error?: {
    code?: number;
    message?: string;
  };
};

export class FirebaseAuthRestError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}

function mapFirebaseError(code: string): { message: string; status: number } {
  const clean = code.split(' : ')[0].trim();
  switch (clean) {
    case 'EMAIL_EXISTS':
      return {
        message: 'Email sudah terdaftar. Silakan masuk atau gunakan Lupa sandi.',
        status: 409,
      };
    case 'INVALID_EMAIL':
      return { message: 'Format alamat email tidak valid.', status: 400 };
    case 'WEAK_PASSWORD':
      return { message: 'Kata sandi minimal 8 karakter.', status: 400 };
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_PASSWORD':
    case 'INVALID_LOGIN_CREDENTIALS':
      return { message: 'Email atau kata sandi salah.', status: 401 };
    case 'USER_DISABLED':
      return { message: 'Akun ini sedang dinonaktifkan.', status: 403 };
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
    case 'RESET_PASSWORD_EXCEED_LIMIT':
      return {
        message: 'Terlalu banyak permintaan. Silakan tunggu beberapa menit lalu coba lagi.',
        status: 429,
      };
    case 'EXPIRED_OOB_CODE':
      return {
        message: 'Tautan reset sandi sudah kedaluwarsa. Silakan minta tautan baru.',
        status: 400,
      };
    case 'INVALID_OOB_CODE':
      return {
        message: 'Tautan reset sandi tidak valid atau sudah digunakan.',
        status: 400,
      };
    default:
      return {
        message: 'Layanan autentikasi sedang sibuk. Silakan coba beberapa saat lagi.',
        status: 503,
      };
  }
}

async function callIdentityToolkit<T>(
  endpoint: string,
  payload: Record<string, unknown>,
  fetchFn: typeof fetch = fetch,
  extraHeaders?: Record<string, string>,
): Promise<T> {
  const apiKey = firebaseConfig.apiKey;
  const response = await fetchFn(
    `${IDENTITY_TOOLKIT_BASE}/${endpoint}?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      signal: AbortSignal.timeout(10_000),
      headers: {
        'Content-Type': 'application/json',
        ...extraHeaders,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = (await response.json().catch(() => ({}))) as T & IdentityToolkitErrorResponse;
  if (!response.ok || data?.error) {
    const rawCode = data?.error?.message || `HTTP_${response.status}`;
    const mapped = mapFirebaseError(rawCode);
    throw new FirebaseAuthRestError(mapped.message, rawCode.split(' : ')[0].trim(), mapped.status);
  }
  return data;
}

export async function firebaseSignUp(
  email: string,
  password: string,
  displayName?: string,
  fetchFn: typeof fetch = fetch,
): Promise<FirebaseAuthResult> {
  return callIdentityToolkit<FirebaseAuthResult>(
    'accounts:signUp',
    {
      email,
      password,
      ...(displayName ? { displayName } : {}),
      returnSecureToken: true,
    },
    fetchFn,
  );
}

export async function firebaseSignIn(
  email: string,
  password: string,
  fetchFn: typeof fetch = fetch,
): Promise<FirebaseAuthResult> {
  return callIdentityToolkit<FirebaseAuthResult>(
    'accounts:signInWithPassword',
    {
      email,
      password,
      returnSecureToken: true,
    },
    fetchFn,
  );
}

export async function firebaseSendPasswordResetEmail(
  email: string,
  continueUrl?: string,
  fetchFn: typeof fetch = fetch,
): Promise<{ email: string }> {
  return callIdentityToolkit<{ email: string }>(
    'accounts:sendOobCode',
    {
      requestType: 'PASSWORD_RESET',
      email,
      ...(continueUrl ? { continueUrl } : {}),
    },
    fetchFn,
    { 'X-Firebase-Locale': 'id' },
  );
}

export async function firebaseVerifyPasswordResetCode(
  oobCode: string,
  fetchFn: typeof fetch = fetch,
): Promise<{ email: string; requestType?: string }> {
  return callIdentityToolkit<{ email: string; requestType?: string }>(
    'accounts:resetPassword',
    {
      oobCode,
    },
    fetchFn,
  );
}

export async function firebaseConfirmPasswordReset(
  oobCode: string,
  newPassword: string,
  fetchFn: typeof fetch = fetch,
): Promise<{ email: string }> {
  return callIdentityToolkit<{ email: string }>(
    'accounts:resetPassword',
    {
      oobCode,
      newPassword,
    },
    fetchFn,
  );
}

export async function firebaseUpdatePassword(
  idToken: string,
  newPassword: string,
  fetchFn: typeof fetch = fetch,
): Promise<FirebaseAuthResult> {
  return callIdentityToolkit<FirebaseAuthResult>(
    'accounts:update',
    {
      idToken,
      password: newPassword,
      returnSecureToken: true,
    },
    fetchFn,
  );
}
