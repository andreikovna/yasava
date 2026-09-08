import { Stack } from 'expo-router';

import { TabStack } from '@/components/TabStack';

export default function ProfileLayout() {
  return (
    <TabStack>
      <Stack.Screen name="family" options={{ title: 'Гардеробы семьи' }} />
    </TabStack>
  );
}
