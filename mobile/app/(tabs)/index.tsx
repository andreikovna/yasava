import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';

export default function HomeScreen() {
  return (
    <Screen title="Главная" subtitle="Привет!">
      <EmptyState
        title="Рекомендации на сегодня"
        description="Погода и образы на неделю появятся вместе с планировщиком."
      />
    </Screen>
  );
}
