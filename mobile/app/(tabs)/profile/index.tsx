import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { spacing } from '@/constants/theme';

export default function ProfileScreen() {
  return (
    <Screen title="Профиль" subtitle="Статистика появится позже">
      <EmptyState
        title="Мои гардеробы"
        description="Семейные профили и переключатель подключим после авторизации."
      />
      <View style={styles.actions}>
        <PrimaryButton
          label="Гардеробы семьи"
          onPress={() => router.push('/profile/family')}
        />
        <PrimaryButton
          label="Войти"
          onPress={() => router.push('/(auth)/login')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
});
