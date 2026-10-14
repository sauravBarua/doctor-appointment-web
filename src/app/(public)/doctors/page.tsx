import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DoctorsExplorer } from '@/features/catalog/doctors-explorer';
import { parseFilters } from '@/features/catalog/filters';
import {
  clinicOptionsQuery,
  doctorsQuery,
  specialtyOptionsQuery,
} from '@/features/catalog/queries';
import { getQueryClient } from '@/lib/query-client';

export const metadata: Metadata = {
  title: 'Médecins',
  description:
    'Recherchez un médecin par nom, spécialité ou clinique et prenez rendez-vous en ligne.',
};
export const dynamic = 'force-dynamic'; // data comes from the API at request time, never at build time

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(doctorsQuery(filters)),
    queryClient.prefetchQuery(specialtyOptionsQuery),
    queryClient.prefetchQuery(clinicOptionsQuery),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl tracking-tight">Trouver un médecin</h1>
      <p className="text-muted-foreground mt-2 mb-8">Filtrez par spécialité ou par clinique.</p>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <DoctorsExplorer />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
