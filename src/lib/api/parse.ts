import type { z } from 'zod';
import { envelopeSchema } from './envelope';
import { ApiError } from './errors';

// Validates the envelope, then the `data` payload. A mismatch means the API changed:
// it fails loudly here instead of breaking somewhere deep in a component.
export function parseData<T>(body: unknown, schema: z.ZodType<T>): T {
  const envelope = envelopeSchema.safeParse(body);
  if (!envelope.success) {
    throw new ApiError(
      502,
      'INVALID_RESPONSE',
      'Unexpected response envelope',
      envelope.error.issues,
    );
  }
  const data = schema.safeParse(envelope.data.data);
  if (!data.success) {
    throw new ApiError(502, 'INVALID_RESPONSE', 'Unexpected response data', data.error.issues);
  }
  return data.data;
}
