import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createSqliteD1 } from './d1-sqlite';
import { runWithRequestHeaders } from './request-context';
import { sessionCookie, SESSION_COOKIE, validatePassword } from './auth-crypto';
import { FirebaseAuthRestError } from './firebase-auth';
import { validateState } from './state-validation';
import { buildBrandedResetEmail, hasCustomMailer, sendBrandedResetEmail } from './recovery-mail';
import { landingHtml } from './landing-html';
import { loginHtml } from './login-html';
import { portfolioHtml } from './portfolio-html';
import { renderDemoPortfolio } from './demo-portfolio';

test('createSqliteD1 runs drizzle migrations and supports prepare/bind/first/all/run/batch', async () => {
  const db = createSqliteD1(':memory:', path.join(process.cwd(), 'drizzle'));

  const now = '2026-11-15T00:00:00.000Z';
  const batchRes = await db.batch([
    db
      .prepare('INSERT INTO accounts (user_id, email, display_name, created_at) VALUES (?, ?, ?, ?)')
      .bind('u1', 'test@example.com', 'Tester', now),
    db
      .prepare('INSERT INTO portfolios (user_id, data, revision, updated_at) VALUES (?, ?, 0, ?)')
      .bind('u1', JSON.stringify({ transactions: [], assets: [], profile: { displayName: 'Tester', photo: '' }, logs: [], sheetUrl: '', lastBackup: '' }), now),
    db.prepare('SELECT user_id, email, display_name FROM accounts WHERE user_id = ?').bind('u1'),
  ]);

  assert.equal(batchRes.length, 3);
  assert.equal(batchRes[2].results.length, 1);
  assert.equal(batchRes[2].results[0].email, 'test@example.com');

  const updated = await db
    .prepare('UPDATE portfolios SET revision = revision + 1 WHERE user_id = ? AND revision = ? RETURNING revision')
    .bind('u1', 0)
    .first<{ revision: number }>();
  assert.deepEqual(updated, { revision: 1 });

  const missing = await db
    .prepare('SELECT user_id FROM accounts WHERE user_id = ?')
    .bind('nonexistent')
    .first();
  assert.equal(missing, null);

  const allAccounts = await db.prepare('SELECT user_id FROM accounts').all<{ user_id: string }>();
  assert.equal(allAccounts.results.length, 1);
});

test('sessionCookie adapts Secure/SameSite flags for HTTP vs HTTPS requests', () => {
  const expires = Date.now() + 60_000;

  const httpCookie = runWithRequestHeaders(new Headers({ host: 'localhost:3000' }), () =>
    sessionCookie('abc123', expires),
  );
  assert.match(httpCookie, new RegExp(`^${SESSION_COOKIE}=abc123;`));
  assert.ok(!httpCookie.includes('Secure'));
  assert.ok(httpCookie.includes('SameSite=Lax'));

  const httpsCookie = runWithRequestHeaders(
    new Headers({ 'x-forwarded-proto': 'https', origin: 'https://example.run.app' }),
    () => sessionCookie('abc123', expires),
  );
  assert.ok(httpsCookie.includes('Secure'));
  assert.ok(httpsCookie.includes('SameSite=None'));
});

test('validateState sanitizes valid portfolio state', () => {
  const state = validateState({
    transactions: [],
    assets: [],
    profile: { displayName: '  Denny  ', photo: '' },
    logs: [],
    sheetUrl: '',
    lastBackup: '',
  });
  assert.equal(state.profile.displayName, 'Denny');
  assert.deepEqual(state.assets, []);
});

test('validatePassword enforces 8-72 character bounds', () => {
  assert.throws(() => validatePassword('1234567'), /Password minimal 8 karakter\./);
  assert.equal(validatePassword('12345678'), '12345678');
  assert.throws(() => validatePassword('a'.repeat(73)), /Password terlalu panjang; maksimal 72 byte UTF-8\./);
});

test('FirebaseAuthRestError preserves status and Firebase error code', () => {
  const err = new FirebaseAuthRestError('Access blocked', 'TOO_MANY_ATTEMPTS_TRY_LATER', 400);
  assert.equal(err.code, 'TOO_MANY_ATTEMPTS_TRY_LATER');
  assert.equal(err.status, 400);
  assert.ok(err instanceof Error);
});

