import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'parfums.db');

async function main(){
  const db = new sqlite3.Database(dbPath);
  const username = process.env.ADMIN_USER || 'dev_admin';
  const password = process.env.ADMIN_PASS || 'dev_password_change_me';
  const hash = await bcrypt.hash(password, 10);

  await new Promise((resolve, reject)=>{
    db.serialize(()=>{
      db.run(`CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)`);
      db.run(`INSERT INTO admin (username, password) VALUES (?, ?)
              ON CONFLICT(username) DO UPDATE SET password=excluded.password`, [username, hash], (err)=>{
        if (err) return reject(err);
        resolve();
      });
    });
  });

  console.log(`Admin reset: username="${username}" password="${password}"`);
  db.close();
}

main().catch(err=>{ console.error(err); process.exit(1); });
