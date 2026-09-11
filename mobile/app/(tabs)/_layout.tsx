import { ComponentProps } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { ColorValue, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddTabButton } from '@/components/AddTabButton';
import { colors } from '@/constants/theme';

// Icon (22) + label (~12) + small gaps
const TAB_BAR_CONTENT_HEIGHT = 52;

function TabIcon({
  name,
  color,
}: {
  name: ComponentProps<typeof Ionicons>['name'];
  color: ColorValue;
}) {
  return <Ionicons name={name} size={22} color={color} />;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'web' ? 0 : insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: styles.label,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: TAB_BAR_CONTENT_HEIGHT + bottomInset,
          paddingBottom: bottomInset,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color }) => <TabIcon name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: 'Гардероб',
          tabBarIcon: ({ color }) => <TabIcon name="shirt-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Добавить',
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => <AddTabButton onPress={props.onPress} />,
        }}
      />
      <Tabs.Screen
        name="outfits"
        options={{
          title: 'Образы',
          tabBarIcon: ({ color }) => (
            <TabIcon name="sparkles-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color }) => (
            <TabIcon name="person-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
});
