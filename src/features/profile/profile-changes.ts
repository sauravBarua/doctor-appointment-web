import { z } from 'zod';
import type { ProfileChanges } from './api';

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  bio: z.string().trim().max(1000),
});

// Only send what changed. The API rejects an empty update, and a doctor's current bio is not
// readable, so an empty bio field means "leave it as it is".
export function buildChanges(
  values: z.infer<typeof profileSchema>,
  current: { name: string },
  isDoctor: boolean,
): ProfileChanges {
  const changes: ProfileChanges = {};
  if (values.name !== current.name) changes.name = values.name;
  if (isDoctor && values.bio) changes.bio = values.bio;
  return changes;
}
