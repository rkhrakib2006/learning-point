import { api } from './client';
import type { Answer } from '../types';

export const submissionApi = {
  start: (examId: string) =>
    api.post(`/submissions/start/${examId}`).then((r) => r.data),

  save: (submissionId: string, answers: Answer[]) =>
    api.patch(`/submissions/${submissionId}/save`, { answers }).then((r) => r.data),

  submit: (submissionId: string) =>
    api.post(`/submissions/${submissionId}/submit`).then((r) => r.data),

  status: (submissionId: string) =>
    api.get(`/submissions/${submissionId}/status`).then((r) => r.data),

  alert: (submissionId: string, kind: string, detail?: string) =>
    api.post(`/submissions/${submissionId}/alert`, { kind, detail }).then((r) => r.data),
};