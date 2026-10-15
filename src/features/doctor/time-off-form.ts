import { zonedToInstant } from '@/lib/dates';

export interface TimeOffForm {
  startDate: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endDate: string;
  endTime: string;
  reason: string;
}
export type TimeOffErrors = Partial<Record<keyof TimeOffForm, string>>;

const MAX_DAYS = 365;

// Mirrors the API rules; dates and times are wall-clock in the clinic's zone.
export function validateTimeOff(
  form: TimeOffForm,
  timeZone: string,
  now: Date = new Date(),
): { errors: TimeOffErrors; startTime?: string; endTime?: string } {
  const errors: TimeOffErrors = {};
  if (!form.startDate) errors.startDate = 'Choisissez la date de début';
  if (!form.startTime) errors.startTime = 'Choisissez l’heure de début';
  if (!form.endDate) errors.endDate = 'Choisissez la date de fin';
  if (!form.endTime) errors.endTime = 'Choisissez l’heure de fin';
  if (form.reason.trim().length > 200) errors.reason = '200 caractères maximum';
  if (Object.keys(errors).length > 0) return { errors };

  const start = zonedToInstant(form.startDate, form.startTime, timeZone);
  const end = zonedToInstant(form.endDate, form.endTime, timeZone);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { errors: { startDate: 'Date ou heure invalide' } };
  }
  if (end <= start) errors.endDate = 'La fin doit être après le début';
  else if (end <= now) errors.endDate = 'La fin doit être dans le futur';
  else if (end.getTime() - start.getTime() > MAX_DAYS * 86_400_000) {
    errors.endDate = 'Un congé ne peut pas dépasser 365 jours';
  }
  if (Object.keys(errors).length > 0) return { errors };

  return { errors, startTime: start.toISOString(), endTime: end.toISOString() };
}
