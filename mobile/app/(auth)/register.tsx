import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { spacing } from '@/constants/theme';

export default function RegisterScreen() {
  return (
    <Screen edges={[]}>
      <EmptyState
        title="Пока без регистрации"
        description="API уже есть, форму подключим вместе со входом."
      />
      <View style={styles.actions}>
        <PrimaryButton
          label="Ко входу"
          onPress={() => router.push('/(auth)/login')}
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
