import { db } from '../db/sqlite.js';
import { encrypt, decrypt } from '../lib/crypto.js';
import { CONFIG } from '../config.js';

export interface Account {
  id: number;
  name: string;
  apiKey: string;
  createdAt: number;
}

function encKey(k: string) {
  return encrypt(k, CONFIG.encryptionKey);
}

function decKey(v: string) {
  return decrypt(v, CONFIG.encryptionKey);
}

export function listAccounts(): Omit<Account, 'apiKey'>[] {
  return db.prepare('SELECT id, name, created_at FROM accounts ORDER BY id').all() as any[];
}

export function getSelectedAccountId(): number | null {
  const row = db.prepare('SELECT account_id FROM selected_account WHERE id = 1').get() as any;
  return row?.account_id ?? null;
}

export function setSelectedAccount(id: number) {
  db.prepare('INSERT OR REPLACE INTO selected_account (id, account_id) VALUES (1, ?)').run(id);
}

export function getAccountKey(id: number): string | null {
  const row = db.prepare('SELECT api_key FROM accounts WHERE id = ?').get(id) as any;
  if (!row) return null;
  return decKey(row.api_key);
}

export function addAccount(name: string, apiKey: string): Account {
  const enc = encKey(apiKey);
  const result = db.prepare('INSERT INTO accounts (name, api_key) VALUES (?, ?)').run(name, enc);
  return { id: result.lastInsertRowid as number, name, apiKey, createdAt: Date.now() / 1000 };
}

export function removeAccount(id: number) {
  db.prepare('DELETE FROM accounts WHERE id = ?').run(id);
  const sel = getSelectedAccountId();
  if (sel === id) {
    db.prepare('DELETE FROM selected_account WHERE id = 1').run();
  }
}
