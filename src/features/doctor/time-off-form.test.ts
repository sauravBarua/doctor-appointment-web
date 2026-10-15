import { describe, expect, it } from 'vitest';
import { validateTimeOff, type TimeOffForm } from './time-off-form';

const now = new Date('2026-10-15T10:00:00Z');
const valid: TimeOffForm = {
  startDate: '2026-10-20',
  startTime: '09:00',
  endDate: '2026-10-20',
  endTime: '12:00',
  reason: '',
};

describe('validateTimeOff', () => {
  it('convertit en instants UTC quand tout est valide', () => {
    const result = validateTimeOff(valid, 'Europe/Paris', now);
    expect(result.errors).toEqual({});
    expect(result.startTime).toBe('2026-10-20T07:00:00.000Z');
    expect(result.endTime).toBe('2026-10-20T10:00:00.000Z');
  });

  it('demande les champs manquants', () => {
    const { errors } = validateTimeOff(
      { ...valid, startDate: '', endTime: '' },
      'Europe/Paris',
      now,
    );
    expect(errors.startDate).toBe('Choisissez la date de début');
    expect(errors.endTime).toBe('Choisissez l’heure de fin');
  });

  it('refuse une fin avant le début ou dans le passé', () => {
    expect(
      validateTimeOff({ ...valid, endTime: '08:00' }, 'Europe/Paris', now).errors.endDate,
    ).toBe('La fin doit être après le début');
    expect(
      validateTimeOff(
        { ...valid, startDate: '2026-10-01', endDate: '2026-10-02' },
        'Europe/Paris',
        now,
      ).errors.endDate,
    ).toBe('La fin doit être dans le futur');
  });

  it('refuse plus de 365 jours', () => {
    expect(
      validateTimeOff({ ...valid, endDate: '2027-11-01' }, 'Europe/Paris', now).errors.endDate,
    ).toBe('Un congé ne peut pas dépasser 365 jours');
  });
});
