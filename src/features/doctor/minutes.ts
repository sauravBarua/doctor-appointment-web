export const WEEKDAYS = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
] as const;

// 0 -> "00:00", 540 -> "09:00", 1440 -> "24:00"
export function formatMinute(minute: number): string {
  const hours = String(Math.floor(minute / 60)).padStart(2, '0');
  const minutes = String(minute % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Every 30 minutes from 00:00 to 24:00.
export const MINUTE_OPTIONS = Array.from({ length: 49 }, (_, index) => index * 30);
