import { Router } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getOrCreateSubmission, sanitizeQuestion } from '../services/examService.js';
import { autoGradeMCQ, computeGrade } from '../services/gradingService.js';
import { alertLimiter } from '../middleware/rateLimit.js';
import { saveSchema, alertSchema } from '../validators/submissionValidators.js';

export const subRouter = Router();
subRouter.use(requireAuth);

// ১. পরীক্ষা শুরু করা বা রিজিউম করা
subRouter.post('/start/:examId', requireRole('STUDENT'), async (req, res, next) => {
  try {
    const sub = await getOrCreateSubmission(req.user!.id, req.params.examId);
    const exam = await prisma.exam.findUniqueOrThrow({
      where: { id: req.params.examId },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    let questions = exam.questions.map((q) => sanitizeQuestion(q));
    const existing = await prisma.answer.findMany({ where: { submissionId: sub.id } });

    res.json({
      submission: { id: sub.id, expiresAt: sub.mcqEndsAt, attemptNo: sub.attemptNo },
      exam: { id: exam.id, title: exam.title, durationMin: exam.durationMin, totalMarks: exam.totalMarks },
      questions,
      answers: existing,
    });
  } catch (e) { next(e); }
});

// ২. উত্তর অটো-সেভ করা (প্রতি ৩ সেকেন্ডে)
subRouter.patch('/:id/save', requireRole('STUDENT'), async (req, res, next) => {
  try {
    const { answers } = saveSchema.parse(req.body);
    const sub = await prisma.submission.findUnique({ where: { id: req.params.id } });
    
    if (!sub || sub.studentId !== req.user!.id) return res.status(404).json({ error: 'Not found' });
    if (sub.status !== 'IN_PROGRESS') return res.status(409).json({ error: 'Already submitted' });
    
    await prisma.$transaction(
      answers.map((a) =>
        prisma.answer.upsert({
          where: { submissionId_questionId: { submissionId: sub.id, questionId: a.questionId } },
          create: { submissionId: sub.id, questionId: a.questionId, mcqChoice: a.mcqChoice ?? null, cqText: a.cqText ?? null },
          update: { mcqChoice: a.mcqChoice ?? null, cqText: a.cqText ?? null, answeredAt: new Date() },
        })
      )
    );
    res.json({ saved: answers.length });
  } catch (e) { next(e); }
});

// ৩. চূড়ান্ত সাবমিট
subRouter.post('/:id/submit', requireRole('STUDENT'), async (req, res, next) => {
  try {
    const sub = await prisma.submission.findUnique({ where: { id: req.params.id } });
    if (!sub || sub.studentId !== req.user!.id) return res.status(404).json({ error: 'Not found' });
    if (sub.status !== 'IN_PROGRESS') return res.json({ ok: true });

    const exam = await prisma.exam.findUniqueOrThrow({ where: { id: sub.examId } });
    const hasCQ = await prisma.question.count({ where: { examId: exam.id, type: 'CQ' } });

    const mcqScore = await autoGradeMCQ(sub.id);
    const finalStatus = hasCQ > 0 ? 'SUBMITTED' : 'EVALUATED';
    const totalScore = hasCQ > 0 ? null : mcqScore;

    await prisma.submission.update({
      where: { id: sub.id },
      data: {
        status: finalStatus as any,
        submittedAt: new Date(),
        mcqScore,
        totalScore,
        passed: totalScore != null ? totalScore >= exam.passMarks : null,
        grade: totalScore != null ? computeGrade((totalScore / exam.totalMarks) * 100) : null,
      },
    });
    res.json({ ok: true, mcqScore, pendingCQ: hasCQ > 0 });
  } catch (e) { next(e); }
});

// ৪. অ্যান্টি-চিট অ্যালার্ট (ট্যাব চেঞ্জ হলে)
subRouter.post('/:id/alert', alertLimiter, requireRole('STUDENT'), async (req, res, next) => {
  try {
    const { kind, detail } = alertSchema.parse(req.body);
    const sub = await prisma.submission.findUnique({ where: { id: req.params.id } });
    if (!sub || sub.studentId !== req.user!.id) return res.status(404).json({ error: 'Not found' });

    await prisma.alert.create({
      data: { submissionId: sub.id, userId: req.user!.id, kind, detail: detail ?? null },
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});