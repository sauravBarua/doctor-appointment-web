import { describe, expect, it } from 'vitest';
import { ApiError, errorMessage } from './errors';

describe('messages d’erreur d’authentification', () => {
  it.each([
    ['INVALID_OTP', 'Code invalide ou expiré.'],
    ['EMAIL_ALREADY_REGISTERED', 'Un compte existe déjà avec cet e-mail.'],
    ['INVALID_GOOGLE_CODE', 'Le lien de connexion Google a expiré. Réessayez.'],
  ])('%s', (code, expected) => {
    expect(errorMessage(new ApiError(400, code, 'English text'))).toBe(expected);
  });
});
