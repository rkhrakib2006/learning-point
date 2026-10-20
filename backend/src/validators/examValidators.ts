import { z } from 'zod';
export const questionSchema = z.object({
  type: z.enum(['MCQ', 'CQ']),
  text: z.string().min(1),
  marks: z.number().int().min(1),
  options: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
  correctKey: z.string().optional(),
  modelAnswer: z.string().optional(),
});
export const examSchema = z.object({
  title: z.string().min(3),
  type: z.enum(['MCQ', 'CQ', 'MIXED']),
  classLevel: z.number().int().min(6).max(12),
  durationMin: z.number().int().min(5).max(300),
  mcqDurationMin: z.number().int().default(0),
  cqDurationMin: z.number().int().default(0),
  totalMarks: z.number().int().min(1),
  passMarks: z.number().int().min(0),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  questions: z.array(questionSchema).min(1),
});