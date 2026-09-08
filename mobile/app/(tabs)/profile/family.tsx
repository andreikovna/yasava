import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';

export default function FamilyScreen() {
  return (
    <Screen edges={[]}>
      <EmptyState
        title="Список профилей"
        description="Создание по имени и счётчики вещей подключим после авторизации."
      />
    </Screen>
  );
}
