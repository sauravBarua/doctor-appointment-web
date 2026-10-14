export const SITE = {
  name: 'Santé RDV',
  description: 'Trouvez un médecin et prenez rendez-vous en quelques minutes.',
  timezone: 'Europe/Paris',
  locale: 'fr-FR',
} as const;

export const NAV_LINKS = [
  { href: '/doctors', label: 'Médecins' },
  { href: '/specialties', label: 'Spécialités' },
  { href: '/clinics', label: 'Cliniques' },
] as const;
