import { GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { colors } from '@/constants/theme';

type AddTabButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
};

export function AddTabButton({ onPress }: AddTabButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.hit}>
      <View style={styles.button}>
        <Ionicons name="add" size={30} color={colors.primaryText} />
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
    width: 56,
    height: 56,
    marginTop: -18,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
