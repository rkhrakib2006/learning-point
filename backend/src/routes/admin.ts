import { Router } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole('ADMIN'));

adminRouter.get('/users', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ['STUDENT', 'TEACHER'] } },
      select: { id: true, email: true, fullName: true, role: true, classLevel: true, allowedAccessCode: true, isActive: true }
    });
    res.json({ users });
  } catch (e) { next(e); }
});

adminRouter.post('/set-access-code', async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.user.update({
      where: { id: user.id },
      data: { allowedAccessCode: code, isAccessUnlocked: false }
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// নতুন: ইউজার Approve করা
adminRouter.patch('/approve-user/:email', async (req, res, next) => {
  try {
    const email = req.params.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: true }
    });
    res.json({ ok: true, message: 'User approved successfully' });
  } catch (e) { next(e); }
});

adminRouter.post('/clear-data', async (_req, res, next) => {
  try {
    await prisma.answer.deleteMany();
    await prisma.alert.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.question.deleteMany();
    await prisma.exam.deleteMany();
    res.json({ ok: true });
  } catch (e) { next(e); }
});
