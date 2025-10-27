import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { db, ensureAdminSeed } from './db.js';
import parfumsRouter from './routes/parfums.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Behind Render/Netlify proxies, enable trust proxy so rate-limit can use X-Forwarded-For
// See: https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/
app.set('trust proxy', 1);

// Enforce JWT secret presence in production
const JWT_SECRET_ENV = process.env.JWT_SECRET;
if (!JWT_SECRET_ENV && process.env.NODE_ENV === 'production') {
  // Fail fast in production if secret is missing
  // eslint-disable-next-line no-console
  console.error('FATAL: JWT_SECRET must be set in production');
  process.exit(1);
}
const JWT_SECRET = JWT_SECRET_ENV || 'dev_secret_change_me';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security & logging
const ORIGIN = process.env.CORS_ORIGIN || '*';
// Allow images/static to be consumed cross-origin by the frontend dev server (5173)
app.use(compression());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({ origin: ORIGIN }));
app.use(morgan('tiny'));
app.use(express.json({ limit: '1mb' }));

// Basic rate limiting (global) and stricter on login
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(globalLimiter);
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });

// Ensure uploads directory exists (for multer disk storage on Render)
const uploadsDir = path.join(__dirname, 'uploads');
try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch (e) { /* ignore */ }

// Static for uploaded images (with cache headers)
app.use('/uploads', express.static(uploadsDir, { maxAge: '7d', immutable: true }));

// Auth: login
app.post('/api/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username et password requis' });

  db.get('SELECT * FROM admin WHERE username = ?', [username], async (err, row) => {
    if (err) return res.status(500).json({ message: 'Erreur DB', error: err.message });
    if (!row) {
      // eslint-disable-next-line no-console
      console.log(`[login] user not found: ${username}`);
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    let ok = false;
    try {
      ok = await bcrypt.compare(password, row.password);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`[login] bcrypt.compare errored for user=${username}: ${e?.message}`);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    if (!ok) {
      // eslint-disable-next-line no-console
      console.log(`[login] password mismatch for user=${username}`);
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign({ id: row.id, username: row.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  });
});

// Routes parfums
app.use('/api/parfums', parfumsRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Start
// Error handler (last)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Erreur serveur' });
});

app.listen(PORT, async () => {
  await ensureAdminSeed();
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://localhost:${PORT}`);
});
