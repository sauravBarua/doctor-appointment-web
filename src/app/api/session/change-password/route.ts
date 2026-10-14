import { z } from 'zod';
import {
  apiChangePasswordSchema,
  apiRefreshSchema,
  sessionUserSchema,
} from '@/lib/api/schemas/auth';
import {
  callApi,
  failure,
  forward,
  forwardAndMaybeClear,
  readSessionToken,
  setSessionCookies,
  success,
  unwrapData,
} from '@/lib/server/api';

const bodySchema = z.object({ currentPassword: z.string(), newPassword: z.string() });

export async function POST(request: Request) {
  const sessionToken = await readSessionToken();
  if (!sessionToken) return failure(401, 'UNAUTHORIZED', 'No session');

  const input = bodySchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return failure(400, 'VALIDATION_ERROR', 'Invalid body');

  // The API needs a valid Bearer token, so get a fresh one from the session cookie first.
  const refreshed = await callApi('/auth/refresh', { body: { sessionToken } });
  if (!refreshed.ok) return forwardAndMaybeClear(refreshed);
  const token = unwrapData(refreshed.body, apiRefreshSchema);
  if (!token) return failure(502, 'INVALID_RESPONSE', 'Unexpected response');

  const changed = await callApi('/auth/change-password', {
    accessToken: token.accessToken,
    body: { ...input.data, sessionToken },
  });
  if (!changed.ok) return forward(changed); // a wrong current password must not drop the cookies
  const next = unwrapData(changed.body, apiChangePasswordSchema);
  if (!next) return failure(502, 'INVALID_RESPONSE', 'Unexpected response');

  const me = await callApi('/auth/me', { method: 'GET', accessToken: next.accessToken });
  if (!me.ok) return forwardAndMaybeClear(me);
  const user = unwrapData(me.body, sessionUserSchema);
  if (!user) return failure(502, 'INVALID_RESPONSE', 'Unexpected response');

  const response = success({ accessToken: next.accessToken, user }, 'Password changed');
  setSessionCookies(response, next.sessionToken);
  return response;
}
