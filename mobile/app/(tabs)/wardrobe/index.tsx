import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';

export default function WardrobeScreen() {
  return (
    <Screen title="Мой гардероб" subtitle="Все · Верх · Низ · Платья · Обувь">
      <EmptyState
        title="Пока пусто"
        description="Сетка вещей появится, когда подключим гардероб."
      />
    </Screen>
  );
}
