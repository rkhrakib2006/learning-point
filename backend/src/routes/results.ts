import { Router } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const resultsRouter = Router();
resultsRouter.use(requireAuth);

resultsRouter.get('/mine', requireRole('STUDENT'), async (req, res, next) => {
  try {
    const subs = await prisma.submission.findMany({
      where: { studentId: req.user!.id, status: { not: 'IN_PROGRESS' } },
      include: { exam: { select: { title: true, totalMarks: true, passMarks: true } } },
      orderBy: { submittedAt: 'desc' },
    });
    res.json({ results: subs });
  } catch (e) { next(e); }
});