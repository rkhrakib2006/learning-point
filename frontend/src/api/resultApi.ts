import { api } from './client';
import type { Submission } from '../types';

export const resultApi = {
  mine: () => api.get<{ results: Submission[] }>('/results/mine').then((r) => r.data.results),
};