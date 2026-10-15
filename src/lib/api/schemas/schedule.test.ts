import { describe, expect, it } from 'vitest';
import { availabilitySchema, doctorDashboardSchema, timeOffSchema } from './schedule';

describe('schémas médecin', () => {
  it('lit les disponibilités', () => {
    const data = availabilitySchema.parse({
      timezone: 'Europe/Paris',
      slotDurationMinutes: 30,
      rules: [
        { id: 'r1', weekday: 1, startMinute: 540, endMinute: 720, start: '09:00', end: '12:00' },
      ],
    });
    expect(data.rules[0]?.start).toBe('09:00');
  });

  it('lit un congé avec ou sans motif', () => {
    const base = {
      id: 't1',
      startTime: '2026-10-16T10:39:07.300Z',
      endTime: '2026-10-16T12:39:07.300Z',
    };
    expect(timeOffSchema.parse({ ...base, reason: 'Conference' }).reason).toBe('Conference');
    expect(timeOffSchema.parse(base).reason).toBeNull();
  });

  it('lit le tableau de bord sans rendez-vous aujourd’hui', () => {
    const data = doctorDashboardSchema.parse({
      generatedAt: '2026-10-15T09:32:14.494Z',
      timezone: 'Europe/Paris',
      today: { total: 0, appointments: [] },
      nextAppointment: null,
      upcoming: 2,
      next7Days: [{ date: '2026-10-15', count: 0 }],
      byStatus: { BOOKED: 7, CANCELLED: 1, COMPLETED: 0 },
      patientsServed: 1,
      upcomingTimeOff: 1,
    });
    expect(data.upcoming).toBe(2);
  });
});
