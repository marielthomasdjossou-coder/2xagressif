import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import pkg from 'pg';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const isPg = !!process.env.PG_CONNECTION_STRING;

// --- Helpers: unify placeholders and simple adapter ---
function toPgPlaceholders(sql) {
  let idx = 0;
  return sql.replace(/\?/g, () => `$${++idx}`);
}

let pool = null;
let sqliteDb = null;

if (isPg) {
  const { Pool } = pkg;
  pool = new Pool({ connectionString: process.env.PG_CONNECTION_STRING, ssl: { rejectUnauthorized: false } });
} else {
  sqlite3.verbose();
  const dbPath = path.join(__dirname, 'parfums.db');
  sqliteDb = new sqlite3.Database(dbPath);
}

export async function query(sql, params = []) {
  if (isPg) {
    const text = toPgPlaceholders(sql);
    const { rows } = await pool.query(text, params);
    return rows;
  }
  // SQLite
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export async function getOne(sql, params = []) {
  if (isPg) {
    const rows = await query(sql, params);
    return rows[0] || null;
  }
  return new Promise((resolve, reject) => {
    sqliteDb.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

export async function run(sql, params = []) {
  if (isPg) {
    await query(sql, params);
    return;
  }
  return new Promise((resolve, reject) => {
    sqliteDb.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this); // lastID, changes
    });
  });
}

// Initialize tables
async function init() {
  if (isPg) {
    await run(`CREATE TABLE IF NOT EXISTS admin (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);
    await run(`CREATE TABLE IF NOT EXISTS parfums (
      id SERIAL PRIMARY KEY,
      nom TEXT NOT NULL,
      prix TEXT NOT NULL,
      description TEXT,
      details TEXT,
      image TEXT
    )`);
  } else {
    await run(`CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);
    await run(`CREATE TABLE IF NOT EXISTS parfums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      prix TEXT NOT NULL,
      description TEXT,
      details TEXT,
      image TEXT
    )`);
  }
}

await init();

export async function ensureAdminSeed() {
  const isProd = process.env.NODE_ENV === 'production';
  const username = process.env.ADMIN_USER;
  const passwordPlain = process.env.ADMIN_PASS;
  const forceReset = (process.env.ADMIN_FORCE_RESET || '').toLowerCase() === 'true';

  if (isProd && (!username || !passwordPlain)) {
    throw new Error('ADMIN_USER and ADMIN_PASS must be set in production');
  }

  const devUser = username || 'dev_admin';
  const devPass = passwordPlain || 'dev_password_change_me';
  const hash = await bcrypt.hash(devPass, 10);

  if (forceReset) {
    await run('DELETE FROM admin', []);
    await run('INSERT INTO admin (username, password) VALUES (?, ?)', [devUser, hash]);
    const row2 = await getOne(isPg ? 'SELECT COUNT(*)::int AS c FROM admin' : 'SELECT COUNT(*) AS c FROM admin');
    // eslint-disable-next-line no-console
    console.log(`[ensureAdminSeed] forceReset applied (HARD). admin count=${row2?.c ?? 1}`);
    return;
  }

  const row = await getOne(isPg ? 'SELECT COUNT(*)::int AS c FROM admin' : 'SELECT COUNT(*) AS c FROM admin');
  if (row?.c > 0) {
    // eslint-disable-next-line no-console
    console.log(`[ensureAdminSeed] existing admins. admin count=${row.c}`);
    return;
  }
  await run('INSERT INTO admin (username, password) VALUES (?, ?)', [devUser, hash]);
  const row2 = await getOne(isPg ? 'SELECT COUNT(*)::int AS c FROM admin' : 'SELECT COUNT(*) AS c FROM admin');
  // eslint-disable-next-line no-console
  console.log(`[ensureAdminSeed] inserted admin. admin count=${row2?.c ?? 1}`);
}

