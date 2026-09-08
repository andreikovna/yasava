import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';

export default function CreateLookScreen() {
  return (
    <Screen edges={[]}>
      <EmptyState
        title="Сборщик образа"
        description="Выбранные вещи сверху, гардероб снизу. Сохранение через API подключим позже."
      />
    </Screen>
  );
}
