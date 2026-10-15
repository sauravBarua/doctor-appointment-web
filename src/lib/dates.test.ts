import { describe, expect, it } from 'vitest';
import { addDays, formatDateLong, formatTime, todayIn } from './dates';

describe('dates', () => {
  it('formate une heure dans le fuseau de la clinique', () => {
    expect(formatTime('2026-10-17T07:00:00.000Z', 'Europe/Paris')).toBe('09:00');
  });

  it('formate une date longue en français', () => {
    expect(formatDateLong('2026-10-17T07:00:00.000Z', 'Europe/Paris')).toBe(
      'samedi 17 octobre 2026',
    );
  });

  it('calcule le jour courant dans le fuseau demandé', () => {
    // 22:30 UTC is already the next day in Paris (UTC+2).
    expect(todayIn('Europe/Paris', new Date('2026-10-14T22:30:00Z'))).toBe('2026-10-15');
    expect(todayIn('UTC', new Date('2026-10-14T22:30:00Z'))).toBe('2026-10-14');
  });

  it('ajoute des jours en passant les fins de mois', () => {
    expect(addDays('2026-10-30', 3)).toBe('2026-11-02');
  });
});
