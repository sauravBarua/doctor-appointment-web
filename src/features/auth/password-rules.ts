import { z } from 'zod';

const MAX_BYTES = 72; // bcrypt limit, same as the API

export const newPasswordSchema = z
  .string()
  .min(8, 'Au moins 8 caractères')
  .refine(
    (v) => new TextEncoder().encode(v).length <= MAX_BYTES,
    'Mot de passe trop long (72 octets maximum)',
  )
  .refine(
    (v) => /[A-Za-z]/.test(v) && /\d/.test(v),
    'Doit contenir au moins une lettre et un chiffre',
  );
