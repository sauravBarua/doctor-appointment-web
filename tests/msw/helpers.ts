import { HttpResponse } from 'msw';

export const ORIGIN = 'http://localhost:3000';
export const API = `${ORIGIN}/api/v1`;
export const BFF = `${ORIGIN}/api/session`;

export const ok = <T>(data: T, status = 200, meta: unknown = null) =>
  HttpResponse.json({ success: true, message: 'OK', meta, data }, { status });

export const fail = (status: number, code: string, message = 'Error') =>
  HttpResponse.json(
    { success: false, message, meta: null, data: null, error: { code } },
    { status },
  );
