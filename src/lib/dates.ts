import { SITE } from '@/config/site';

const fmt = (timeZone: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(SITE.locale, { ...options, timeZone });

// Today as yyyy-MM-dd in the given time zone (en-CA formats dates that way).
export function todayIn(timeZone: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function addDays(ymd: string, days: number): string {
  const date = new Date(`${ymd}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// Instants (ISO strings from the API)
export const formatTime = (iso: string, timeZone: string) =>
  fmt(timeZone, { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

export const formatDateLong = (iso: string, timeZone: string) =>
  fmt(timeZone, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(iso),
  );

export const dayOfMonth = (iso: string, timeZone: string) =>
  fmt(timeZone, { day: 'numeric' }).format(new Date(iso));

export const monthShort = (iso: string, timeZone: string) =>
  fmt(timeZone, { month: 'short' }).format(new Date(iso));

// Calendar days (yyyy-MM-dd, no time zone involved)
const noon = (ymd: string) => new Date(`${ymd}T12:00:00Z`);

export const formatYmdLong = (ymd: string) =>
  fmt('UTC', { weekday: 'long', day: 'numeric', month: 'long' }).format(noon(ymd));

export const formatDayMonth = (ymd: string) =>
  fmt('UTC', { day: 'numeric', month: 'long' }).format(noon(ymd));

export const weekdayShort = (ymd: string) =>
  fmt('UTC', { weekday: 'short' }).format(noon(ymd)).replace('.', '');

export const dayNumber = (ymd: string) => String(Number(ymd.slice(8, 10)));
