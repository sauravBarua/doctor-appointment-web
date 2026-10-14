import { apiLoginSchema } from '@/lib/api/schemas/auth';
import {
  callApi,
  failure,
  forward,
  setSessionCookies,
  success,
  unwrapData,
} from '@/lib/server/api';

export async function POST(request: Request) {
  const input: unknown = await request.json().catch(() => null);
  const result = await callApi('/auth/login', { body: input });
  if (!result.ok) return forward(result);

  const data = unwrapData(result.body, apiLoginSchema);
  if (!data) return failure(502, 'INVALID_RESPONSE', 'Unexpected response');

  const response = success({ accessToken: data.accessToken, user: data.user }, 'Signed in');
  setSessionCookies(response, data.sessionToken);
  return response;
}
