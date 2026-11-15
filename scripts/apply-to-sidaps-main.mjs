import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SOURCE_REPO = 'https://github.com/aliyaamanda591/aliyaamanda591-s-Org.git';
const SAFE_FILES = [
  'app/route.ts',
  'app/reset-password/route.ts',
  'lib/firebase-auth.ts',
  'lib/email-auth.ts',
  'lib/email-auth-client.js',
  'lib/login-html.ts',
  'lib/portfolio-html.ts',
  'lib/recovery-mail.ts',
  'public/recovery-otp.js',
  'public/recovery-otp.css',
  'public/login-experience.js',
];

const cwd = process.cwd();
const args = process.argv.slice(2);
const shouldPush = args.includes('--push');
const fromDirIdx = args.indexOf('--from-dir');
const fromDir = fromDirIdx >= 0 ? path.resolve(args[fromDirIdx + 1] || '') : '';

const dbFile = path.join(cwd, 'lib', 'database.ts');
if (!fs.existsSync(dbFile) || !fs.readFileSync(dbFile, 'utf8').includes('cloudflare:workers')) {
  console.error('Skrip ini harus dijalankan di dalam folder repo utama SIDAPS-PORTFOLIO (Cloudflare Workers).');
  process.exit(1);
}

if (fromDir) {
  for (const rel of SAFE_FILES) {
    const srcPath = path.join(fromDir, rel);
    const dstPath = path.join(cwd, rel);
    if (!fs.existsSync(srcPath)) {
      throw new Error('File sumber tidak ditemukan: ' + rel);
    }
    fs.mkdirSync(path.dirname(dstPath), { recursive: true });
    fs.copyFileSync(srcPath, dstPath);
  }
} else {
  execFileSync('git', ['fetch', SOURCE_REPO, 'main'], { stdio: 'inherit' });
  execFileSync('git', ['checkout', 'FETCH_HEAD', '--', ...SAFE_FILES], { stdio: 'inherit' });
}

// 1. Adapt lib/recovery-mail.ts to read Cloudflare Workers env first, then process.env
const recoveryMailPath = path.join(cwd, 'lib', 'recovery-mail.ts');
let recoveryMail = fs.readFileSync(recoveryMailPath, 'utf8');
if (!recoveryMail.includes("from 'cloudflare:workers'")) {
  recoveryMail = "import { env as workerEnv } from 'cloudflare:workers';\n" + recoveryMail;
}
recoveryMail = recoveryMail.replace(
  /export function getMailEnvironment\(\): MailEnvironment \{[\s\S]*?\n\}/,
  `export function getMailEnvironment(): MailEnvironment {
  const cf = workerEnv as unknown as MailEnvironment;
  const p: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {};
  return {
    RESEND_API_KEY: cf.RESEND_API_KEY ?? p.RESEND_API_KEY,
    BREVO_API_KEY: cf.BREVO_API_KEY ?? p.BREVO_API_KEY,
    MAIL_WEBHOOK_URL: cf.MAIL_WEBHOOK_URL ?? p.MAIL_WEBHOOK_URL,
    MAIL_WEBHOOK_SECRET: cf.MAIL_WEBHOOK_SECRET ?? p.MAIL_WEBHOOK_SECRET,
    AUTH_EMAIL_FROM: cf.AUTH_EMAIL_FROM ?? p.AUTH_EMAIL_FROM,
    OWNER_EMAIL: cf.OWNER_EMAIL ?? p.OWNER_EMAIL,
    APP_URL: cf.APP_URL ?? p.APP_URL,
  };
}`,
);
fs.writeFileSync(recoveryMailPath, recoveryMail);

// 2. Update minimum password length 12 -> 8 while preserving __Host-investment_session
const authCryptoPath = path.join(cwd, 'lib', 'auth-crypto.ts');
let authCrypto = fs.readFileSync(authCryptoPath, 'utf8');
authCrypto = authCrypto
  .replace('value.length<12', 'value.length<8')
  .replace('Password minimal 12 karakter.', 'Password minimal 8 karakter.');
fs.writeFileSync(authCryptoPath, authCrypto);

// 3. Ensure cloudflare-env.d.ts declares all custom mail & auth env vars
fs.writeFileSync(
  path.join(cwd, 'cloudflare-env.d.ts'),
  `declare namespace Cloudflare {
  interface Env {
    RESEND_API_KEY?: string;
    BREVO_API_KEY?: string;
    MAIL_WEBHOOK_URL?: string;
    MAIL_WEBHOOK_SECRET?: string;
    AUTH_EMAIL_FROM?: string;
    OWNER_EMAIL?: string;
    APP_URL?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
`,
);

// 4. Clean up helper script if it was checked out inside SIDAPS-PORTFOLIO
const selfInsideMain = path.join(cwd, 'scripts', 'apply-to-sidaps-main.mjs');
if (fs.existsSync(selfInsideMain)) {
  fs.unlinkSync(selfInsideMain);
}

execFileSync('git', ['add', ...SAFE_FILES, 'lib/auth-crypto.ts', 'cloudflare-env.d.ts'], { stdio: 'inherit' });

if (shouldPush) {
  const status = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();
  if (!status) {
    console.log('Semua file utama sudah paling baru. Tidak ada yang perlu di-push.');
    process.exit(0);
  }
  execFileSync('git', ['commit', '-m', 'Update sistem login dan email reset kata sandi Sidaps'], { stdio: 'inherit' });
  execFileSync('git', ['push', 'origin', 'main'], { stdio: 'inherit' });
  console.log('Berhasil push pembaruan ke SIDAPS-PORTFOLIO (main)!');
} else {
  execFileSync('git', ['status', '-s'], { stdio: 'inherit' });
}
