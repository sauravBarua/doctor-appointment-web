import { describe, expect, it } from 'vitest';
import { actionLabel, roleLabel } from './audit-format';

describe('audit format', () => {
  it('traduit les actions connues et garde les autres telles quelles', () => {
    expect(actionLabel('AUTH_LOGIN_SUCCESS')).toBe('Connexion réussie');
    expect(actionLabel('SOMETHING_NEW')).toBe('SOMETHING_NEW');
  });

  it('traduit les rôles', () => {
    expect(roleLabel('DOCTOR')).toBe('Médecin');
    expect(roleLabel(null)).toBe('');
  });
});
