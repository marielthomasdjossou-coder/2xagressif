import express from 'express';
import { body, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { isPg, query, getOne, run } from '../db.js';
import { upload, optimizeUpload } from '../middleware/upload.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function absoluteUploadPath(rel) {
  // Stored image is like 'uploads/filename.ext'
  if (!rel) return null;
  if (!rel.startsWith('uploads')) return null;
  return path.join(__dirname, '..', rel);
}

async function tryUnlink(rel) {
  const abs = absoluteUploadPath(rel);
  if (!abs) return;
  try { await fs.unlink(abs); } catch (_) { /* ignore */ }
}

// GET all parfums (optional pagination: ?limit=&offset=)
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit, 10);
  const offset = parseInt(req.query.offset, 10);

  const hasPaging = Number.isFinite(limit) || Number.isFinite(offset);

  try {
    if (!hasPaging) {
      const rows = await query('SELECT * FROM parfums ORDER BY id DESC', []);
      return res.json(rows);
    }
    const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(limit, 50)) : 12;
    const safeOffset = Number.isFinite(offset) ? Math.max(0, offset) : 0;
    const countRow = await getOne(isPg ? 'SELECT COUNT(*)::int AS total FROM parfums' : 'SELECT COUNT(*) AS total FROM parfums', []);
    const rows = await query('SELECT * FROM parfums ORDER BY id DESC LIMIT ? OFFSET ?', [safeLimit, safeOffset]);
    return res.json({ items: rows, total: countRow?.total ?? 0, limit: safeLimit, offset: safeOffset });
  } catch (e) {
    return res.status(500).json({ message: 'Erreur DB', error: e.message });
  }
});

// GET one parfum
router.get('/:id', async (req, res) => {
  try {
    const row = await getOne('SELECT * FROM parfums WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ message: 'Introuvable' });
    return res.json(row);
  } catch (e) {
    return res.status(500).json({ message: 'Erreur DB', error: e.message });
  }
});

// POST create parfum
router.post('/', verifyToken, upload.single('image'),
  body('nom').isLength({ min: 2 }),
  body('prix').isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { nom, prix, description = '', details = '' } = req.body;
      const image = req.file ? await optimizeUpload(req.file) : null;
      if (isPg) {
        const rows = await query('INSERT INTO parfums (nom, prix, description, details, image) VALUES (?, ?, ?, ?, ?) RETURNING *', [nom, prix, description, details, image]);
        return res.status(201).json(rows[0]);
      } else {
        const r = await run('INSERT INTO parfums (nom, prix, description, details, image) VALUES (?, ?, ?, ?, ?)', [nom, prix, description, details, image]);
        const row = await getOne('SELECT * FROM parfums WHERE id = ?', [r.lastID]);
        return res.status(201).json(row);
      }
    } catch (e) {
      return res.status(500).json({ message: 'Erreur DB', error: e.message });
    }
  }
);

// PUT update parfum
router.put('/:id', verifyToken, upload.single('image'),
  body('nom').optional().isLength({ min: 2 }),
  body('prix').optional().isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { nom, prix, description, details } = req.body;
      const image = req.file ? await optimizeUpload(req.file) : undefined;
      const row = await getOne('SELECT * FROM parfums WHERE id = ?', [req.params.id]);
      if (!row) return res.status(404).json({ message: 'Introuvable' });
      const newRow = {
        nom: nom ?? row.nom,
        prix: prix ?? row.prix,
        description: description ?? row.description,
        details: details ?? row.details,
        image: image ?? row.image
      };
      if (isPg) {
        const rows = await query('UPDATE parfums SET nom = ?, prix = ?, description = ?, details = ?, image = ? WHERE id = ? RETURNING *', [newRow.nom, newRow.prix, newRow.description, newRow.details, newRow.image, req.params.id]);
        if (image && row.image && row.image !== newRow.image) tryUnlink(row.image);
        return res.json(rows[0]);
      } else {
        await run('UPDATE parfums SET nom = ?, prix = ?, description = ?, details = ?, image = ? WHERE id = ?', [newRow.nom, newRow.prix, newRow.description, newRow.details, newRow.image, req.params.id]);
        if (image && row.image && row.image !== newRow.image) tryUnlink(row.image);
        return res.json({ id: Number(req.params.id), ...newRow });
      }
    } catch (e) {
      return res.status(500).json({ message: 'Erreur DB', error: e.message });
    }
  }
);

// DELETE parfum
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const row = await getOne('SELECT image FROM parfums WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ message: 'Introuvable' });
    if (isPg) {
      const del = await query('DELETE FROM parfums WHERE id = ? RETURNING id', [req.params.id]);
      if (del.length === 0) return res.status(404).json({ message: 'Introuvable' });
    } else {
      const r = await run('DELETE FROM parfums WHERE id = ?', [req.params.id]);
      if (!r.changes) return res.status(404).json({ message: 'Introuvable' });
    }
    if (row.image) tryUnlink(row.image);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: 'Erreur DB', error: e.message });
  }
});

export default router;
