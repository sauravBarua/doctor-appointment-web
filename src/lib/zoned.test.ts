import { describe, expect, it } from 'vitest';
import { formatPeriod, zonedToInstant } from './dates';

describe('zonedToInstant', () => {
  it('convertit l’heure d’été de Paris', () => {
    expect(zonedToInstant('2026-10-17', '09:00', 'Europe/Paris').toISOString()).toBe(
      '2026-10-17T07:00:00.000Z',
    );
  });

  it('convertit l’heure d’hiver', () => {
    expect(zonedToInstant('2026-12-01', '09:00', 'Europe/Paris').toISOString()).toBe(
      '2026-12-01T08:00:00.000Z',
    );
  });

  it('gère le jour du changement d’heure (25 octobre 2026)', () => {
    expect(zonedToInstant('2026-10-25', '12:00', 'Europe/Paris').toISOString()).toBe(
      '2026-10-25T11:00:00.000Z',
    );
  });
});

describe('formatPeriod', () => {
  it('résume une période d’un seul jour', () => {
    expect(
      formatPeriod('2026-10-16T10:00:00.000Z', '2026-10-16T12:00:00.000Z', 'Europe/Paris'),
    ).toBe('Vendredi 16 octobre 2026, 12:00 – 14:00');
  });

  it('résume une période sur plusieurs jours', () => {
    expect(
      formatPeriod('2026-10-16T07:00:00.000Z', '2026-10-18T15:00:00.000Z', 'Europe/Paris'),
    ).toBe('Du vendredi 16 octobre 2026 à 09:00 au dimanche 18 octobre 2026 à 17:00');
  });
});
