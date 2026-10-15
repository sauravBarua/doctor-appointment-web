import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AppointmentsList } from '@/features/booking/appointments-list';

export const metadata: Metadata = { title: 'Mes rendez-vous' };

export default function AppointmentsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="font-display mb-8 text-3xl tracking-tight">Mes rendez-vous</h1>
      <Suspense>
        <AppointmentsList />
      </Suspense>
    </div>
  );
}
