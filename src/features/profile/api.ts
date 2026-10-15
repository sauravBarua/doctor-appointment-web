import { apiRequest } from '@/lib/api/client';
import { toFormData } from '@/lib/api/form-data';
import { sessionUserSchema } from '@/lib/api/schemas/auth';

export interface ProfileChanges {
  name?: string;
  bio?: string;
}

// PATCH /users/me is multipart (`data` JSON + optional `image`) and returns the updated user.
export const updateProfile = (changes: ProfileChanges, image?: File | null) =>
  apiRequest(
    { method: 'PATCH', url: '/users/me', data: toFormData(changes, image) },
    sessionUserSchema,
  );
