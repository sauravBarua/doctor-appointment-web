'use client';

import Link from 'next/link';
import { ErrorState } from '@/components/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminDashboard } from '@/features/admin/hooks';
import { useSessionStore } from '@/stores/session';
import { DailyChart } from './daily-chart';

interface TileProps {
  label: string;
  value: number;
  hint?: string;
  href?: string;
}

function Tile({ label, value, hint, href }: TileProps) {
  return (
    <Card>
      <CardContent>
        <dt className="text-muted-foreground text-sm">
          {href ? (
            <Link href={href} className="hover:underline">
              {label}
            </Link>
          ) : (
            label
          )}
        </dt>
        <dd className="font-display text-3xl">{value}</dd>
        {hint ? <dd className="text-muted-foreground text-xs">{hint}</dd> : null}
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const name = useSessionStore((s) => s.user?.name ?? '');
  const dashboard = useAdminDashboard();
  const { data } = dashboard;

  return (
    <div className="grid gap-8">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Bonjour, {name}</h1>
        <p className="text-muted-foreground mt-1">Vue d’ensemble de la plateforme.</p>
      </header>

      {dashboard.isPending ? (
        <div className="grid gap-4" role="status" aria-label="Chargement">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      ) : dashboard.error ? (
        <ErrorState error={dashboard.error} onRetry={() => void dashboard.refetch()} />
      ) : data ? (
        <>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Tile
              label="Patients"
              value={data.users.patients}
              hint={`+${data.users.newPatientsLast30Days} sur 30 jours`}
            />
            <Tile
              label="Médecins actifs"
              value={data.catalog.activeDoctors}
              hint={`${data.catalog.inactiveDoctors} inactif${data.catalog.inactiveDoctors > 1 ? 's' : ''}`}
              href="/admin/doctors"
            />
            <Tile label="Cliniques" value={data.catalog.clinics} href="/admin/clinics" />
            <Tile label="Spécialités" value={data.catalog.specialties} href="/admin/specialties" />
          </dl>

          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Tile label="Rendez-vous aujourd’hui" value={data.appointments.today} />
            <Tile label="7 prochains jours" value={data.appointments.next7Days} />
            <Tile label="Réservés" value={data.appointments.byStatus.BOOKED} />
            <Tile
              label="Annulés"
              value={data.appointments.byStatus.CANCELLED}
              hint={`${data.appointments.byStatus.COMPLETED} terminé${data.appointments.byStatus.COMPLETED > 1 ? 's' : ''}`}
            />
          </dl>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Rendez-vous par jour (30 derniers jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DailyChart days={data.dailyBookings} label="Rendez-vous par jour sur 30 jours" />
            </CardContent>
          </Card>

          {data.topDoctors.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl">Médecins les plus sollicités</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="grid gap-4">
                  {data.topDoctors.map((doctor) => {
                    const max = Math.max(1, ...data.topDoctors.map((d) => d.appointments));
                    return (
                      <li key={doctor.doctorId} className="grid gap-1.5">
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="font-medium">
                            {doctor.name}
                            <span className="text-muted-foreground ml-2 text-sm font-normal">
                              {doctor.specialty}
                            </span>
                          </span>
                          <span className="tabular-nums">{doctor.appointments}</span>
                        </div>
                        <div className="bg-muted h-1.5 rounded-full" aria-hidden>
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${(doctor.appointments / max) * 100}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
