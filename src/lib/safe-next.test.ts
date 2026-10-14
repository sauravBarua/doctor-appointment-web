import { describe, expect, it } from 'vitest';
import { safeNext } from './safe-next';

describe('safeNext', () => {
  it('keeps same-site paths', () => {
    expect(safeNext('/appointments?status=BOOKED')).toBe('/appointments?status=BOOKED');
  });
  it('rejects anything that could leave the site', () => {
    for (const value of [
      'https://evil.example',
      '//evil.example',
      '/\\evil',
      'dashboard',
      '',
      null,
      undefined,
    ]) {
      expect(safeNext(value)).toBe('/dashboard');
    }
  });
});
