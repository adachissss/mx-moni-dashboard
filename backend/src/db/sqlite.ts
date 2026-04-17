import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { CONFIG } from '../config.js';

const dbPath = path.resolve(CONFIG.dataDir, 'mx-moni.db');

// 同步加载 sql.js WASM（Node.js 环境）
function getSqlJs() {
  const wasmPath = path.join(__dirname, '..', '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
  return initSqlJs({
    locateFile: () => wasmPath,
  });
}

// 数据库实例
let _db: SqlJsDatabase | null = null;
let _saveTimer: ReturnType<typeof setTimeout> | null = null;

// 持久化到磁盘
function persist() {
  if (!_db) return;
  const data = _db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

// 定期自动保存（防崩溃丢数据）
function scheduleSave() {
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(persist, 500);
}

// 保存（立即）
function save() {
  if (_saveTimer) {
    clearTimeout(_saveTimer);
    _saveTimer = null;
  }
  persist();
}

// 初始化（异步，server.ts 启动时调用一次）
export async function initDb() {
  // 确保数据目录存在
  fs.mkdirSync(CONFIG.dataDir, { recursive: true });

  const SQL = await getSqlJs();

  if (fs.existsSync(dbPath)) {
    const buf = fs.readFileSync(dbPath);
    _db = new SQL.Database(buf);
  } else {
    _db = new SQL.Database();
  }

  _db.run('PRAGMA journal_mode = WAL');
  _db.run('PRAGMA foreign_keys = ON');

  // 建表
  _db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      api_key TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);
  _db.run(`
    CREATE TABLE IF NOT EXISTS selected_account (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL
    )
  `);

  save();
}

// 兼容层：让 sql.js 模拟 better-sqlite3 的同步 API
class DbCompat {
  exec(sql: string) {
    if (!_db) throw new Error('db not initialized, call initDb() first');
    _db.exec(sql);
  }

  pragma(p: string) {
    if (!_db) throw new Error('db not initialized');
    _db.run(`PRAGMA ${p}`);
  }

  prepare(sql: string) {
    if (!_db) throw new Error('db not initialized');
    const stmt = _db.prepare(sql);
    return {
      all: (): any[] => {
        const rows: any[] = [];
        while (stmt.step()) rows.push(stmt.getAsObject());
        stmt.free();
        return rows;
      },
      get: (): any => {
        stmt.step();
        const row = stmt.getAsObject();
        stmt.free();
        return row;
      },
      run: (...params: any[]): { lastInsertRowid: number } => {
        stmt.bind(params);
        stmt.step();
        stmt.free();
        scheduleSave();
        return { lastInsertRowid: _db!.lastInsertRowid as number };
      },
    };
  }

  get lastInsertRowid() {
    return _db?.lastInsertRowid ?? 0;
  }
}

// 导出单例
export const db = new DbCompat();
