import { Router } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const alertsRouter = Router();
alertsRouter.use(requireAuth, requireRole('TEACHER', 'ADMIN'));

alertsRouter.get('/exam/:examId', async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.examId } });
    if (!exam || exam.teacherId !== req.user!.id) return res.status(404).json({ error: 'Not found' });
    const alerts = await prisma.alert.findMany({
      where: { submission: { examId: exam.id } },
      include: { user: { select: { fullName: true, email: true } }, submission: { select: { id: true, attemptNo: true } } },
      orderBy: { occurredAt: 'desc' },
    });
    res.json({ alerts });
  } catch (e) { next(e); }
});