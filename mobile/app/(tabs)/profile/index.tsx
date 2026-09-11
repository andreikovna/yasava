import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuthStore } from '@/stores/auth-store';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  async function handleSignOut() {
    await signOut();
    router.replace('/(auth)/login');
  }

  return (
    <Screen title="Профиль" subtitle="Статистика появится позже">
      {user ? (
        <View style={styles.userCard}>
          <Text style={styles.userLabel}>Аккаунт</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      ) : null}

      <EmptyState
        title="Мои гардеробы"
        description="Семейные профили и переключатель подключим в следующей фазе."
      />

      <View style={styles.actions}>
        <PrimaryButton
          label="Гардеробы семьи"
          onPress={() => router.push('/profile/family')}
        />
        <PrimaryButton label="Выйти" onPress={handleSignOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  userLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  userEmail: {
    marginTop: 4,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
});
