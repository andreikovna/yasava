import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 8000;

function hostFromUri(uri: string | null | undefined): string | null {
  if (!uri) return null;
  const ip = uri.match(/(\d{1,3}(?:\.\d{1,3}){3})/);
  if (ip) return ip[1];
  try {
    const withProtocol = uri.includes('://') ? uri : `http://${uri}`;
    const { hostname } = new URL(withProtocol);
    return hostname || null;
  } catch {
    return null;
  }
}

function normalizeHost(host: string): string {
  if (
    Platform.OS === 'android' &&
    (host === 'localhost' || host === '127.0.0.1')
  ) {
    return '10.0.2.2';
  }
  return host;
}

export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;

  const host =
    hostFromUri(Constants.expoConfig?.hostUri) ??
    hostFromUri(Constants.expoGoConfig?.debuggerHost) ??
    hostFromUri(Constants.linkingUri);

  const resolved = host
    ? normalizeHost(host)
    : Platform.OS === 'android'
      ? '10.0.2.2'
      : 'localhost';

  return `http://${resolved}:${API_PORT}`;
}

export function mediaUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = getApiBaseUrl();
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
