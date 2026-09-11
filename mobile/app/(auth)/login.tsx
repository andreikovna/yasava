import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { router } from 'expo-router';

import { ApiError } from '@/api/client';
import { AuthTextField } from '@/components/AuthTextField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/constants/theme';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginScreen() {
  const signIn = useAuthStore((state) => state.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password) {
      setError('Введите email и пароль');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen edges={[]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.lead}>Гардероб в твоём телефоне</Text>

          <AuthTextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />
          <AuthTextField
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            label="Войти"
            onPress={handleSubmit}
            loading={loading}
            disabled={!email.trim() || !password}
          />

          <Pressable
            onPress={() => router.push('/(auth)/register')}
            style={styles.linkWrap}
          >
            <Text style={styles.link}>Нет аккаунта? Зарегистрироваться</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  form: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  lead: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  error: {
    color: '#B42318',
    fontSize: 14,
    lineHeight: 20,
  },
  linkWrap: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  link: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
