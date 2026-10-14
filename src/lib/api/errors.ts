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
