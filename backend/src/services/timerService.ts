import { prisma } from '../config/db.js';
export async function enforceDeadline(submissionId: string) {
  const sub = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (!sub) return null;
  const now = new Date();
  if (sub.status === 'IN_PROGRESS' && sub.mcqEndsAt && sub.mcqEndsAt < now && !sub.mcqSubmitted) {
    return { expired: true, submission: sub };
  }
  return { expired: false, submission: sub };
}