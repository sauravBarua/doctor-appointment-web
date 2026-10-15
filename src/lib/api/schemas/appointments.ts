import { z } from 'zod';

const nullableString = z
  .string()
  .nullish()
  .transform((value) => value ?? null);

export const appointmentStatusSchema = z.enum(['BOOKED', 'CANCELLED', 'COMPLETED']);
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;

export const appointmentSchema = z.object({
  id: z.string(),
  status: appointmentStatusSchema,
  startTime: z.string(),
  endTime: z.string(),
  startLocal: z.string(),
  endLocal: z.string(),
  timezone: z.string(),
  doctor: z.object({
    id: z.string(),
    name: z.string(),
    specialty: z.string(),
    clinic: z.object({ id: z.string(), name: z.string(), city: z.string(), address: z.string() }),
  }),
  patient: z.object({ id: z.string(), name: z.string() }),
  cancelledAt: nullableString,
  cancelReason: nullableString,
  createdAt: z.string(),
});
export type Appointment = z.infer<typeof appointmentSchema>;

export const slotSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  startLocal: z.string(),
  endLocal: z.string(),
  label: z.string(),
});
export type Slot = z.infer<typeof slotSchema>;

export const slotsResponseSchema = z.object({
  doctorId: z.string(),
  timezone: z.string(),
  slotDurationMinutes: z.number(),
  from: z.string(),
  to: z.string(),
  days: z.array(z.object({ date: z.string(), slots: z.array(slotSchema) })),
});
export type SlotsResponse = z.infer<typeof slotsResponseSchema>;

export const patientDashboardSchema = z.object({
  generatedAt: z.string(),
  timezone: z.string(),
  nextAppointment: appointmentSchema.nullable(),
  upcoming: z.array(appointmentSchema),
  counts: z.object({ upcoming: z.number(), past: z.number(), cancelled: z.number() }),
});
export type PatientDashboard = z.infer<typeof patientDashboardSchema>;
