import { z } from 'zod';

const nullableString = z
  .string()
  .nullish()
  .transform((value) => value ?? null);

export const adminSpecialtySchema = z.object({
  id: z.string(),
  name: z.string(),
  iconUrl: nullableString,
  isActive: z.boolean(),
});
export type AdminSpecialty = z.infer<typeof adminSpecialtySchema>;

export const adminClinicSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
  address: z.string(),
  imageUrl: nullableString,
  timezone: z.string(),
  isActive: z.boolean(),
});
export type AdminClinic = z.infer<typeof adminClinicSchema>;

export const adminDoctorSchema = z.object({
  id: z.string(),
  slotDurationMinutes: z.number(),
  bio: nullableString,
  isActive: z.boolean(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: nullableString,
    isActive: z.boolean(),
    mustChangePassword: z.boolean(),
  }),
  clinic: z.object({ id: z.string(), name: z.string(), city: z.string(), timezone: z.string() }),
  specialty: z.object({ id: z.string(), name: z.string() }),
});
export type AdminDoctor = z.infer<typeof adminDoctorSchema>;

// Only what we need: the password is returned outside production.
export const createDoctorResultSchema = z.object({ temporaryPassword: z.string().nullish() });

export const auditLogSchema = z.object({
  id: z.string(),
  actorRole: z.string().nullish(),
  action: z.string(),
  entityType: z.string().nullish(),
  entityId: z.string().nullish(),
  metadata: z.unknown(),
  ip: z.string().nullish(),
  createdAt: z.string(),
  actor: z.object({ id: z.string(), email: z.string(), name: z.string() }).nullish(),
});
export type AuditLog = z.infer<typeof auditLogSchema>;

export const adminDashboardSchema = z.object({
  timezone: z.string(),
  users: z.object({
    patients: z.number(),
    doctors: z.number(),
    admins: z.number(),
    newPatientsLast30Days: z.number(),
  }),
  catalog: z.object({
    activeDoctors: z.number(),
    inactiveDoctors: z.number(),
    clinics: z.number(),
    specialties: z.number(),
  }),
  appointments: z.object({
    byStatus: z.object({
      BOOKED: z.number().default(0),
      CANCELLED: z.number().default(0),
      COMPLETED: z.number().default(0),
    }),
    today: z.number(),
    next7Days: z.number(),
    past30Days: z.number(),
  }),
  dailyBookings: z.array(z.object({ date: z.string(), count: z.number() })),
  topDoctors: z.array(
    z.object({
      doctorId: z.string(),
      name: z.string(),
      specialty: z.string(),
      appointments: z.number(),
    }),
  ),
});
export type AdminDashboardData = z.infer<typeof adminDashboardSchema>;
