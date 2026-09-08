import { useLocalSearchParams } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';

export default function ItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen edges={[]} subtitle={id ? `id: ${id}` : undefined}>
      <EmptyState
        title="Фото и детали"
        description="Категория, цвет, сезон и «с чем сочетается» появятся вместе с гардеробом."
      />
    </Screen>
  );
}
