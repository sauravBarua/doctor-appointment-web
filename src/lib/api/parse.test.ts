import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ApiError } from './errors';
import { parseData } from './parse';

const body = (data: unknown) => ({ success: true, message: 'OK', meta: null, data });
const schema = z.object({ n: z.number() });

describe('parseData', () => {
  it('returns the validated data', () => {
    expect(parseData(body({ n: 1 }), schema)).toEqual({ n: 1 });
  });

  it('throws INVALID_RESPONSE when the shape is wrong', () => {
    let caught: unknown;
    try {
      parseData(body({ n: 'x' }), schema);
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(ApiError);
    expect(caught).toMatchObject({ code: 'INVALID_RESPONSE' });
  });
});
