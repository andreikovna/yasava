import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { spacing } from '@/constants/theme';

export default function OutfitsScreen() {
  return (
    <Screen title="Образы" subtitle="Все · Casual · Business · Sport">
      <EmptyState
        title="Готовых образов ещё нет"
        description="Коллажи из вещей гардероба подключим в следующей фазе."
      />
      <View style={styles.action}>
        <PrimaryButton
          label="Создать образ"
          onPress={() => router.push('/outfits/create')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  action: {
    marginTop: spacing.lg,
  },
});
