import { api } from './client';
import type { Exam } from '../types';

export const examApi = {
  list: () => api.get<{ exams: Exam[] }>('/exams').then((r) => r.data.exams),
  get: (id: string) => api.get(`/exams/${id}`).then((r) => r.data.exam),
  create: (payload: any) => api.post('/exams', payload).then((r) => r.data.exam),
  publish: (id: string) => api.patch(`/exams/${id}/publish`).then((r) => r.data.exam),
};