'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ErrorState } from '@/components/error-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AppointmentCard } from '@/features/booking/appointment-card';
import { CancelDialog } from '@/features/booking/cancel-dialog';
import { usePatientDashboard } from '@/features/booking/hooks';
import type { Appointment } from '@/lib/api/schemas/appointments';
import { useSessionStore } from '@/stores/session';

const COUNTERS = [
  { key: 'upcoming', label: 'À venir' },
  { key: 'past', label: 'Passés' },
  { key: 'cancelled', label: 'Annulés' },
] as const;

export function PatientDashboard() {
  const name = useSessionStore((s) => s.user?.name ?? '');
  const dashboard = usePatientDashboard();
  const [toCancel, setToCancel] = useState<Appointment | null>(null);
  const { data } = dashboard;

  return (
    <div className="grid gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Bonjour, {name.split(' ')[0]}</h1>
          <p className="text-muted-foreground mt-1">Voici un aperçu de vos rendez-vous.</p>
        </div>
        <Button asChild>
          <Link href="/doctors">Prendre rendez-vous</Link>
        </Button>
      </header>

      {dashboard.isPending ? (
        <div className="grid gap-4" role="status" aria-label="Chargement">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      ) : dashboard.error ? (
        <ErrorState error={dashboard.error} onRetry={() => void dashboard.refetch()} />
      ) : (
        <>
          <section aria-labelledby="next-title" className="grid gap-3">
            <h2 id="next-title" className="font-display text-xl">
              Prochain rendez-vous
            </h2>
            {data?.nextAppointment ? (
              <AppointmentCard appointment={data.nextAppointment} onCancel={setToCancel} />
            ) : (
              <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed p-6">
                <p className="text-muted-foreground">Vous n’avez aucun rendez-vous à venir.</p>
                <Button asChild variant="outline">
                  <Link href="/doctors">Trouver un médecin</Link>
                </Button>
              </div>
            )}
          </section>

          <dl className="grid gap-4 sm:grid-cols-3">
            {COUNTERS.map(({ key, label }) => (
              <Card key={key}>
                <CardContent>
                  <dt className="text-muted-foreground text-sm">{label}</dt>
                  <dd className="font-display text-3xl">{data?.counts[key] ?? 0}</dd>
                </CardContent>
              </Card>
            ))}
          </dl>

          {data && data.upcoming.length > 1 ? (
            <section aria-labelledby="more-title" className="grid gap-3">
              <div className="flex items-end justify-between gap-4">
                <h2 id="more-title" className="font-display text-xl">
                  Rendez-vous suivants
                </h2>
                <Link href="/appointments" className="text-primary text-sm hover:underline">
                  Voir tous mes rendez-vous
                </Link>
              </div>
              <ul className="grid gap-4">
                {data.upcoming.slice(1).map((appointment) => (
                  <li key={appointment.id}>
                    <AppointmentCard appointment={appointment} onCancel={setToCancel} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}

      <CancelDialog appointment={toCancel} onClose={() => setToCancel(null)} />
    </div>
  );
}
