import { api } from './client';
import type { AuthResponse } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data),
  register: (payload: any) => api.post('/auth/register', payload).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
};