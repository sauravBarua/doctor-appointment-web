import { describe, expect, it } from 'vitest';
import { relativeTime } from './dates';

const now = new Date('2026-10-15T10:00:00Z');

describe('relativeTime', () => {
  it('dit « à l’instant » pour quelques secondes', () => {
    expect(relativeTime('2026-10-15T09:59:40Z', now)).toBe('à l’instant');
  });

  it('formate minutes et jours en français', () => {
    expect(relativeTime('2026-10-15T09:55:00Z', now)).toBe('il y a 5 minutes');
    expect(relativeTime('2026-10-12T10:00:00Z', now)).toBe('il y a 3 jours');
  });

  it('affiche une date au-delà d’une semaine', () => {
    expect(relativeTime('2026-09-01T10:00:00Z', now)).toMatch(/2026/);
  });
});
