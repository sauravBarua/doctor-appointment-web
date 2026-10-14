'use client';

import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/components/empty-state';
import { PagedGrid } from '@/components/paged-grid';
import { SearchBox } from '@/components/search-box';
import { parseFilters } from './filters';
import { specialtiesQuery } from './queries';
import { SpecialtyCard } from './specialty-card';
import { useCatalogParams } from './use-catalog-params';

export function SpecialtiesExplorer() {
  const { searchParams, update } = useCatalogParams();
  const filters = parseFilters(searchParams);
  const specialties = useQuery(specialtiesQuery(filters));

  return (
    <div className="grid gap-6">
      <div className="max-w-md">
        <SearchBox
          defaultValue={filters.q ?? ''}
          onSearch={(value) => update({ q: value || undefined })}
          label="Rechercher une spécialité"
          placeholder="Rechercher une spécialité"
        />
      </div>
      <PagedGrid
        query={specialties}
        getKey={(item) => item.id}
        render={(item) => <SpecialtyCard specialty={item} />}
        count={(total) => `${total} spécialité${total > 1 ? 's' : ''}`}
        onPageChange={(page) => update({ page: page > 1 ? String(page) : undefined })}
        empty={
          <EmptyState
            title="Aucune spécialité trouvée"
            description="Essayez un autre terme de recherche."
          />
        }
      />
    </div>
  );
}
