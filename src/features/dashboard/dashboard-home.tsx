'use client';

import { WelcomeCard } from '@/features/auth/welcome-card';
import { useSessionStore } from '@/stores/session';
import { AdminDashboard } from './admin-dashboard';
import { DoctorDashboard } from './doctor-dashboard';
import { PatientDashboard } from './patient-dashboard';

export function DashboardHome() {
  const role = useSessionStore((s) => s.user?.role);
  if (role === 'PATIENT') return <PatientDashboard />;
  if (role === 'DOCTOR') return <DoctorDashboard />;
  if (role === 'ADMIN') return <AdminDashboard />;
  return <WelcomeCard />;
}
