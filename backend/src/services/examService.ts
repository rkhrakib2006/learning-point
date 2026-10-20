import { prisma } from '../config/db.js';
export function sanitizeQuestion(q: any) {
  const { correctKey, modelAnswer, rubric, ...safe } = q;
  return safe;
}
export async function getOrCreateSubmission(studentId: string, examId: string) {
  const exam = await prisma.exam.findUniqueOrThrow({ where: { id: examId } });
  const now = new Date();
  if (!exam.published) throw Object.assign(new Error('Exam not published'), { status: 403 });
  if (now < exam.startAt || now > exam.endAt) throw Object.assign(new Error('Exam not open'), { status: 403 });

  const existing = await prisma.submission.findFirst({ where: { studentId, examId, status: 'IN_PROGRESS' } });
  if (existing) return existing;

  const attempts = await prisma.submission.count({ where: { studentId, examId } });
  if (attempts > 0) throw Object.assign(new Error('Already attempted'), { status: 403 });

  const mcqEnd = new Date(now.getTime() + (exam.mcqDurationMin || exam.durationMin) * 60_000);
  const cqEnd = new Date(now.getTime() + (exam.mcqDurationMin + exam.cqDurationMin || exam.durationMin) * 60_000);

  return prisma.submission.create({
    data: { examId, studentId, attemptNo: attempts + 1, mcqEndsAt: mcqEnd, cqEndsAt: cqEnd },
  });
}