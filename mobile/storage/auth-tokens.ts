import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'yasava.access_token';
const REFRESH_KEY = 'yasava.refresh_token';

const isWeb = Platform.OS === 'web';

async function getItem(key: string): Promise<string | null> {
  if (isWeb) return null;
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) return;
  await SecureStore.setItemAsync(key, value);
}

async function deleteItem(key: string): Promise<void> {
  if (isWeb) return;
  await SecureStore.deleteItemAsync(key);
}

export async function getStoredTokens(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> {
  const [accessToken, refreshToken] = await Promise.all([
    getItem(ACCESS_KEY),
    getItem(REFRESH_KEY),
  ]);
  return { accessToken, refreshToken };
}

export async function storeTokens(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await Promise.all([
    setItem(ACCESS_KEY, accessToken),
    setItem(REFRESH_KEY, refreshToken),
  ]);
}

export async function clearStoredTokens(): Promise<void> {
  await Promise.all([deleteItem(ACCESS_KEY), deleteItem(REFRESH_KEY)]);
}