test('buildBrandedResetEmail renders clean branded HTML email and detects mailer config', () => {
  const built = buildBrandedResetEmail('user@example.com', 'https://sidaps.example/reset-password?token=abc123');
  assert.equal(built.subject, 'Atur Ulang Kata Sandi · Sidaps Portfolio');
  assert.ok(built.html.includes('Buat Kata Sandi Baru'));
  assert.ok(built.html.includes('https://sidaps.example/reset-password?token=abc123'));
  assert.ok(built.html.includes('user@example.com'));

  assert.equal(hasCustomMailer({}), false);
  assert.equal(hasCustomMailer({ BREVO_API_KEY: 'x', OWNER_EMAIL: 'a@b.com' }), true);
  assert.equal(hasCustomMailer({ MAIL_WEBHOOK_URL: 'https://script.google.com/macros/s/abc/exec' }), true);
});

test('sendBrandedResetEmail rejects Apps Script HTTP 200 Forbidden or HTML responses and accepts ok:true', async () => {
  await assert.rejects(
    () =>
      sendBrandedResetEmail(
        'user@example.com',
        'https://sidaps.example/reset-password?token=abc',
        { MAIL_WEBHOOK_URL: 'https://script.google.com/macros/s/abc/exec', MAIL_WEBHOOK_SECRET: 'wrong' },
        (async () => new Response('Forbidden', { status: 200 })) as typeof fetch,
      ),
    /Forbidden/,
  );

  await assert.rejects(
    () =>
      sendBrandedResetEmail(
        'user@example.com',
        'https://sidaps.example/reset-password?token=abc',
        { MAIL_WEBHOOK_URL: 'https://script.google.com/macros/s/abc/exec', MAIL_WEBHOOK_SECRET: 'good' },
        (async () => new Response('<html>Sign in</html>', { status: 200 })) as typeof fetch,
      ),
    /HTML/,
  );

  await assert.doesNotReject(() =>
    sendBrandedResetEmail(
      'user@example.com',
      'https://sidaps.example/reset-password?token=abc',
      { MAIL_WEBHOOK_URL: 'https://script.google.com/macros/s/abc/exec', MAIL_WEBHOOK_SECRET: 'good' },
      (async () => new Response('{"ok":true}', { status: 200 })) as typeof fetch,
    ),
  );
});

test('password_reset_otps table DDL is idempotent when missing from an older database', async () => {
  const db = createSqliteD1(':memory:', path.join(process.cwd(), 'drizzle'));
  await db.prepare('DROP TABLE IF EXISTS password_reset_otps').run();
  await db
    .prepare(
      'CREATE TABLE IF NOT EXISTS password_reset_otps (email_hash text PRIMARY KEY NOT NULL, challenge_hash text NOT NULL, otp_hash text NOT NULL, user_id text, credential_version integer NOT NULL, attempts integer DEFAULT 0 NOT NULL, requested_at integer NOT NULL, expires_at integer NOT NULL, ready integer DEFAULT 0 NOT NULL, FOREIGN KEY (user_id) REFERENCES accounts(user_id) ON UPDATE no action ON DELETE no action)',
    )
    .run();
  await db
    .prepare(
      'CREATE UNIQUE INDEX IF NOT EXISTS password_reset_otps_challenge_hash_unique ON password_reset_otps (challenge_hash)',
    )
    .run();
  const row = await db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='password_reset_otps'")
    .first<{ name: string }>();
  assert.equal(row?.name, 'password_reset_otps');
});

test('modular landing, login, and portfolio HTML assemblies include required markers and demo compatibility', () => {
  assert.ok(landingHtml.includes('id="marketWatch"'));
  assert.ok(landingHtml.includes('landing_hero') === false);
  assert.ok(landingHtml.includes('Sidaps Portfolio'));

  assert.ok(loginHtml.includes('id="emailAuthForm"'));
  assert.ok(loginHtml.includes('/recovery-otp.js?v=6'));
  assert.ok(loginHtml.includes('/login-experience.js?v=4'));

  assert.ok(portfolioHtml.includes('/*__CLOUD_BOOTSTRAP__*/null'));
  assert.ok(portfolioHtml.includes('const stockCatalog='));
  assert.ok(portfolioHtml.includes('let cryptoCatalog='));
  assert.ok(portfolioHtml.includes('const PLATFORM_CATALOG='));

  const demoHtml = renderDemoPortfolio(portfolioHtml);
  assert.ok(demoHtml.includes('Trader Demo'));
  assert.ok(demoHtml.includes('/demo-mode.js?v=1'));
  assert.ok(!demoHtml.includes('/*__CLOUD_BOOTSTRAP__*/null'));
});


