import express from 'express';
import { body, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { db } from '../db.js';
import { upload } from '../middleware/upload.js';
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

// GET all parfums
router.get('/', (_req, res) => {
  db.all('SELECT * FROM parfums ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erreur DB', error: err.message });
    res.json(rows);
  });
});

// GET one parfum
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM parfums WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Erreur DB', error: err.message });
    if (!row) return res.status(404).json({ message: 'Introuvable' });
    res.json(row);
  });
});

// POST create parfum
router.post('/', verifyToken, upload.single('image'),
  body('nom').isLength({ min: 2 }),
  body('prix').isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nom, prix, description = '', details = '' } = req.body;
    const image = req.file ? path.posix.join('uploads', path.basename(req.file.path)) : null;

    db.run('INSERT INTO parfums (nom, prix, description, details, image) VALUES (?, ?, ?, ?, ?)',
      [nom, prix, description, details, image], function (err) {
        if (err) return res.status(500).json({ message: 'Erreur DB', error: err.message });
        db.get('SELECT * FROM parfums WHERE id = ?', [this.lastID], (e, row) => {
          if (e) return res.status(500).json({ message: 'Erreur DB', error: e.message });
          res.status(201).json(row);
        });
      });
  }
);

// PUT update parfum
router.put('/:id', verifyToken, upload.single('image'),
  body('nom').optional().isLength({ min: 2 }),
  body('prix').optional().isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nom, prix, description, details } = req.body;
    const image = req.file ? path.posix.join('uploads', path.basename(req.file.path)) : undefined;

    db.get('SELECT * FROM parfums WHERE id = ?', [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ message: 'Erreur DB', error: err.message });
      if (!row) return res.status(404).json({ message: 'Introuvable' });

      const newRow = {
        nom: nom ?? row.nom,
        prix: prix ?? row.prix,
        description: description ?? row.description,
        details: details ?? row.details,
        image: image ?? row.image
      };

      db.run('UPDATE parfums SET nom = ?, prix = ?, description = ?, details = ?, image = ? WHERE id = ?',
        [newRow.nom, newRow.prix, newRow.description, newRow.details, newRow.image, req.params.id], (e) => {
          if (e) return res.status(500).json({ message: 'Erreur DB', error: e.message });
          // If a new image was uploaded, delete the previous file
          if (image && row.image && row.image !== newRow.image) {
            tryUnlink(row.image);
          }
          res.json({ id: Number(req.params.id), ...newRow });
        });
    });
  }
);

// DELETE parfum
router.delete('/:id', verifyToken, (req, res) => {
  db.get('SELECT image FROM parfums WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Erreur DB', error: err.message });
    if (!row) return res.status(404).json({ message: 'Introuvable' });

    db.run('DELETE FROM parfums WHERE id = ?', [req.params.id], function (e) {
      if (e) return res.status(500).json({ message: 'Erreur DB', error: e.message });
      if (this.changes === 0) return res.status(404).json({ message: 'Introuvable' });
      // Best effort: delete associated image file
      if (row.image) tryUnlink(row.image);
      res.json({ success: true });
    });
  });
});

export default router;
