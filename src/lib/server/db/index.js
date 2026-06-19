import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { sql } from 'drizzle-orm';
import * as schema from './schema.js';

const client = createClient({ url: 'file:sqlite.db' });
export const db = drizzle(client, { schema });

/** @type {Promise<void> | null} */
let dbReadyPromise = null;

async function initializeDatabase() {
  try {
    await db.run(sql`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`);
  } catch (error) {
    console.warn('Failed to initialize users table:', error);
  }

  try {
    await db.run(sql`CREATE TABLE IF NOT EXISTS bugs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      test_case_id INTEGER REFERENCES test_cases(id),
      test_step_id INTEGER REFERENCES test_steps(id),
      reported_by_id INTEGER REFERENCES users(id),
      created_at INTEGER NOT NULL
    )`);
  } catch (error) {
    console.warn('Failed to initialize bugs table:', error);
  }

  try {
    await db.run(sql`ALTER TABLE test_cases ADD COLUMN status TEXT NOT NULL DEFAULT 'untested'`);
  } catch (error) {
    if (!/duplicate column name|already exists/i.test(String(error))) {
      console.warn('Failed to add test_cases.status column:', error);
    }
  }
}

export function ensureDbReady() {
  if (!dbReadyPromise) {
    dbReadyPromise = initializeDatabase();
  }

  return dbReadyPromise;
}

ensureDbReady();
