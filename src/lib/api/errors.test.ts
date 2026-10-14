import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { ApiError, errorMessage, toApiError } from './errors';

function httpError(status: number, data: unknown) {
  return new AxiosError('failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: {} as never,
    data,
  });
}

describe('toApiError', () => {
  it('reads the code from the API envelope', () => {
    const error = toApiError(
      httpError(429, {
        success: false,
        message: 'Too many',
        meta: null,
        data: null,
        error: { code: 'RATE_LIMITED' },
      }),
    );
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 429, code: 'RATE_LIMITED' });
  });

  it('maps a missing response to NETWORK_ERROR', () => {
    expect(toApiError(new AxiosError('Network Error', 'ERR_NETWORK'))).toMatchObject({
      status: 0,
      code: 'NETWORK_ERROR',
    });
  });
});

describe('errorMessage', () => {
  it('uses French copy for known codes', () => {
    expect(errorMessage(new ApiError(429, 'RATE_LIMITED', 'x'))).toMatch(/Trop de tentatives/);
  });

  it('falls back on the status for unknown codes', () => {
    expect(errorMessage(new ApiError(404, 'SOMETHING_NEW', 'x'))).toMatch(/introuvable/i);
  });
});
