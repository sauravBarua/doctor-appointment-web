import { describe, expect, it } from 'vitest';
import { isActive, navFor } from './nav-items';

const hrefs = (role: Parameters<typeof navFor>[0]) =>
  navFor(role).flatMap((g) => g.items.map((i) => i.href as string));

describe('navFor', () => {
  it('gives patients their appointments and the doctor search', () => {
    expect(hrefs('PATIENT')).toEqual(
      expect.arrayContaining(['/dashboard', '/appointments', '/doctors']),
    );
    expect(hrefs('PATIENT')).not.toContain('/doctor/schedule');
  });

  it('gives doctors the doctor section only', () => {
    expect(hrefs('DOCTOR')).toEqual(
      expect.arrayContaining(['/doctor/appointments', '/doctor/schedule', '/doctor/time-off']),
    );
    expect(hrefs('DOCTOR')).not.toContain('/appointments');
  });

  it('falls back to the general group without a role', () => {
    expect(hrefs(undefined)).toEqual(['/dashboard', '/notifications']);
  });
});

describe('isActive', () => {
  it('matches exact and nested paths, not prefixes of other words', () => {
    expect(isActive('/doctor/schedule', '/doctor/schedule')).toBe(true);
    expect(isActive('/doctors/abc', '/doctors')).toBe(true);
    expect(isActive('/doctor/schedule', '/doctors')).toBe(false);
  });
});
