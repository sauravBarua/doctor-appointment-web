import { describe, expect, it } from 'vitest';
import { appointmentSchema, patientDashboardSchema } from './appointments';

const appointment = {
  id: '7423d709-9357-4db4-8a8d-09353dc6e6ce',
  status: 'BOOKED',
  startTime: '2026-10-17T07:00:00.000Z',
  endTime: '2026-10-17T07:30:00.000Z',
  startLocal: '2026-10-17T09:00:00+02:00',
  endLocal: '2026-10-17T09:30:00+02:00',
  timezone: 'Europe/Paris',
  doctor: {
    id: '21d4faa4-430c-41b2-be54-6e3a460166b9',
    name: 'Dr. Camille Dubois',
    specialty: 'Cardiology',
    clinic: {
      id: 'c1',
      name: 'Clinique de La Muette',
      city: 'Paris',
      address: '46 Rue Nicolo, 75116 Paris',
    },
  },
  patient: { id: 'p1', name: 'Alice Martin' },
  cancelledAt: null,
  cancelReason: null,
  createdAt: '2026-10-14T15:55:21.759Z',
};

describe('schémas de rendez-vous', () => {
  it('lit un rendez-vous réservé', () => {
    expect(appointmentSchema.parse(appointment).status).toBe('BOOKED');
  });

  it('lit un tableau de bord patient, avec ou sans prochain rendez-vous', () => {
    const counts = { upcoming: 0, past: 5, cancelled: 1 };
    const empty = patientDashboardSchema.parse({
      generatedAt: 'x',
      timezone: 'Europe/Paris',
      nextAppointment: null,
      upcoming: [],
      counts,
    });
    expect(empty.nextAppointment).toBeNull();
    const full = patientDashboardSchema.parse({
      generatedAt: 'x',
      timezone: 'Europe/Paris',
      nextAppointment: appointment,
      upcoming: [appointment],
      counts: { ...counts, upcoming: 1 },
    });
    expect(full.upcoming).toHaveLength(1);
  });
});
