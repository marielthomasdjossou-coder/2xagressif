import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

sqlite3.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'parfums.db');
export const db = new sqlite3.Database(dbPath);

// Initialize tables
function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS parfums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      prix TEXT NOT NULL,
      description TEXT,
      details TEXT,
      image TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);
  });
}

init();

export async function ensureAdminSeed() {
  const isProd = process.env.NODE_ENV === 'production';
  const username = process.env.ADMIN_USER;
  const passwordPlain = process.env.ADMIN_PASS;

  // In production, admin credentials must be provided explicitly
  if (isProd && (!username || !passwordPlain)) {
    throw new Error('ADMIN_USER and ADMIN_PASS must be set in production');
  }

  // In development, if missing, fall back to deterministic dev creds
  const devUser = username || 'dev_admin';
  const devPass = passwordPlain || 'dev_password_change_me';
  const hash = await bcrypt.hash(devPass, 10);

  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as c FROM admin', [], (err, row) => {
      if (err) return reject(err);
      if (row.c > 0) return resolve();
      db.run('INSERT INTO admin (username, password) VALUES (?, ?)', [devUser, hash], (e) => {
        if (e) return reject(e);
        resolve();
      });
    });
  });
}
