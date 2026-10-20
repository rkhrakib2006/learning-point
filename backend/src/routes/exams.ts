import { Router } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { encryptKey } from '../utils/crypto.js';
import { sanitizeQuestion } from '../services/examService.js';

export const examsRouter = Router();
examsRouter.use(requireAuth);

// ১. সব এক্সাম লিস্ট (টিচার এবং স্টুডেন্ট উভয়ের জন্য)
examsRouter.get('/', async (req, res, next) => {
  try {
    const user = req.user!;
    if (user.role === 'STUDENT') {
      const exams = await prisma.exam.findMany({ 
        where: { classLevel: user.cls!, published: true }, 
        orderBy: { startAt: 'asc' } 
      });
      return res.json({ exams });
    }
    const exams = await prisma.exam.findMany({ 
      where: { teacherId: user.id }, 
      orderBy: { createdAt: 'desc' } 
    });
    res.json({ exams });
  } catch (e) { next(e); }
});

// ২. নতুন এক্সাম তৈরি
examsRouter.post('/', requireRole('TEACHER', 'ADMIN'), async (req, res, next) => {
  try {
    const data = req.body;
    const exam = await prisma.exam.create({
      data: {
        title: data.title, type: data.type, classLevel: data.classLevel,
        durationMin: (data.mcqDurationMin || 0) + (data.cqDurationMin || 0),
        mcqDurationMin: data.mcqDurationMin || 0, cqDurationMin: data.cqDurationMin || 0,
        totalMarks: data.totalMarks, passMarks: data.passMarks,
        startAt: new Date(data.startAt), endAt: new Date(data.endAt),
        teacherId: req.user!.id,
        questions: {
          create: data.questions.map((q: any, i: number) => ({
            order: i + 1, type: q.type, text: q.text, marks: q.marks,
            options: q.options ?? undefined,
            correctKey: q.correctKey ? encryptKey(q.correctKey) : undefined,
            modelAnswer: q.modelAnswer,
          })),
        },
      },
    });
    res.status(201).json({ exam });
  } catch (e) { next(e); }
});

// ৩. এক্সাম এডিট করা
examsRouter.put('/:id', requireRole('TEACHER', 'ADMIN'), async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.id } });
    if (!exam || exam.teacherId !== req.user!.id) return res.status(404).json({ error: 'Not found' });
    
    const data = req.body;
    // পুরনো প্রশ্নগুলো ডিলিট করে নতুনগুলো বসানো হচ্ছে
    await prisma.answer.deleteMany({ where: { question: { examId: exam.id } } });
    await prisma.question.deleteMany({ where: { examId: exam.id } });

    const updated = await prisma.exam.update({
      where: { id: exam.id },
      data: {
        title: data.title,
        questions: {
          create: data.questions.map((q: any, i: number) => ({
            order: i + 1, type: q.type, text: q.text, marks: q.marks,
            options: q.options ?? undefined,
            correctKey: q.correctKey ? encryptKey(q.correctKey) : undefined,
            modelAnswer: q.modelAnswer,
          })),
        },
      },
      include: { questions: true }
    });
    res.json({ exam: updated });
  } catch (e) { next(e); }
});

// ৪. নির্দিষ্ট এক্সামের রেজাল্ট
examsRouter.get('/:id/results', requireRole('TEACHER', 'ADMIN'), async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.id } });
    if (!exam || exam.teacherId !== req.user!.id) return res.status(404).json({ error: 'Not found' });
    
    const results = await prisma.submission.findMany({
      where: { examId: exam.id, status: { not: 'IN_PROGRESS' } },
      include: { student: { select: { fullName: true, email: true, classLevel: true } } },
      orderBy: { submittedAt: 'desc' }
    });
    res.json({ exam, results });
  } catch (e) { next(e); }
});

// ৫. ক্লাস ভিত্তিক রেজাল্ট (রেজাল্ট পেজের জন্য)
examsRouter.get('/class-results/:classLevel', requireRole('TEACHER', 'ADMIN'), async (req, res, next) => {
  try {
    const classLevel = parseInt(req.params.classLevel);
    const results = await prisma.submission.findMany({
      where: { exam: { classLevel, teacherId: req.user!.id }, status: { not: 'IN_PROGRESS' } },
      include: { student: { select: { fullName: true, email: true } }, exam: { select: { title: true, totalMarks: true } } },
      orderBy: { submittedAt: 'desc' }
    });
    res.json({ results });
  } catch (e) { next(e); }
});

// ৬. এক্সাম ডিলিট
examsRouter.delete('/:id', requireRole('TEACHER', 'ADMIN'), async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.id } });
    if (!exam || exam.teacherId !== req.user!.id) return res.status(404).json({ error: 'Not found' });
    
    // ডিলিট করার আগে রিলেটেড ডাটা মুছে ফেলা হচ্ছে (Foreign Key Error এড়াতে)
    await prisma.answer.deleteMany({ where: { question: { examId: exam.id } } });
    await prisma.alert.deleteMany({ where: { submission: { examId: exam.id } } });
    await prisma.submission.deleteMany({ where: { examId: exam.id } });
    await prisma.question.deleteMany({ where: { examId: exam.id } });
    await prisma.exam.delete({ where: { id: exam.id } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ৭. এক্সাম পাবলিশ
examsRouter.patch('/:id/publish', requireRole('TEACHER', 'ADMIN'), async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.id } });
    if (!exam || exam.teacherId !== req.user!.id) return res.status(404).json({ error: 'Not found' });
    const updated = await prisma.exam.update({ where: { id: exam.id }, data: { published: true } });
    res.json({ exam: updated });
  } catch (e) { next(e); }
});

// ৮. ক্লাস ভিত্তিক স্টুডেন্ট লিস্ট (স্টুডেন্ট পেজের জন্য)
examsRouter.get('/students/:classLevel', requireRole('TEACHER', 'ADMIN'), async (req, res, next) => {
  try {
    const classLevel = parseInt(req.params.classLevel);
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT', classLevel },
      select: { id: true, fullName: true, email: true, isActive: true, createdAt: true }
    });
    res.json({ students });
  } catch (e) { next(e); }
});

// ৯. এক্সামের ডিটেইলস ও প্রশ্ন (এডিট পেজে দেখানোর জন্য)
examsRouter.get('/:id', async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (!exam) return res.status(404).json({ error: 'Not found' });
    if (req.user!.role === 'TEACHER' && exam.teacherId !== req.user!.id) return res.status(403).json({ error: 'Forbidden' });
    res.json({ exam });
  } catch (e) { next(e); }
});