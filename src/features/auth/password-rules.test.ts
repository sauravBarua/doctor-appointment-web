import { describe, expect, it } from 'vitest';
import { newPasswordSchema } from './password-rules';

describe('newPasswordSchema', () => {
  it('accepte une lettre et un chiffre, 8 caractères ou plus', () => {
    expect(newPasswordSchema.safeParse('abcdefg1').success).toBe(true);
  });
  it('refuse trop court, sans chiffre, sans lettre', () => {
    expect(newPasswordSchema.safeParse('abc12').success).toBe(false);
    expect(newPasswordSchema.safeParse('abcdefgh').success).toBe(false);
    expect(newPasswordSchema.safeParse('12345678').success).toBe(false);
  });
  it('refuse plus de 72 octets (caractères multi-octets)', () => {
    expect(newPasswordSchema.safeParse(`${'é'.repeat(37)}1`).success).toBe(false);
  });
});
