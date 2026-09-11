import { GestureResponderEvent, Platform, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { colors } from '@/constants/theme';

type AddTabButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
};

const BUTTON_SIZE = 48;
const LIFT = Platform.OS === 'web' ? -8 : -12;

export function AddTabButton({ onPress }: AddTabButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.hit}>
      <View
        style={[
          styles.button,
          {
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            borderRadius: BUTTON_SIZE / 2,
            marginTop: LIFT,
          },
        ]}
      >
        <Ionicons name="add" size={26} color={colors.primaryText} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
