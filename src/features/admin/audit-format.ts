const ACTIONS: Record<string, string> = {
  AUTH_LOGIN_SUCCESS: 'Connexion réussie',
  AUTH_LOGIN_FAILED: 'Connexion échouée',
  AUTH_GOOGLE_LOGIN_SUCCESS: 'Connexion Google réussie',
  AUTH_GOOGLE_LOGIN_FAILED: 'Connexion Google échouée',
  APPOINTMENT_BOOKED: 'Rendez-vous réservé',
  APPOINTMENT_CANCELLED: 'Rendez-vous annulé',
  AVAILABILITY_RULE_CREATED: 'Disponibilité créée',
  TIME_OFF_CREATED: 'Congé ajouté',
};

// Unknown codes show as-is until they get a label.
export const actionLabel = (action: string) => ACTIONS[action] ?? action;

const ROLES: Record<string, string> = {
  ADMIN: 'Administrateur',
  DOCTOR: 'Médecin',
  PATIENT: 'Patient',
};
export const roleLabel = (role: string | null | undefined) => (role ? (ROLES[role] ?? role) : '');
