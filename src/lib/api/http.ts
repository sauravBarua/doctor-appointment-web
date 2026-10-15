import axios from 'axios';
import { API_BASE_URL } from '@/lib/env';
import { toApiError } from './errors';

// For public endpoints. No session store, no Bearer token: safe to use from server components.
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
});

publicApi.interceptors.response.use(undefined, (error: unknown) => {
  throw toApiError(error);
});
