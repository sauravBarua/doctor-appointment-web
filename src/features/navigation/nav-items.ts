import type { Route } from 'next';
import {
  Bell,
  CalendarClock,
  CalendarDays,
  CalendarOff,
  LayoutDashboard,
  Search,
  type LucideIcon,
} from 'lucide-react';

export type NavRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface NavItem {
  href: Route;
  label: string;
  icon: LucideIcon;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

const GENERAL: NavGroup = {
  label: 'Général',
  items: [
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/notifications', label: 'Notifications', icon: Bell },
  ],
};

const PATIENT: NavGroup = {
  label: 'Patient',
  items: [
    { href: '/appointments', label: 'Mes rendez-vous', icon: CalendarDays },
    { href: '/doctors', label: 'Trouver un médecin', icon: Search },
  ],
};

const DOCTOR: NavGroup = {
  label: 'Espace médecin',
  items: [
    { href: '/doctor/appointments', label: 'Rendez-vous', icon: CalendarDays },
    { href: '/doctor/schedule', label: 'Disponibilités', icon: CalendarClock },
    { href: '/doctor/time-off', label: 'Congés', icon: CalendarOff },
  ],
};

export function navFor(role: NavRole | undefined): NavGroup[] {
  const groups = [GENERAL];
  if (role === 'PATIENT') groups.push(PATIENT);
  if (role === 'DOCTOR') groups.push(DOCTOR);
  // ADMIN group is added in F6.
  return groups;
}

export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
