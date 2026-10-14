import { z } from 'zod';

const nullableString = z
  .string()
  .nullish()
  .transform((value) => value ?? null);

export const specialtySchema = z.object({
  id: z.string(),
  name: z.string(),
  iconUrl: nullableString,
  isActive: z.boolean().default(true),
});
export type Specialty = z.infer<typeof specialtySchema>;

export const clinicSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
  address: z.string(),
  imageUrl: nullableString,
  timezone: z.string(),
});
export type Clinic = z.infer<typeof clinicSchema>;

export const doctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: nullableString,
  bio: nullableString,
  slotDurationMinutes: z.number(),
  specialty: z.object({ id: z.string(), name: z.string() }),
  clinic: clinicSchema, // the embedded clinic has the same fields
});
export type Doctor = z.infer<typeof doctorSchema>;
