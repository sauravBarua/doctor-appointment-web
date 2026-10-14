import { apiRefreshSchema } from '@/lib/api/schemas/auth';
import {
  callApi,
  clearSessionCookies,
  readSessionToken,
  success,
  unwrapData,
} from '@/lib/server/api';

export async function POST() {
  const sessionToken = await readSessionToken();
  if (sessionToken) {
    // The API's logout needs a valid Bearer token, so get a fresh one first.
    const refreshed = await callApi('/auth/refresh', { body: { sessionToken } });
    const token = refreshed.ok ? unwrapData(refreshed.body, apiRefreshSchema) : null;
    if (token) {
      await callApi('/auth/logout', { accessToken: token.accessToken, body: { sessionToken } });
    }
  }
  const response = success(null, 'Signed out');
  clearSessionCookies(response);
  return response;
}
