import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { spacing } from '@/constants/theme';

export default function LoginScreen() {
  return (
    <Screen edges={[]}>
      <EmptyState
        title="Пока без логина"
        description="Токены уже умеем хранить. Форму входа подключим в следующей фазе."
      />
      <View style={styles.actions}>
        <PrimaryButton
          label="К регистрации"
          onPress={() => router.push('/(auth)/register')}
        />
        <PrimaryButton
          label="К приложению"
          onPress={() => router.replace('/(tabs)')}
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
