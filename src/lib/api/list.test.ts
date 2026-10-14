import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ApiError } from './errors';
import { parseList } from './list';

const item = z.object({ id: z.string() });
const body = (meta: unknown) => ({ success: true, message: 'ok', meta, data: [{ id: 'a' }] });

describe('parseList', () => {
  it('lit les éléments et la pagination', () => {
    const page = parseList(body({ page: 1, pageSize: 20, total: 1 }), item);
    expect(page.items).toEqual([{ id: 'a' }]);
    expect(page.meta.total).toBe(1);
  });

  it('échoue si la pagination est absente', () => {
    expect(() => parseList(body(null), item)).toThrow(ApiError);
  });
});
