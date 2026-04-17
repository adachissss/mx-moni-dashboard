import Database from 'better-sqlite3';
import path from 'path';
import { CONFIG } from '../config.js';

const dbPath = path.resolve(CONFIG.dataDir, 'mx-moni.db');
export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = on');
