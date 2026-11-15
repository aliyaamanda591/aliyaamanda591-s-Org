import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createSqliteD1 } from './d1-sqlite';
import { runWithRequestHeaders } from './request-context';
import { sessionCookie, SESSION_COOKIE } from './auth-crypto';
import { validateState } from './state-validation';

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
