import { Router } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole('ADMIN'));

// ১. সব ইউজার লিস্ট
adminRouter.get('/users', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ['STUDENT', 'TEACHER'] } },
      select: { id: true, email: true, fullName: true, role: true, classLevel: true, allowedAccessCode: true }
    });
    res.json({ users });
  } catch (e) { next(e); }
});

// ২. ইউজারের জন্য Access Code সেট করা
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

// ৩. সব এক্সাম লিস্ট (অ্যাডমিনের দেখার জন্য)
adminRouter.get('/exams', async (_req, res, next) => {
  try {
    const exams = await prisma.exam.findMany({
      include: { teacher: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ exams });
  } catch (e) { next(e); }
});

// ৪. সব ডেটা ক্লিয়ার করা (ইউজার ছাড়া বাকি সব ডিলিট হবে)
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