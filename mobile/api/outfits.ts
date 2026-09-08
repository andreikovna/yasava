import { api } from '@/api/client';
import type { Outfit, Season } from '@/types/api';

export const outfitsApi = {
  list: (
    profileId: string,
    filters?: { season?: Season; occasion?: string },
  ) =>
    api.get<Outfit[]>('/outfits/', {
      profile_id: profileId,
      season: filters?.season,
      occasion: filters?.occasion,
    }),

  get: (id: string) => api.get<Outfit>(`/outfits/${id}`),
};
