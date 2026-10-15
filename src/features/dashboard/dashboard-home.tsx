'use client';

import { WelcomeCard } from '@/features/auth/welcome-card';
import { useSessionStore } from '@/stores/session';
import { DoctorDashboard } from './doctor-dashboard';
import { PatientDashboard } from './patient-dashboard';

// The admin dashboard arrives in F6.
export function DashboardHome() {
  const role = useSessionStore((s) => s.user?.role);
  if (role === 'PATIENT') return <PatientDashboard />;
  if (role === 'DOCTOR') return <DoctorDashboard />;
  return <WelcomeCard />;
}
