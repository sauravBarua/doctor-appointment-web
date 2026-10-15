import { z } from 'zod';
import { appointmentSchema } from './appointments';

export const ruleSchema = z.object({
  id: z.string(),
  weekday: z.number().int().min(1).max(7), // 1 = Monday ... 7 = Sunday
  startMinute: z.number(),
  endMinute: z.number(),
  start: z.string(),
  end: z.string(),
});
export type Rule = z.infer<typeof ruleSchema>;

export const availabilitySchema = z.object({
  timezone: z.string(),
  slotDurationMinutes: z.number(),
  rules: z.array(ruleSchema),
});

export const timeOffSchema = z.object({
  id: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  reason: z
    .string()
    .nullish()
    .transform((value) => value ?? null),
});
export type TimeOff = z.infer<typeof timeOffSchema>;

export const doctorDashboardSchema = z.object({
  generatedAt: z.string(),
  timezone: z.string(),
  today: z.object({ total: z.number(), appointments: z.array(appointmentSchema) }),
  nextAppointment: appointmentSchema.nullable(),
  upcoming: z.number(),
  next7Days: z.array(z.object({ date: z.string(), count: z.number() })),
  byStatus: z.object({ BOOKED: z.number(), CANCELLED: z.number(), COMPLETED: z.number() }),
  patientsServed: z.number(),
  upcomingTimeOff: z.number(),
});
export type DoctorDashboard = z.infer<typeof doctorDashboardSchema>;
