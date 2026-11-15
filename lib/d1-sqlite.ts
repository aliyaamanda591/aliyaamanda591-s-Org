import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import type { D1Database, D1PreparedStatement, D1Result } from './env-types';

function toSqlValue(value: unknown): SQLInputValue {
  if (value === undefined || value === null) return null;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'number' || typeof value === 'string' || typeof value === 'bigint' || value instanceof Uint8Array) {
    return value;
  }
  return String(value);
}

function returnsRows(sql: string): boolean {
  return /^\s*(SELECT|PRAGMA|WITH)\b|\bRETURNING\b/i.test(sql);
}

class SqlitePreparedStatement implements D1PreparedStatement {
  private readonly db: DatabaseSync;
  private readonly sql: string;
  private readonly params: SQLInputValue[];

  constructor(db: DatabaseSync, sql: string, params: SQLInputValue[] = []) {
    this.db = db;
    this.sql = sql;
    this.params = params;
  }

  bind(...values: unknown[]): D1PreparedStatement {
    return new SqlitePreparedStatement(this.db, this.sql, values.map(toSqlValue));
  }

  async first<T = Record<string, unknown>>(colName?: string): Promise<T | null> {
    const stmt = this.db.prepare(this.sql);
    const row = stmt.get(...this.params) as Record<string, unknown> | undefined;
    if (!row) return null;
    if (colName !== undefined) {
      return (row[colName] as T) ?? null;
    }
    return { ...row } as T;
  }

  async all<T = Record<string, unknown>>(): Promise<D1Result<T>> {
    const stmt = this.db.prepare(this.sql);
    const results = (stmt.all(...this.params) as Record<string, unknown>[]).map((r) => ({ ...r }) as T);
    return { results, success: true, meta: {} };
  }

  async run(): Promise<D1Result> {
    const stmt = this.db.prepare(this.sql);
    if (returnsRows(this.sql)) {
      const results = (stmt.all(...this.params) as Record<string, unknown>[]).map((r) => ({ ...r }));
      return { results, success: true, meta: { changes: results.length } };
    }
    const info = stmt.run(...this.params);
    return {
      results: [],
      success: true,
      meta: {
        changes: Number(info.changes ?? 0),
        last_row_id: Number(info.lastInsertRowid ?? 0),
      },
    };
  }

  executeInBatch<T = Record<string, unknown>>(): D1Result<T> {
    const stmt = this.db.prepare(this.sql);
    if (returnsRows(this.sql)) {
      const results = (stmt.all(...this.params) as Record<string, unknown>[]).map((r) => ({ ...r }) as T);
      return { results, success: true, meta: { changes: results.length } };
    }
    const info = stmt.run(...this.params);
    return {
      results: [],
      success: true,
      meta: {
        changes: Number(info.changes ?? 0),
        last_row_id: Number(info.lastInsertRowid ?? 0),
      },
    };
  }
}

export function applyMigrations(db: DatabaseSync, migrationsDir: string) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS _sidaps_migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);
  if (!fs.existsSync(migrationsDir)) return;
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();
  const hasMigration = db.prepare('SELECT 1 FROM _sidaps_migrations WHERE name = ?');
  const markMigration = db.prepare('INSERT INTO _sidaps_migrations (name, applied_at) VALUES (?, ?)');
  for (const file of files) {
    if (hasMigration.get(file)) continue;
    const raw = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    const statements = raw
      .split('--> statement-breakpoint')
      .map((part) => part.trim())
      .filter(Boolean);
    db.exec('BEGIN');
    try {
      for (const sql of statements) {
        db.exec(sql);
      }
      markMigration.run(file, new Date().toISOString());
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }
}

export function createSqliteD1(dbPath?: string, migrationsDir?: string): D1Database {
  const target = dbPath ?? process.env.SIDAPS_DB_PATH ?? path.join(process.cwd(), 'data', 'sidaps.sqlite');
  if (target !== ':memory:') {
    fs.mkdirSync(path.dirname(target), { recursive: true });
  }
  const db = new DatabaseSync(target);
  if (target !== ':memory:') {
    db.exec('PRAGMA journal_mode = WAL;');
  }
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA busy_timeout = 5000;');
  applyMigrations(db, migrationsDir ?? path.join(process.cwd(), 'drizzle'));

  return {
    prepare(query: string): D1PreparedStatement {
      return new SqlitePreparedStatement(db, query);
    },
    async batch<T = Record<string, unknown>>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
      db.exec('BEGIN');
      try {
        const results = statements.map((statement) => {
          if (!(statement instanceof SqlitePreparedStatement)) {
            throw new Error('Unsupported prepared statement in batch');
          }
          return statement.executeInBatch<T>();
        });
        db.exec('COMMIT');
        return results;
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
  };
}

let singletonDb: D1Database | null = null;

export function getSqliteD1(): D1Database {
  if (!singletonDb) {
    singletonDb = createSqliteD1();
  }
  return singletonDb;
}
