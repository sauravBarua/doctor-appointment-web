import { SITE } from '@/config/site';
import type { AppNotification } from '@/lib/api/schemas/notifications';
import { capitalize, formatDateLong, formatTime } from '@/lib/dates';
import type { Role } from '@/stores/session';

const TITLES: Record<string, string> = {
  APPOINTMENT_BOOKED: 'Rendez-vous confirmé',
  APPOINTMENT_CANCELLED: 'Rendez-vous annulé',
};

export function notificationText(notification: AppNotification, role?: Role) {
  const startTime =
    typeof notification.data?.startTime === 'string' ? notification.data.startTime : null;

  // Doctors get the same type, but it means a new booking for them.
  const bookedTitle = role === 'DOCTOR' ? 'Nouveau rendez-vous' : TITLES.APPOINTMENT_BOOKED;
  const title =
    notification.type === 'APPOINTMENT_BOOKED'
      ? bookedTitle
      : (TITLES[notification.type] ?? notification.title);

  const description = startTime
    ? `Rendez-vous du ${formatDateLong(startTime, SITE.timezone)} à ${formatTime(startTime, SITE.timezone)}`
    : notification.body;

  return { title, description: capitalizeFirst(description) };
}

const capitalizeFirst = capitalize;

// Where a notification leads. Doctor and admin destinations arrive with their portals.
export function notificationHref(notification: AppNotification, role?: Role): string | null {
  if (role !== 'PATIENT') return null;
  return notification.type === 'APPOINTMENT_CANCELLED'
    ? '/appointments?tab=cancelled'
    : '/appointments';
}
