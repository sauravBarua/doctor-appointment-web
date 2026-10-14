import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { parseFilters } from '@/features/catalog/filters';
import { specialtiesQuery } from '@/features/catalog/queries';
import { SpecialtiesExplorer } from '@/features/catalog/specialties-explorer';
import { getQueryClient } from '@/lib/query-client';

export const metadata: Metadata = {
  title: 'Spécialités',
  description: 'Parcourez les spécialités médicales disponibles.',
};
export const dynamic = 'force-dynamic';

export default async function SpecialtiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(specialtiesQuery(parseFilters(await searchParams)));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl tracking-tight">Spécialités</h1>
      <p className="text-muted-foreground mt-2 mb-8">
        Choisissez une spécialité pour voir les médecins.
      </p>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <SpecialtiesExplorer />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
