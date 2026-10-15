'use client';

import { WelcomeCard } from '@/features/auth/welcome-card';
import { useSessionStore } from '@/stores/session';
import { PatientDashboard } from './patient-dashboard';

// Doctors and admins get their own dashboards in F5 and F6.
export function DashboardHome() {
  const role = useSessionStore((s) => s.user?.role);
  return role === 'PATIENT' ? <PatientDashboard /> : <WelcomeCard />;
}
