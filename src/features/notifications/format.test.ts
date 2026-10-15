import { describe, expect, it } from 'vitest';
import { notificationSchema } from '@/lib/api/schemas/notifications';
import { notificationHref, notificationText } from './format';

const booked = notificationSchema.parse({
  id: 'n1',
  type: 'APPOINTMENT_BOOKED',
  title: 'Appointment confirmed',
  body: 'Your appointment with Dr. Camille Dubois is confirmed.',
  data: { startTime: '2026-10-17T07:00:00.000Z', appointmentId: 'a1' },
  readAt: null,
  createdAt: '2026-10-15T08:48:28.628Z',
});

describe('notificationText', () => {
  it('traduit une confirmation pour le patient', () => {
    expect(notificationText(booked, 'PATIENT')).toEqual({
      title: 'Rendez-vous confirmé',
      description: 'Rendez-vous du samedi 17 octobre 2026 à 09:00',
    });
  });

  it('parle de « nouveau rendez-vous » pour le médecin', () => {
    expect(notificationText(booked, 'DOCTOR').title).toBe('Nouveau rendez-vous');
  });

  it('retombe sur le texte de l’API pour un type inconnu', () => {
    const unknown = { ...booked, type: 'SOMETHING_ELSE', data: null };
    expect(notificationText(unknown, 'PATIENT')).toEqual({
      title: 'Appointment confirmed',
      description: 'Your appointment with Dr. Camille Dubois is confirmed.',
    });
  });
});

describe('notificationHref', () => {
  it('mène le patient à ses rendez-vous', () => {
    expect(notificationHref(booked, 'PATIENT')).toBe('/appointments');
    expect(notificationHref({ ...booked, type: 'APPOINTMENT_CANCELLED' }, 'PATIENT')).toBe(
      '/appointments?tab=cancelled',
    );
    expect(notificationHref(booked, 'DOCTOR')).toBe('/doctor/appointments');
    expect(notificationHref(booked, 'ADMIN')).toBeNull();
  });
});
