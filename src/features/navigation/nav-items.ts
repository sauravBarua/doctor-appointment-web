import type { Route } from 'next';
import {
  Bell,
  Building2,
  CalendarClock,
  CalendarDays,
  CalendarOff,
  HeartPulse,
  LayoutDashboard,
  ScrollText,
  Search,
  Stethoscope,
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

const ADMIN: NavGroup = {
  label: 'Administration',
  items: [
    { href: '/admin/doctors', label: 'Médecins', icon: Stethoscope },
    { href: '/admin/clinics', label: 'Cliniques', icon: Building2 },
    { href: '/admin/specialties', label: 'Spécialités', icon: HeartPulse },
    { href: '/admin/audit-logs', label: 'Journal d’audit', icon: ScrollText },
  ],
};

export function navFor(role: NavRole | undefined): NavGroup[] {
  const groups = [GENERAL];
  if (role === 'PATIENT') groups.push(PATIENT);
  if (role === 'DOCTOR') groups.push(DOCTOR);
  if (role === 'ADMIN') groups.push(ADMIN);
  return groups;
}

export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
