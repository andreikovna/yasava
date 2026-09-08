import { api } from '@/api/client';
import type { Profile } from '@/types/api';

export const profilesApi = {
  list: () => api.get<Profile[]>('/profiles/'),
  create: (name: string) => api.post<Profile>('/profiles/', { name }),
};
