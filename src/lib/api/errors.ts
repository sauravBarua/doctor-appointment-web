import { isAxiosError } from 'axios';
import { envelopeSchema } from './envelope';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response;
      const parsed = envelopeSchema.safeParse(data);
      if (parsed.success && parsed.data.error) {
        return new ApiError(
          status,
          parsed.data.error.code,
          parsed.data.message,
          parsed.data.error.details,
        );
      }
      return new ApiError(status, status >= 500 ? 'INTERNAL_ERROR' : 'HTTP_ERROR', error.message);
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError(0, 'TIMEOUT', error.message);
    }
    return new ApiError(0, 'NETWORK_ERROR', error.message);
  }

  return new ApiError(0, 'UNKNOWN', error instanceof Error ? error.message : 'Unknown error');
}

const DEFAULT_MESSAGE = 'Une erreur est survenue. Réessayez.';

// User-facing copy is chosen here, by code. The API's own (English) message is never shown.
const BY_CODE: Record<string, string> = {
  VALIDATION_ERROR: 'Certaines informations sont invalides. Vérifiez le formulaire.',
  UNAUTHORIZED: 'Votre session a expiré. Reconnectez-vous.',
  FORBIDDEN: 'Vous n’avez pas accès à cette ressource.',
  NOT_FOUND: 'Ressource introuvable.',
  RATE_LIMITED: 'Trop de tentatives. Réessayez dans quelques minutes.',
  INTERNAL_ERROR: 'Une erreur est survenue côté serveur. Réessayez plus tard.',
  UPSTREAM_UNAVAILABLE: 'Le service est momentanément indisponible. Réessayez plus tard.',
  INVALID_RESPONSE: 'Réponse inattendue du serveur.',
  NETWORK_ERROR: 'Impossible de joindre le serveur. Vérifiez votre connexion.',
  TIMEOUT: 'Le serveur met trop de temps à répondre. Réessayez.',
  INVALID_CREDENTIALS: 'E-mail ou mot de passe incorrect.',
  EMAIL_NOT_VERIFIED: 'Votre e-mail n’est pas encore vérifié.',
  EMAIL_ALREADY_REGISTERED: 'Un compte existe déjà avec cet e-mail.',
  INVALID_OTP: 'Code invalide ou expiré.',
  OTP_COOLDOWN: 'Patientez un instant avant de demander un nouveau code.',
  ACCOUNT_NOT_FOUND: 'Aucun compte ne correspond à cette adresse.',
  PASSWORD_CHANGE_REQUIRED: 'Vous devez d’abord changer votre mot de passe.',
  TEMP_PASSWORD_EXPIRED: 'Votre mot de passe temporaire a expiré. Contactez un administrateur.',
  INVALID_CURRENT_PASSWORD: 'Le mot de passe actuel est incorrect.',
  ACCOUNT_NOT_LINKED:
    'Ce compte Google n’est lié à aucun compte. Créez un compte ou connectez-vous avec votre e-mail.',
  GOOGLE_AUTH_FAILED: 'La connexion avec Google a échoué. Réessayez.',
  INVALID_GOOGLE_CODE: 'Le lien de connexion Google a expiré. Réessayez.',
  BOOKING_LIMIT_REACHED: 'Vous avez atteint la limite de réservations. Réessayez plus tard.',
  PATIENT_TIME_CONFLICT: 'Vous avez déjà un rendez-vous sur ce créneau.',
  PATIENT_BUSY: 'Vous avez déjà un rendez-vous sur ce créneau.',
  SLOT_TAKEN: 'Ce créneau vient d’être réservé. Choisissez-en un autre.',
  SLOT_UNAVAILABLE: 'Ce créneau n’est plus disponible.',
  INVALID_SLOT: 'Ce créneau n’est pas valide.',
  CANCELLATION_WINDOW_PASSED: 'Le délai d’annulation est dépassé.',
  APPOINTMENT_NOT_CANCELLABLE: 'Ce rendez-vous ne peut plus être annulé.',
  INVALID_STATE_TRANSITION: 'Cette action n’est pas possible pour l’état actuel.',
  VERSION_CONFLICT: 'Ces données ont changé entre-temps. Rechargez la page.',
  AVAILABILITY_OVERLAP: 'Cette plage chevauche une disponibilité existante.',
  TIME_OFF_CONFLICT: 'Cette période entre en conflit avec des rendez-vous ou congés.',
  DURATION_LOCKED: 'La durée ne peut plus être modifiée.',
  ALREADY_EXISTS: 'Cet élément existe déjà.',
  RESOURCE_IN_USE: 'Cet élément est utilisé et ne peut pas être supprimé.',
  UPLOAD_ERROR: 'Le téléversement a échoué. Vérifiez le fichier.',
  PAYLOAD_TOO_LARGE: 'Le fichier est trop volumineux.',
};

function byStatus(status: number): string | undefined {
  if (status === 400) return BY_CODE.VALIDATION_ERROR;
  if (status === 401) return BY_CODE.UNAUTHORIZED;
  if (status === 403) return BY_CODE.FORBIDDEN;
  if (status === 404) return BY_CODE.NOT_FOUND;
  if (status === 429) return BY_CODE.RATE_LIMITED;
  if (status >= 500) return BY_CODE.INTERNAL_ERROR;
  return undefined;
}

export function errorMessage(error: unknown, fallback = DEFAULT_MESSAGE): string {
  const apiError = toApiError(error);
  return BY_CODE[apiError.code] ?? byStatus(apiError.status) ?? fallback;
}
