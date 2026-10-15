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

const relativeFormat = new Intl.RelativeTimeFormat(SITE.locale, { numeric: 'auto' });

// "à l’instant", "il y a 5 minutes", "hier", then a plain date after a week.
export function relativeTime(iso: string, now: Date = new Date()): string {
  const seconds = Math.round((new Date(iso).getTime() - now.getTime()) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 45) return 'à l’instant';
  if (abs < 3600) return relativeFormat.format(Math.round(seconds / 60), 'minute');
  if (abs < 86_400) return relativeFormat.format(Math.round(seconds / 3600), 'hour');
  if (abs < 7 * 86_400) return relativeFormat.format(Math.round(seconds / 86_400), 'day');
  return new Intl.DateTimeFormat(SITE.locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: SITE.timezone,
  }).format(new Date(iso));
}

function offsetMinutes(timeZone: string, at: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(at);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(
    value('year'),
    value('month') - 1,
    value('day'),
    value('hour'),
    value('minute'),
    value('second'),
  );
  return Math.round((asUtc - at.getTime()) / 60_000);
}

// "2026-10-17" + "09:00" in Europe/Paris -> the real instant (07:00Z). Second pass handles DST changes.
export function zonedToInstant(ymd: string, hm: string, timeZone: string): Date {
  const wall = Date.parse(`${ymd}T${hm}:00Z`);
  const first = wall - offsetMinutes(timeZone, new Date(wall)) * 60_000;
  return new Date(wall - offsetMinutes(timeZone, new Date(first)) * 60_000);
}

// "Samedi 17 octobre 2026, 09:00 – 12:00" or "Du … au …" across days.
export function formatPeriod(start: string, end: string, timeZone: string): string {
  const sameDay = todayIn(timeZone, new Date(start)) === todayIn(timeZone, new Date(end));
  if (sameDay) {
    return `${capitalize(formatDateLong(start, timeZone))}, ${formatTime(start, timeZone)} – ${formatTime(end, timeZone)}`;
  }
  return `Du ${formatDateLong(start, timeZone)} à ${formatTime(start, timeZone)} au ${formatDateLong(end, timeZone)} à ${formatTime(end, timeZone)}`;
}

export const formatDateTime = (iso: string, timeZone: string) =>
  fmt(timeZone, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
