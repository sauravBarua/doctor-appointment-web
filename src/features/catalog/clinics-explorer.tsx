'use client';

import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/components/empty-state';
import { PagedGrid } from '@/components/paged-grid';
import { SearchBox } from '@/components/search-box';
import { ClinicCard } from './clinic-card';
import { parseFilters } from './filters';
import { clinicsQuery } from './queries';
import { useCatalogParams } from './use-catalog-params';

export function ClinicsExplorer() {
  const { searchParams, update } = useCatalogParams();
  const filters = parseFilters(searchParams);
  const clinics = useQuery(clinicsQuery(filters));

  return (
    <div className="grid gap-6">
      <div className="max-w-md">
        <SearchBox
          defaultValue={filters.q ?? ''}
          onSearch={(value) => update({ q: value || undefined })}
          label="Rechercher une clinique"
          placeholder="Rechercher une clinique"
        />
      </div>
      <PagedGrid
        query={clinics}
        getKey={(item) => item.id}
        render={(item) => <ClinicCard clinic={item} />}
        count={(total) => `${total} clinique${total > 1 ? 's' : ''}`}
        onPageChange={(page) => update({ page: page > 1 ? String(page) : undefined })}
        empty={
          <EmptyState
            title="Aucune clinique trouvée"
            description="Essayez un autre terme de recherche."
          />
        }
      />
    </div>
  );
}
