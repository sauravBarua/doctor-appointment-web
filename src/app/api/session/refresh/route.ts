import { apiRefreshSchema, sessionUserSchema } from '@/lib/api/schemas/auth';
import {
  callApi,
  failure,
  forwardAndMaybeClear,
  readSessionToken,
  success,
  unwrapData,
} from '@/lib/server/api';

export async function POST() {
  const sessionToken = await readSessionToken();
  if (!sessionToken) return failure(401, 'UNAUTHORIZED', 'No session');

  const refreshed = await callApi('/auth/refresh', { body: { sessionToken } });
  if (!refreshed.ok) return forwardAndMaybeClear(refreshed);
  const token = unwrapData(refreshed.body, apiRefreshSchema);
  if (!token) return failure(502, 'INVALID_RESPONSE', 'Unexpected response');

  const me = await callApi('/auth/me', { method: 'GET', accessToken: token.accessToken });
  if (!me.ok) return forwardAndMaybeClear(me);
  const user = unwrapData(me.body, sessionUserSchema);
  if (!user) return failure(502, 'INVALID_RESPONSE', 'Unexpected response');

  return success({ accessToken: token.accessToken, user });
}
