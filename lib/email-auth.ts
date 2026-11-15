import { AuthError, ensurePasswordResetTable, limit } from './auth/session-helpers';
import {
  handleConfirmResetAction,
  handleRequestResetAction,
  handleVerifyResetAction,
} from './auth/reset-handlers';
import {
  handleActivateAction,
  handleChangePasswordAction,
  handleGoogleAuthAction,
  handleLoginAction,
  handleLogoutAction,
  handleRecoverAction,
  handleRegisterAction,
} from './auth/account-handlers';

export { AuthError, ensurePasswordResetTable };

export async function handleEmailAuth(
  action: string,
  body: Record<string, unknown>,
  request: Request,
): Promise<{ data: Record<string, unknown>; cookie?: string }> {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'local';

  if (action === 'google') return handleGoogleAuthAction(body, ip);
  if (action === 'logout') return handleLogoutAction(request);

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

  if (action === 'request-otp' || action === 'request-reset') {
    return handleRequestResetAction(body, request, ip);
  }
  if (action === 'verify-reset') return handleVerifyResetAction(body);
  if (action === 'confirm-reset' || action === 'reset-otp') return handleConfirmResetAction(body);
  if (action === 'register') return handleRegisterAction(body, ip);
  if (action === 'login') return handleLoginAction(body);
  if (action === 'recover') return handleRecoverAction(body);
  if (action === 'activate') return handleActivateAction(body);

  return handleChangePasswordAction(body);
}
