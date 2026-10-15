import { describe, expect, it } from 'vitest';
import {
  adminClinicSchema,
  adminDashboardSchema,
  adminDoctorSchema,
  adminSpecialtySchema,
  auditLogSchema,
} from './admin';

describe('admin schemas', () => {
  it('lit une spécialité sans icône', () => {
    const value = adminSpecialtySchema.parse({
      id: 'a',
      name: 'Cardiology',
      iconUrl: null,
      isActive: true,
    });
    expect(value.iconUrl).toBeNull();
  });

  it('lit une clinique', () => {
    const value = adminClinicSchema.parse({
      id: 'c',
      name: 'Clinique',
      city: 'Paris',
      address: '1 Rue Test',
      imageUrl: null,
      timezone: 'Europe/Paris',
      isActive: true,
    });
    expect(value.timezone).toBe('Europe/Paris');
  });

  it('lit un médecin et ses relations', () => {
    const value = adminDoctorSchema.parse({
      id: 'd',
      slotDurationMinutes: 30,
      bio: null,
      isActive: true,
      user: {
        id: 'u',
        name: 'Dr. E2E',
        email: 'a@b.dev',
        image: null,
        isActive: true,
        mustChangePassword: false,
      },
      clinic: { id: 'c', name: 'Clinique', city: 'Paris', timezone: 'Europe/Paris' },
      specialty: { id: 's', name: 'Cardiologie' },
    });
    expect(value.user.email).toBe('a@b.dev');
  });

  it('lit une entrée du journal sans acteur ni métadonnées', () => {
    const value = auditLogSchema.parse({
      id: 'l',
      actorRole: null,
      action: 'AUTH_LOGIN_FAILED',
      entityType: null,
      entityId: null,
      metadata: null,
      ip: '::1',
      createdAt: '2026-10-15T10:23:17.609Z',
      actor: null,
    });
    expect(value.actor).toBeNull();
  });

  it('lit le tableau de bord administrateur', () => {
    const value = adminDashboardSchema.parse({
      timezone: 'Europe/Paris',
      users: { patients: 12, doctors: 5, admins: 1, newPatientsLast30Days: 12 },
      catalog: { activeDoctors: 5, inactiveDoctors: 0, clinics: 5, specialties: 5 },
      appointments: {
        byStatus: { BOOKED: 10, CANCELLED: 4 },
        today: 0,
        next7Days: 2,
        past30Days: 8,
      },
      dailyBookings: [{ date: '2026-10-10', count: 8 }],
      topDoctors: [
        { doctorId: 'd', name: 'Dr. Camille Dubois', specialty: 'Cardiology', appointments: 5 },
      ],
    });
    expect(value.appointments.byStatus.COMPLETED).toBe(0);
  });
});
