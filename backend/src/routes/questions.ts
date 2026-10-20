import { Router } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { encryptKey } from '../utils/crypto.js';

export const questionsRouter = Router();
questionsRouter.use(requireAuth, requireRole('TEACHER', 'ADMIN'));

questionsRouter.post('/:examId', async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.examId } });
    if (!exam || exam.teacherId !== req.user!.id) return res.status(404).json({ error: 'Exam not found' });
    const count = await prisma.question.count({ where: { examId: exam.id } });
    const q = await prisma.question.create({
      data: {
        examId: exam.id, order: count + 1, type: req.body.type, text: req.body.text, marks: req.body.marks,
        options: req.body.options ?? undefined,
        correctKey: req.body.correctKey ? encryptKey(req.body.correctKey) : undefined,
        modelAnswer: req.body.modelAnswer,
      },
    });
    res.status(201).json({ question: { ...q, correctKey: undefined } });
  } catch (e) { next(e); }
});