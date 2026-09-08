import { TabStack } from '@/components/TabStack';
import { Stack } from 'expo-router';

export default function WardrobeLayout() {
  return (
    <TabStack>
      <Stack.Screen name="[id]" options={{ title: 'Вещь' }} />
    </TabStack>
  );
}
