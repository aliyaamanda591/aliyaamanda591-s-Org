import { PasswordResetError } from './password-reset';

type MailEnvironment = { RESEND_API_KEY?: string; AUTH_EMAIL_FROM?: string };
export function recoveryMailSender(env: MailEnvironment, sendFetch: typeof fetch = fetch) {
  const key = env.RESEND_API_KEY?.trim(), from = env.AUTH_EMAIL_FROM?.trim();
  if (!key || !from || /[\r\n]/.test(from)) throw new PasswordResetError(
    'Pengiriman OTP belum diaktifkan oleh pengelola. Sementara, gunakan Google dengan email yang sama atau kode pemulihan lama.', 503);
  return async (email: string, otp: string, id: string) => {
    const response = await sendFetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(10_000),
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', 'Idempotency-Key': 'sidaps-reset/' + id },
      body: JSON.stringify({ from, to: [email], subject: 'Kode OTP pemulihan sandi SIDAPS Portfolio',
        text: `Kode OTP SIDAPS Portfolio: ${otp}\n\nBerlaku 10 menit, hanya untuk mengganti sandi SIDAPS. Jangan bagikan kode ini kepada siapa pun, termasuk pengelola. Jika Anda tidak meminta pemulihan, abaikan email ini. Sandi belum berubah.`,
        html: `<div style="background:#081c15;color:#edf4ef;padding:28px;font-family:Arial,sans-serif;max-width:480px;margin:auto;border-radius:16px"><p style="color:#d0b36c;letter-spacing:2px">SIDAPS PORTFOLIO</p><h2>Pulihkan sandi Anda</h2><p>Masukkan kode berikut pada halaman pemulihan yang Anda buka.</p><p style="font-size:32px;letter-spacing:8px;color:#b3cfbc;font-weight:700">${otp}</p><p>Berlaku 10 menit. Kode ini hanya untuk sandi SIDAPS, bukan sandi Gmail.</p><p>Jangan bagikan kode kepada siapa pun, termasuk pengelola. Jika Anda tidak meminta pemulihan, abaikan email ini. Sandi Anda belum berubah.</p></div>` }),
    });
    if (!response.ok) throw new Error('Recovery email rejected');
    const data = await response.json() as { id?: string };
    if (!data.id) throw new Error('Recovery email not accepted');
  };
}
