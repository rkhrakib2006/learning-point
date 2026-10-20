import { Request, Response, NextFunction } from 'express';
import { verifyAccess, Role } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request { user?: { id: string; role: Role; cls?: number }; }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.access;
  if (!token) return res.status(401).json({ error: 'Unauthenticated' });
  try {
    const payload = verifyAccess(token);
    req.user = { id: payload.sub, role: payload.role, cls: payload.cls };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export const requireRole = (...roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
};