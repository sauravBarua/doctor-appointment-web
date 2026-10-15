import { describe, expect, it } from 'vitest';
import { clinicFormSchema, isTimeZone } from './clinic-form';

describe('clinic form', () => {
  it('reconnaît un fuseau IANA et rejette le reste', () => {
    expect(isTimeZone('Europe/Paris')).toBe(true);
    expect(isTimeZone('Mars/Phobos')).toBe(false);
  });

  it('accepte une clinique valide', () => {
    const result = clinicFormSchema.safeParse({
      name: 'Clinique de La Muette',
      city: 'Paris',
      address: '46 Rue Nicolo, 75116 Paris',
      timezone: 'Europe/Paris',
    });
    expect(result.success).toBe(true);
  });

  it('signale une adresse trop courte', () => {
    const result = clinicFormSchema.safeParse({
      name: 'Clinique',
      city: 'Paris',
      address: '1',
      timezone: 'Europe/Paris',
    });
    expect(result.success).toBe(false);
  });
});
