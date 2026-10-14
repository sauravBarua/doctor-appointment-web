import 'server-only';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { z } from 'zod';
import { envelopeSchema } from '@/lib/api/envelope';
import { API_BASE_URL } from '@/lib/env';

export const SESSION_COOKIE = 'sid'; // httpOnly: the session token, never readable by JS
export const HAS_SESSION_COOKIE = 'hs'; // readable flag so anonymous visitors skip the refresh call
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const cookieBase = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const, // also our CSRF defence for these POST handlers
  path: '/',
  maxAge: MAX_AGE_SECONDS,
};

export function setSessionCookies(response: NextResponse, sessionToken: string) {
  response.cookies.set(SESSION_COOKIE, sessionToken, { ...cookieBase, httpOnly: true });
  response.cookies.set(HAS_SESSION_COOKIE, '1', { ...cookieBase, httpOnly: false });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(HAS_SESSION_COOKIE);
}

export async function readSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export interface UpstreamResult {
  ok: boolean;
  status: number;
  body: unknown;
}

export function failureBody(code: string, message: string) {
  return { success: false, message, meta: null, data: null, error: { code } };
}

export function failure(status: number, code: string, message: string) {
  return NextResponse.json(failureBody(code, message), { status });
}

export function success<T>(data: T, message = 'OK') {
  return NextResponse.json({ success: true, message, meta: null, data });
}

export async function callApi(
  path: string,
  init: { method?: string; body?: unknown; accessToken?: string } = {},
): Promise<UpstreamResult> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: init.method ?? 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(init.accessToken ? { Authorization: `Bearer ${init.accessToken}` } : {}),
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });
    const body: unknown = await response.json().catch(() => null);
    return { ok: response.ok, status: response.status, body };
  } catch {
    return {
      ok: false,
      status: 502,
      body: failureBody('UPSTREAM_UNAVAILABLE', 'Service unavailable'),
    };
  }
}

export function unwrapData<T>(body: unknown, schema: z.ZodType<T>): T | null {
  const envelope = envelopeSchema.safeParse(body);
  if (!envelope.success) return null;
  const data = schema.safeParse(envelope.data.data);
  return data.success ? data.data : null;
}

export function forward(result: UpstreamResult) {
  return NextResponse.json(result.body ?? failureBody('UPSTREAM_ERROR', 'Upstream error'), {
    status: result.status,
  });
}

// Pass the API's answer through; if it says the session is dead, drop our cookies too.
export function forwardAndMaybeClear(result: UpstreamResult) {
  const response = forward(result);
  if (result.status === 401 || result.status === 403) clearSessionCookies(response);
  return response;
}
