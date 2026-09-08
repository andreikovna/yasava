import { api } from '@/api/client';
import type { TokenResponse, User } from '@/types/api';

export const authApi = {
  register: (email: string, password: string) =>
    api.post<User>('/auth/register', { email, password }, { skipAuth: true }),

  login: (email: string, password: string) =>
    api.post<TokenResponse>(
      '/auth/login',
      { email, password },
      { skipAuth: true },
    ),

  me: () => api.get<User>('/auth/me'),
};
