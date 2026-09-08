import { ReactNode } from 'react';
import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

type TabStackProps = {
  children?: ReactNode;
};

export function TabStack({ children }: TabStackProps) {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {children}
    </Stack>
  );
}
