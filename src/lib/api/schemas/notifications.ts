import { z } from 'zod';

export const notificationSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  body: z.string(),
  data: z
    .record(z.string(), z.unknown())
    .nullish()
    .transform((value) => value ?? null),
  readAt: z
    .string()
    .nullish()
    .transform((value) => value ?? null),
  createdAt: z.string(),
});
export type AppNotification = z.infer<typeof notificationSchema>;
