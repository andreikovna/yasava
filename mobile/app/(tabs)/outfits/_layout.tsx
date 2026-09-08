import { Stack } from 'expo-router';

import { TabStack } from '@/components/TabStack';

export default function OutfitsLayout() {
  return (
    <TabStack>
      <Stack.Screen name="create" options={{ title: 'Создание образа' }} />
    </TabStack>
  );
}
