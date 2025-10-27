import jwt from 'jsonwebtoken';

const isProd = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || (!isProd ? 'dev_secret_change_me' : undefined);

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });
  if (!JWT_SECRET) return res.status(500).json({ message: 'JWT secret non configuré' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user;
    next();
  });
}
