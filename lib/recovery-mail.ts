import { PasswordResetError } from './password-reset';

export type MailEnvironment = {
  RESEND_API_KEY?: string;
  BREVO_API_KEY?: string;
  MAIL_WEBHOOK_URL?: string;
  MAIL_WEBHOOK_SECRET?: string;
  AUTH_EMAIL_FROM?: string;
  OWNER_EMAIL?: string;
  APP_URL?: string;
};

function cleanHeaderValue(value: string | undefined): string {
  const trimmed = value?.trim() || '';
  if (!trimmed || /[\r\n]/.test(trimmed)) return '';
  return trimmed;
}

function parseFromHeader(rawFrom: string): { name: string; email: string } {
  const angle = rawFrom.match(/^(.*?)<([^>]+)>$/);
  if (angle) {
    return {
      name: angle[1].trim().replace(/^"|"$/g, '') || 'Sidaps Portfolio',
      email: angle[2].trim(),
    };
  }
  return { name: 'Sidaps Portfolio', email: rawFrom.trim() };
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function getMailEnvironment(): MailEnvironment {
  return {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    MAIL_WEBHOOK_URL: process.env.MAIL_WEBHOOK_URL,
    MAIL_WEBHOOK_SECRET: process.env.MAIL_WEBHOOK_SECRET,
    AUTH_EMAIL_FROM: process.env.AUTH_EMAIL_FROM,
    OWNER_EMAIL: process.env.OWNER_EMAIL,
    APP_URL: process.env.APP_URL,
  };
}

export function hasCustomMailer(env: MailEnvironment = getMailEnvironment()): boolean {
  const brevoKey = cleanHeaderValue(env.BREVO_API_KEY);
  const resendKey = cleanHeaderValue(env.RESEND_API_KEY);
  const webhookUrl = cleanHeaderValue(env.MAIL_WEBHOOK_URL);
  const fromEmail = cleanHeaderValue(env.AUTH_EMAIL_FROM) || cleanHeaderValue(env.OWNER_EMAIL);
  return Boolean((brevoKey && fromEmail) || (resendKey && cleanHeaderValue(env.AUTH_EMAIL_FROM)) || webhookUrl);
}

export function buildBrandedResetEmail(recipientEmail: string, resetUrl: string) {
  const safeEmail = escapeHtml(recipientEmail);
  const safeUrl = escapeHtml(resetUrl);
  const subject = 'Atur Ulang Kata Sandi · Sidaps Portfolio';

  const text = [
    'SIDAPS PORTFOLIO',
    '',
    'Permintaan Atur Ulang Kata Sandi',
    '',
    `Kami menerima permintaan untuk mengatur ulang kata sandi akun Sidaps Portfolio Anda (${recipientEmail}).`,
    '',
    'Silakan buka tautan berikut untuk membuat kata sandi baru:',
    resetUrl,
    '',
    'Tautan ini berlaku selama 15 menit dan hanya dapat digunakan satu kali.',
    'Jika Anda tidak merasa meminta perubahan ini, abaikan email ini. Kata sandi akun Anda tetap aman dan tidak berubah.',
  ].join('\n');

  const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#173c2d;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f7f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#ffffff;border:1px solid #dbe5dd;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#071b16;padding:24px 28px;border-bottom:2px solid #cfb376;">
              <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:2px;color:#dfc58d;text-transform:uppercase;">SIDAPS PORTFOLIO</p>
              <p style="margin:4px 0 0;font-size:11px;letter-spacing:0.6px;color:#9fc0ae;">Keamanan Akun</p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 28px 24px;">
              <h1 style="margin:0 0 12px;font-size:21px;line-height:1.35;font-weight:700;color:#143527;">Atur ulang kata sandi Anda</h1>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.65;color:#3c584a;">
                Halo, kami menerima permintaan untuk mengatur ulang kata sandi akun Sidaps Portfolio Anda (<strong style="color:#143527;">${safeEmail}</strong>).
              </p>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.65;color:#3c584a;">
                Klik tombol di bawah ini untuk langsung membuat kata sandi baru di website Sidaps Portfolio:
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center" style="border-radius:10px;background-color:#0f3a29;">
                    <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:600;color:#f5ebd0;text-decoration:none;border-radius:10px;border:1px solid #cfb376;">Buat Kata Sandi Baru</a>
                  </td>
                </tr>
              </table>
              <div style="padding:13px 15px;background-color:#f6faf7;border:1px solid #dce8e0;border-radius:10px;margin-bottom:20px;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#4f6b5c;">
                  Tautan ini hanya berlaku selama <strong>15 menit</strong> dan hanya dapat dipakai satu kali. Demi keamanan, jangan bagikan tautan ini kepada siapa pun.
                </p>
              </div>
              <p style="margin:0;font-size:12px;line-height:1.6;color:#667f71;">
                Jika Anda tidak pernah meminta pengaturan ulang kata sandi, abaikan saja email ini. Kata sandi akun Anda tetap aman dan tidak berubah.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background-color:#fafcfa;border-top:1px solid #e7efe9;">
              <p style="margin:0 0 6px;font-size:11px;line-height:1.5;color:#738b7d;">
                Jika tombol di atas tidak berfungsi, salin dan tempel tautan berikut di browser Anda:
              </p>
              <p style="margin:0;font-size:11px;line-height:1.5;word-break:break-all;">
                <a href="${safeUrl}" style="color:#0d7b50;text-decoration:underline;">${safeUrl}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

export async function sendBrandedResetEmail(
  recipientEmail: string,
  resetUrl: string,
  env: MailEnvironment = getMailEnvironment(),
  sendFetch: typeof fetch = fetch,
): Promise<void> {
  const { subject, text, html } = buildBrandedResetEmail(recipientEmail, resetUrl);
  const brevoKey = cleanHeaderValue(env.BREVO_API_KEY);
  const resendKey = cleanHeaderValue(env.RESEND_API_KEY);
  const webhookUrl = cleanHeaderValue(env.MAIL_WEBHOOK_URL);
  const rawFrom = cleanHeaderValue(env.AUTH_EMAIL_FROM) || cleanHeaderValue(env.OWNER_EMAIL);

  // 1. Brevo API (supports verified Gmail senders without requiring a custom domain)
  if (brevoKey && rawFrom) {
    const sender = parseFromHeader(rawFrom);
    const response = await sendFetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      signal: AbortSignal.timeout(10_000),
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender,
        to: [{ email: recipientEmail }],
        subject,
        textContent: text,
        htmlContent: html,
      }),
    });
    if (!response.ok) {
      throw new Error(`Brevo delivery failed (${response.status})`);
    }
    return;
  }

  // 2. Resend API
  if (resendKey && cleanHeaderValue(env.AUTH_EMAIL_FROM)) {
    const from = cleanHeaderValue(env.AUTH_EMAIL_FROM);
    const response = await sendFetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(10_000),
      headers: {
        Authorization: 'Bearer ' + resendKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [recipientEmail],
        subject,
        text,
        html,
      }),
    });
    if (!response.ok) {
      throw new Error(`Resend delivery failed (${response.status})`);
    }
    return;
  }

  // 3. Google Apps Script / Custom Mail Webhook
  if (webhookUrl) {
    const webhookSecret = cleanHeaderValue(env.MAIL_WEBHOOK_SECRET);
    const response = await sendFetch(webhookUrl, {
      method: 'POST',
      signal: AbortSignal.timeout(12_000),
      headers: {
        'Content-Type': 'application/json',
        ...(webhookSecret ? { 'X-Mail-Secret': webhookSecret } : {}),
      },
      body: JSON.stringify({
        secret: webhookSecret || undefined,
        to: recipientEmail,
        fromName: 'Sidaps Portfolio',
        subject,
        text,
        html,
      }),
    });
    const bodyText = (await response.text().catch(() => '')).trim();
    if (/^forbidden/i.test(bodyText)) {
      throw new PasswordResetError(
        'Webhook Apps Script menolak permintaan (Forbidden): pastikan nilai SECRET di Kode Apps Script sama persis dengan MAIL_WEBHOOK_SECRET di Secrets, lalu terapkan ulang sebagai Versi baru.',
        503,
      );
    }
    if (bodyText.startsWith('<')) {
      throw new PasswordResetError(
        'Webhook Apps Script mengembalikan halaman HTML: pastikan akses Web App disetel ke "Siapa saja (Anyone)" dan izin Gmail sudah disetujui di editor Apps Script.',
        503,
      );
    }
    if (!response.ok) {
      throw new PasswordResetError(`Webhook pengirim email gagal merespons (${response.status}).`, 503);
    }
    if (bodyText.startsWith('{')) {
      try {
        const parsed = JSON.parse(bodyText) as { ok?: boolean; error?: string };
        if (parsed.ok === false) {
          throw new PasswordResetError(
            parsed.error || 'Webhook pengirim email menolak pengiriman.',
            503,
          );
        }
      } catch (err) {
        if (err instanceof PasswordResetError) throw err;
      }
    }
    return;
  }

  throw new PasswordResetError(
    'Pengiriman email kustom belum dikonfigurasi.',
    503,
  );
}

