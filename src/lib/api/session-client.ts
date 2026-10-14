import axios, { type AxiosRequestConfig } from 'axios';
import { useSessionStore } from '@/stores/session';
import { toApiError } from './errors';
import { parseData } from './parse';
import { sessionPayloadSchema, type SessionPayload } from './schemas/auth';

const bff = axios.create({ baseURL: '/api/session', timeout: 15_000 });

async function callSession(config: AxiosRequestConfig): Promise<SessionPayload> {
  try {
    const response = await bff.request(config);
    return parseData(response.data, sessionPayloadSchema);
  } catch (error) {
    throw toApiError(error);
  }
}

export function loginRequest(input: { email: string; password: string }) {
  return callSession({ method: 'POST', url: '/login', data: input });
}

export async function logoutRequest(): Promise<void> {
  try {
    await bff.post('/logout');
  } catch (error) {
    throw toApiError(error);
  }
}

// Single flight: concurrent 401s share one refresh call.
let inflight: Promise<SessionPayload> | null = null;

export function refreshSession(): Promise<SessionPayload> {
  inflight ??= callSession({ method: 'POST', url: '/refresh' })
    .then((payload) => {
      useSessionStore.getState().setSession(payload);
      return payload;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}
