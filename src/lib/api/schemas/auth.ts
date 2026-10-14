import { z } from 'zod';

export const roleSchema = z.enum(['ADMIN', 'DOCTOR', 'PATIENT']);
export type Role = z.infer<typeof roleSchema>;

export const sessionUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: roleSchema,
  image: z
    .string()
    .nullish()
    .transform((value) => value ?? null),
  mustChangePassword: z.boolean().default(false),
});
export type SessionUser = z.infer<typeof sessionUserSchema>;

// What the API returns on login.
export const apiLoginSchema = z.object({
  accessToken: z.string(),
  sessionToken: z.string(),
  user: sessionUserSchema,
});

// What the API returns on refresh.
export const apiRefreshSchema = z.object({ accessToken: z.string() });

// What our /api/session handlers return to the browser (never the session token).
export const sessionPayloadSchema = z.object({
  accessToken: z.string(),
  user: sessionUserSchema,
});
export type SessionPayload = z.infer<typeof sessionPayloadSchema>;

// What the API returns after a password change (new tokens).
export const apiChangePasswordSchema = z.object({
  accessToken: z.string(),
  sessionToken: z.string(),
});

// What the API returns from the Google code exchange (user may be omitted).
export const apiGoogleSchema = z.object({
  accessToken: z.string(),
  sessionToken: z.string(),
  user: sessionUserSchema.optional(),
});
