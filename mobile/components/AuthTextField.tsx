import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { colors, radius, spacing } from '@/constants/theme';

type AuthTextFieldProps = TextInputProps & {
  label: string;
};

// react-native-web renders a browser focus ring inside the field; focus is shown on the wrapper instead
const noWebOutline = (
  Platform.OS === 'web' ? { outlineStyle: 'none' } : null
) as TextStyle | null;

export function AuthTextField({
  label,
  style,
  secureTextEntry,
  onFocus,
  onBlur,
  ...props
}: AuthTextFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = Boolean(secureTextEntry);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, isFocused && styles.inputWrapFocused]}>
        <TextInput
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={isPassword && !isVisible}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          style={[styles.input, noWebOutline, style]}
          {...props}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setIsVisible((prev) => !prev)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isVisible ? 'Скрыть пароль' : 'Показать пароль'}
            style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
          >
            <Ionicons
              name={isVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  inputWrapFocused: {
    borderColor: colors.primary,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 14,
  },
  toggle: {
    paddingLeft: spacing.xs,
    paddingVertical: spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
});
