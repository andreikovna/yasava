import { api } from '@/api/client';
import type { Category, Clothes, Season } from '@/types/api';

export const clothesApi = {
  list: (
    profileId: string,
    filters?: { category?: Category; season?: Season },
  ) =>
    api.get<Clothes[]>('/clothes/', {
      profile_id: profileId,
      category: filters?.category,
      season: filters?.season,
    }),

  get: (id: string) => api.get<Clothes>(`/clothes/${id}`),
};
