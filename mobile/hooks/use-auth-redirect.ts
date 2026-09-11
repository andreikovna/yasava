import { useEffect } from 'react';
import { useRootNavigationState, useRouter, useSegments } from 'expo-router';

import { useAuthStore } from '@/stores/auth-store';

export function useAuthRedirect() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!isBootstrapped || !navigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!accessToken && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (accessToken && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [accessToken, isBootstrapped, navigationState?.key, router, segments]);
}
