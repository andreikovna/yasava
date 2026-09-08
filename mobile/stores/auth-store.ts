import { create } from 'zustand';

import {
  clearStoredTokens,
  getStoredTokens,
  storeTokens,
} from '@/storage/auth-tokens';
import { useProfileStore } from '@/stores/profile-store';

type AuthState = {
  isHydrated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  hydrate: () => Promise<void>;
  setSession: (accessToken: string, refreshToken: string) => Promise<void>;
  clearSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isHydrated: false,
  accessToken: null,
  refreshToken: null,

  hydrate: async () => {
    const tokens = await getStoredTokens();
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isHydrated: true,
    });
  },

  setSession: async (accessToken, refreshToken) => {
    await storeTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken });
  },

  clearSession: async () => {
    await clearStoredTokens();
    useProfileStore.getState().reset();
    set({ accessToken: null, refreshToken: null });
  },
}));
