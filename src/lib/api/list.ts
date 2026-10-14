import { z } from 'zod';
import { envelopeSchema } from './envelope';
import { ApiError } from './errors';

export const pageMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});
export type PageMeta = z.infer<typeof pageMetaSchema>;

export interface Page<T> {
  items: T[];
  meta: PageMeta;
}

// Paginated endpoints: `data` is the array, `meta` is {page, pageSize, total}.
export function parseList<T>(body: unknown, schema: z.ZodType<T>): Page<T> {
  const envelope = envelopeSchema.safeParse(body);
  if (!envelope.success) {
    throw new ApiError(
      502,
      'INVALID_RESPONSE',
      'Unexpected response envelope',
      envelope.error.issues,
    );
  }
  const items = z.array(schema).safeParse(envelope.data.data);
  const meta = pageMetaSchema.safeParse(envelope.data.meta);
  if (!items.success || !meta.success) {
    throw new ApiError(502, 'INVALID_RESPONSE', 'Unexpected list response', [
      ...(items.success ? [] : items.error.issues),
      ...(meta.success ? [] : meta.error.issues),
    ]);
  }
  return { items: items.data, meta: meta.data };
}
