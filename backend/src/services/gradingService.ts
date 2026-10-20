import { prisma } from '../config/db.js';
import { decryptKey } from '../utils/crypto.js';

export async function autoGradeMCQ(submissionId: string) {
  const sub = await prisma.submission.findUniqueOrThrow({
    where: { id: submissionId },
    include: { exam: { include: { questions: true } }, answers: true },
  });
  let score = 0;
  for (const q of sub.exam.questions) {
    if (q.type !== 'MCQ') continue;
    const ans = sub.answers.find((a) => a.questionId === q.id);
    const key = q.correctKey ? decryptKey(q.correctKey) : null;
    if (!key) continue;
    if (ans?.mcqChoice === key) score += q.marks;
  }
  return Math.max(0, score);
}

export function computeGrade(pct: number) {
  if (pct >= 80) return 'A+';
  if (pct >= 70) return 'A';
  if (pct >= 60) return 'A-';
  if (pct >= 50) return 'B';
  if (pct >= 40) return 'C';
  if (pct >= 33) return 'D';
  return 'F';
}