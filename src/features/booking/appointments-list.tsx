'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { PaginationBar } from '@/components/pagination-bar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseFilters } from '@/features/catalog/filters';
import { useCatalogParams } from '@/features/catalog/use-catalog-params';
import type { Appointment } from '@/lib/api/schemas/appointments';
import type { AppointmentQuery } from './api';
import { AppointmentCard } from './appointment-card';
import { CancelDialog } from './cancel-dialog';
import { useAppointments } from './hooks';

const TABS = {
  upcoming: { label: 'À venir', empty: 'Aucun rendez-vous à venir' },
  past: { label: 'Passés', empty: 'Aucun rendez-vous passé' },
  cancelled: { label: 'Annulés', empty: 'Aucun rendez-vous annulé' },
} as const;
type Tab = keyof typeof TABS;

const isTab = (value: string | null): value is Tab => value !== null && value in TABS;

export function AppointmentsList() {
  const { searchParams, update } = useCatalogParams();
  const raw = searchParams.get('tab');
  const tab: Tab = isTab(raw) ? raw : 'upcoming';
  const { page } = parseFilters(searchParams);
  // Fixed for the lifetime of the page so the query key stays stable.
  const [now] = useState(() => new Date().toISOString());
  const [toCancel, setToCancel] = useState<Appointment | null>(null);

  const filters: Record<Tab, AppointmentQuery> = {
    upcoming: { page, status: 'BOOKED', from: now },
    past: { page, to: now },
    cancelled: { page, status: 'CANCELLED' },
  };
  const appointments = useAppointments(tab, filters[tab]);
  const { data, isPending, error } = appointments;

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => update({ tab: value === 'upcoming' ? undefined : value })}
      className="grid gap-6"
    >
      <TabsList>
        {(Object.keys(TABS) as Tab[]).map((key) => (
          <TabsTrigger key={key} value={key}>
            {TABS[key].label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={tab} className="grid gap-4">
        {isPending ? (
          <div className="grid gap-4" role="status" aria-label="Chargement">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
        ) : error && !data ? (
          <ErrorState error={error} onRetry={() => void appointments.refetch()} />
        ) : !data || data.items.length === 0 ? (
          <EmptyState title={TABS[tab].empty} description="Vos rendez-vous apparaîtront ici.">
            {tab === 'upcoming' ? (
              <Button asChild>
                <Link href="/doctors">Trouver un médecin</Link>
              </Button>
            ) : null}
          </EmptyState>
        ) : (
          <>
            <p aria-live="polite" className="text-muted-foreground text-sm">
              {data.meta.total} rendez-vous
            </p>
            <ul className="grid gap-4">
              {data.items.map((appointment) => (
                <li key={appointment.id}>
                  <AppointmentCard
                    appointment={appointment}
                    onCancel={tab === 'upcoming' ? setToCancel : undefined}
                  />
                </li>
              ))}
            </ul>
            <PaginationBar
              page={data.meta.page}
              pageSize={data.meta.pageSize}
              total={data.meta.total}
              onPageChange={(next) => update({ page: next > 1 ? String(next) : undefined })}
            />
          </>
        )}
      </TabsContent>

      <CancelDialog appointment={toCancel} onClose={() => setToCancel(null)} />
    </Tabs>
  );
}