export function recoveryMailSender(env: MailEnvironment, sendFetch: typeof fetch = fetch) {
  const key = env.RESEND_API_KEY?.trim(),
    from = env.AUTH_EMAIL_FROM?.trim();
  if (!key || !from || /[\r\n]/.test(from))
    throw new PasswordResetError(
      'Pengiriman OTP belum diaktifkan oleh pengelola. Sementara, gunakan Google dengan email yang sama atau kode pemulihan lama.',
      503,
    );
  return async (email: string, otp: string, id: string) => {
    const response = await sendFetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(10_000),
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Idempotency-Key': 'sidaps-reset/' + id,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Kode OTP pemulihan sandi SIDAPS Portfolio',
        text: `Kode OTP SIDAPS Portfolio: ${otp}\n\nBerlaku 10 menit, hanya untuk mengganti sandi SIDAPS.`,
        html: `<div style="background:#081c15;color:#edf4ef;padding:28px;font-family:Arial,sans-serif;max-width:480px;margin:auto;border-radius:16px"><p style="color:#d0b36c;letter-spacing:2px">SIDAPS PORTFOLIO</p><h2>Pulihkan sandi Anda</h2><p>Masukkan kode berikut pada halaman pemulihan yang Anda buka.</p><p style="font-size:32px;letter-spacing:8px;color:#b3cfbc;font-weight:700">${otp}</p><p>Berlaku 10 menit.</p></div>`,
      }),
    });
    if (!response.ok) throw new Error('Recovery email rejected');
    const data = (await response.json()) as { id?: string };
    if (!data.id) throw new Error('Recovery email not accepted');
  };
}
