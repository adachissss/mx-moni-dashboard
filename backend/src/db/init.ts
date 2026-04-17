import { db } from './sqlite.js';

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      api_key TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS selected_account (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL
    );
  `);
}
