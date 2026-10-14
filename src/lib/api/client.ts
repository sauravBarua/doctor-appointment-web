import axios, {
  isAxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { z } from 'zod';
import { API_BASE_URL } from '@/lib/env';
import { useSessionStore } from '@/stores/session';
import { toApiError } from './errors';
import { parseData } from './parse';
import { refreshSession } from './session-client';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useSessionStore.getState().accessToken;
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

type Retriable = InternalAxiosRequestConfig & { _retried?: boolean };

api.interceptors.response.use(undefined, async (error: unknown) => {
  if (isAxiosError(error) && error.response?.status === 401 && error.config) {
    const original = error.config as Retriable;
    if (!original._retried && useSessionStore.getState().status === 'authenticated') {
      original._retried = true;
      try {
        const { accessToken } = await refreshSession();
        original.headers.set('Authorization', `Bearer ${accessToken}`);
        return await api.request(original);
      } catch (retryError) {
        // Refresh itself failed (session over): leave the app signed out.
        if (!isAxiosError(retryError)) useSessionStore.getState().clear();
        throw toApiError(retryError);
      }
    }
  }
  throw toApiError(error);
});

export async function apiRequest<T>(config: AxiosRequestConfig, schema: z.ZodType<T>): Promise<T> {
  const response = await api.request(config);
  return parseData(response.data, schema);
}
