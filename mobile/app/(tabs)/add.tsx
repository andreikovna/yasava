import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { spacing } from '@/constants/theme';

export default function AddScreen() {
  return (
    <Screen title="Добавить" subtitle="Выберите, что создать">
      <EmptyState
        title="Два пути"
        description="Вещь попадёт в гардероб, образ — в готовые луки. Пока это только каркас экранов."
      />
      <View style={styles.actions}>
        <PrimaryButton
          label="Добавить вещь"
          onPress={() => router.push('/wardrobe')}
        />
        <PrimaryButton
          label="Создать образ"
          onPress={() => router.push('/outfits/create')}
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
