import { create } from 'zustand';

import { authApi } from '@/api/auth';
import {
  clearStoredTokens,
  getStoredTokens,
  storeTokens,
} from '@/storage/auth-tokens';
import { useProfileStore } from '@/stores/profile-store';
import type { User } from '@/types/api';

type AuthState = {
  isBootstrapped: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  bootstrap: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isBootstrapped: false,
  user: null,
  accessToken: null,
  refreshToken: null,

  bootstrap: async () => {
    const tokens = await getStoredTokens();

    if (!tokens.accessToken) {
      set({ isBootstrapped: true });
      return;
    }

    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    try {
      const user = await authApi.me();
      set({ user, isBootstrapped: true });
    } catch {
      await clearStoredTokens();
      useProfileStore.getState().reset();
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isBootstrapped: true,
      });
    }
  },

  signIn: async (email, password) => {
    const tokens = await authApi.login(email.trim(), password);
    set({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
    await storeTokens(tokens.access_token, tokens.refresh_token);
    const user = await authApi.me();
    set({ user });
  },

  signUp: async (email, password) => {
    await authApi.register(email.trim(), password);
    await get().signIn(email, password);
  },

  signOut: async () => {
    await clearStoredTokens();
    useProfileStore.getState().reset();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  },
}));

/** Used by api/client for token refresh after login. */
export async function persistSession(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await storeTokens(accessToken, refreshToken);
  useAuthStore.setState({ accessToken, refreshToken });
}

export async function clearPersistedSession(): Promise<void> {
  await clearStoredTokens();
  useProfileStore.getState().reset();
  useAuthStore.setState({
    user: null,
    accessToken: null,
    refreshToken: null,
  });
}
