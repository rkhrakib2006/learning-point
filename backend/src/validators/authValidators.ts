import { z } from 'zod';
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  role: z.enum(['STUDENT', 'TEACHER']),
  classLevel: z.number().int().min(6).max(12).optional(),
  school: z.string().optional(),
});
export const loginSchema = z.object({ email: z.string().email(), password: z.string() });