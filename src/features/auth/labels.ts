import type { Role } from '@/lib/api/schemas/auth';

export const ROLE_LABELS: Record<Role, string> = {
  PATIENT: 'Patient',
  DOCTOR: 'Médecin',
  ADMIN: 'Administrateur',
};
