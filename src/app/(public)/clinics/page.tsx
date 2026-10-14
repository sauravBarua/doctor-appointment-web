import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ClinicsExplorer } from '@/features/catalog/clinics-explorer';
import { parseFilters } from '@/features/catalog/filters';
import { clinicsQuery } from '@/features/catalog/queries';
import { getQueryClient } from '@/lib/query-client';

export const metadata: Metadata = {
  title: 'Cliniques',
  description: 'Trouvez une clinique près de chez vous.',
};
export const dynamic = 'force-dynamic';

export default async function ClinicsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(clinicsQuery(parseFilters(await searchParams)));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl tracking-tight">Cliniques</h1>
      <p className="text-muted-foreground mt-2 mb-8">
        Choisissez une clinique pour voir ses médecins.
      </p>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <ClinicsExplorer />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
