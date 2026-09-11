import { getApiBaseUrl } from '@/config/api';
import {
  clearPersistedSession,
  persistSession,
  useAuthStore,
} from '@/stores/auth-store';
import type { TokenResponse } from '@/types/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type QueryValue = string | number | boolean | null | undefined;
type Query = Record<string, QueryValue>;

export type RequestOptions = RequestInit & {
  skipAuth?: boolean;
  query?: Query;
  _retry?: boolean;
};

function toQueryString(query?: Query): string {
  if (!query) return '';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === '') continue;
    params.set(key, String(value));
  }
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body.detail === 'string') return body.detail;
    if (Array.isArray(body.detail)) {
      return body.detail
        .map((item: { msg?: string } | string) =>
          typeof item === 'string' ? item : (item.msg ?? JSON.stringify(item)),
        )
        .join(', ');
    }
    return response.statusText;
  } catch {
    return response.statusText;
  }
}

let refreshInFlight: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) return false;
    try {
      const tokens = await request<TokenResponse>('/auth/refresh', {
        method: 'POST',
        skipAuth: true,
        query: { refresh_token: refreshToken },
      });
      await persistSession(tokens.access_token, tokens.refresh_token);
      return true;
    } catch {
      await clearPersistedSession();
      return false;
    }
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth, query, _retry, headers, ...init } = options;
  const url = `${getApiBaseUrl()}${path}${toQueryString(query)}`;
  const accessToken = useAuthStore.getState().accessToken;
  const isFormData =
    typeof FormData !== 'undefined' && init.body instanceof FormData;

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(!skipAuth && accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
      ...headers,
    },
  });

  if (response.status === 401 && !skipAuth && !_retry) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return request<T>(path, { ...options, _retry: true });
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, query?: Query) =>
    request<T>(path, { method: 'GET', query }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
      ...options,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body === undefined ? undefined : JSON.stringify(body),
    }),

  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
