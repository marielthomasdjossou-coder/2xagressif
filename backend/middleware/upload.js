import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

function fileFilter(_req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Type de fichier non autorisé'));
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Convert uploaded image to optimized WebP (max width 800), then delete original
export async function optimizeUpload(file){
  if (!file?.path) return null;
  const dir = path.dirname(file.path);
  const base = path.basename(file.path, path.extname(file.path));
  const webpPath = path.join(dir, `${base}.webp`);
  try {
    // Lazy import sharp to avoid crash if installation failed
    const sharpMod = await import('sharp').catch(()=>null);
    const sharp = sharpMod?.default || sharpMod; // esm/cjs compat
    if (!sharp) throw new Error('sharp-not-available');
    await sharp(file.path)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 76 })
      .toFile(webpPath);
    // remove original
    await fs.unlink(file.path).catch(()=>{});
    // return relative path like 'uploads/xxx.webp'
    return path.posix.join('uploads', path.basename(webpPath));
  } catch (e) {
    // Fallback: keep original file
    return path.posix.join('uploads', path.basename(file.path));
  }
}
