import { Router } from 'express';
import { prisma } from '../config/db.js';
import { registerUser, loginUser } from '../services/authService.js';
import { verifyRefresh, signAccess, signRefresh } from '../utils/jwt.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/register', authLimiter, async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await registerUser(data);
    res.status(201).json({ user });
  } catch (e) { next(e); }
});

authRouter.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { access, refresh, user } = await loginUser(email, password);
    res.cookie('refresh', refresh, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 30 * 24 * 3600 * 1000, path: '/api/auth' });
    res.json({ access, user });
  } catch (e) { next(e); }
});

authRouter.post('/verify-access', requireAuth, async (req, res, next) => {
  try {
    const { code } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.allowedAccessCode) return res.status(400).json({ error: 'No access code set by Admin.' });
    if (user.allowedAccessCode !== code) return res.status(401).json({ error: 'Invalid Access Code.' });
    await prisma.user.update({ where: { id: user.id }, data: { isAccessUnlocked: true } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

authRouter.post('/verify-teacher', async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || user.role !== 'TEACHER') return res.status(404).json({ error: 'Teacher not found' });
    if (!user.allowedAccessCode || user.allowedAccessCode !== code) return res.status(401).json({ error: 'Invalid Code' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const token = req.cookies?.refresh;
    if (!token) return res.status(401).json({ error: 'No refresh token' });
    const payload = verifyRefresh(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user?.isActive) return res.status(401).json({ error: 'Invalid user' });
    const access = signAccess({ sub: user.id, role: user.role as any, cls: user.classLevel ?? undefined });
    res.json({ access });
  } catch { res.status(401).json({ error: 'Invalid refresh' }); }
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('refresh', { path: '/api/auth' });
  res.json({ ok: true });
});