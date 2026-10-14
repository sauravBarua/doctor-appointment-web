import { z } from 'zod';
import { apiGoogleSchema, sessionUserSchema } from '@/lib/api/schemas/auth';
import {
  callApi,
  failure,
  forward,
  setSessionCookies,
  success,
  unwrapData,
} from '@/lib/server/api';

const bodySchema = z.object({ code: z.string().min(20).max(100) });

export async function POST(request: Request) {
  const input = bodySchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return failure(400, 'INVALID_GOOGLE_CODE', 'Invalid code');

  const result = await callApi('/auth/google/exchange', { body: input.data });
  if (!result.ok) return forward(result);
  const data = unwrapData(result.body, apiGoogleSchema);
  if (!data) return failure(502, 'INVALID_RESPONSE', 'Unexpected response');

  let user = data.user;
  if (!user) {
    // The exchange did not include the user: fetch it.
    const me = await callApi('/auth/me', { method: 'GET', accessToken: data.accessToken });
    user = me.ok ? (unwrapData(me.body, sessionUserSchema) ?? undefined) : undefined;
    if (!user) return failure(502, 'INVALID_RESPONSE', 'Unexpected response');
  }

  const response = success({ accessToken: data.accessToken, user }, 'Signed in');
  setSessionCookies(response, data.sessionToken);
  return response;
}
