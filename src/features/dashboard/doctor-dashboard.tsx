'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ErrorState } from '@/components/error-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AppointmentCard } from '@/features/booking/appointment-card';
import { CancelDialog } from '@/features/booking/cancel-dialog';
import { useDoctorDashboard } from '@/features/doctor/hooks';
import type { Appointment } from '@/lib/api/schemas/appointments';
import { useSessionStore } from '@/stores/session';
import { WeekChart } from './week-chart';

export function DoctorDashboard() {
  const name = useSessionStore((s) => s.user?.name ?? '');
  const dashboard = useDoctorDashboard();
  const [toCancel, setToCancel] = useState<Appointment | null>(null);
  const { data } = dashboard;

  const tiles = data
    ? [
        { label: 'Aujourd’hui', value: data.today.total },
        { label: 'À venir', value: data.upcoming },
        { label: 'Patients suivis', value: data.patientsServed },
        { label: 'Congés à venir', value: data.upcomingTimeOff, href: '/doctor/time-off' },
      ]
    : [];

  return (
    <div className="grid gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Bonjour, {name}</h1>
          <p className="text-muted-foreground mt-1">Voici votre activité.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/doctor/schedule">Disponibilités</Link>
          </Button>
          <Button asChild>
            <Link href="/doctor/appointments">Mes rendez-vous</Link>
          </Button>
        </div>
      </header>

      {dashboard.isPending ? (
        <div className="grid gap-4" role="status" aria-label="Chargement">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      ) : dashboard.error ? (
        <ErrorState error={dashboard.error} onRetry={() => void dashboard.refetch()} />
      ) : data ? (
        <>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {tiles.map((tile) => (
              <Card key={tile.label}>
                <CardContent>
                  <dt className="text-muted-foreground text-sm">
                    {tile.href ? (
                      <Link href={tile.href} className="hover:underline">
                        {tile.label}
                      </Link>
                    ) : (
                      tile.label
                    )}
                  </dt>
                  <dd className="font-display text-3xl">{tile.value}</dd>
                </CardContent>
              </Card>
            ))}
          </dl>

          <section aria-labelledby="today-title" className="grid gap-3">
            <h2 id="today-title" className="font-display text-xl">
              Aujourd’hui
            </h2>
            {data.today.appointments.length === 0 ? (
              <p className="text-muted-foreground rounded-xl border border-dashed p-6">
                Aucun rendez-vous aujourd’hui.
              </p>
            ) : (
              <ul className="grid gap-4">
                {data.today.appointments.map((appointment) => (
                  <li key={appointment.id}>
                    <AppointmentCard
                      viewer="DOCTOR"
                      appointment={appointment}
                      onCancel={setToCancel}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {data.nextAppointment ? (
            <section aria-labelledby="next-title" className="grid gap-3">
              <h2 id="next-title" className="font-display text-xl">
                Prochain rendez-vous
              </h2>
              <AppointmentCard
                viewer="DOCTOR"
                appointment={data.nextAppointment}
                onCancel={setToCancel}
              />
            </section>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl">7 prochains jours</CardTitle>
            </CardHeader>
            <CardContent>
              <WeekChart days={data.next7Days} />
            </CardContent>
          </Card>
        </>
      ) : null}

      <CancelDialog viewer="DOCTOR" appointment={toCancel} onClose={() => setToCancel(null)} />
    </div>
  );
}
