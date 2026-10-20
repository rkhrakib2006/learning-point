import { z } from 'zod';
export const saveSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    mcqChoice: z.string().nullable().optional(),
    cqText: z.string().nullable().optional(),
  })),
});
export const alertSchema = z.object({
  kind: z.enum(['TAB_SWITCH', 'FULLSCREEN_EXIT', 'COPY', 'DEVTOOLS', 'MULTI_LOGIN', 'BLUR']),
  detail: z.string().optional(),
});