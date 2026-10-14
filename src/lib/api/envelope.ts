import { z } from 'zod';

export const envelopeSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  meta: z.unknown(),
  data: z.unknown(),
  error: z.object({ code: z.string(), details: z.unknown().optional() }).optional(),
});
export type Envelope = z.infer<typeof envelopeSchema>;
