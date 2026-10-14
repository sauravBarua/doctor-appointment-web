'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { PagedGrid } from '@/components/paged-grid';
import { SearchBox } from '@/components/search-box';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DoctorCard } from './doctor-card';
import { parseFilters } from './filters';
import { clinicOptionsQuery, doctorsQuery, specialtyOptionsQuery } from './queries';
import { useCatalogParams } from './use-catalog-params';

const ALL = 'all';

export function DoctorsExplorer() {
  const { searchParams, update } = useCatalogParams();
  const filters = parseFilters(searchParams);
  const doctors = useQuery(doctorsQuery(filters));
  const specialties = useQuery(specialtyOptionsQuery);
  const clinics = useQuery(clinicOptionsQuery);
  const [resetCount, setResetCount] = useState(0);
  const hasFilters = Boolean(filters.q || filters.specialtyId || filters.clinicId);

  function reset() {
    update({ q: undefined, specialtyId: undefined, clinicId: undefined });
    setResetCount((count) => count + 1);
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_15rem_15rem_auto]">
        <SearchBox
          key={resetCount}
          defaultValue={filters.q ?? ''}
          onSearch={(value) => update({ q: value || undefined })}
          label="Rechercher un médecin"
          placeholder="Rechercher un médecin"
        />
        <Select
          value={filters.specialtyId ?? ALL}
          onValueChange={(value) => update({ specialtyId: value === ALL ? undefined : value })}
        >
          <SelectTrigger aria-label="Spécialité" className="w-full">
            <SelectValue placeholder="Toutes les spécialités" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Toutes les spécialités</SelectItem>
            {specialties.data?.items.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.clinicId ?? ALL}
          onValueChange={(value) => update({ clinicId: value === ALL ? undefined : value })}
        >
          <SelectTrigger aria-label="Clinique" className="w-full">
            <SelectValue placeholder="Toutes les cliniques" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Toutes les cliniques</SelectItem>
            {clinics.data?.items.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters ? (
          <Button variant="ghost" onClick={reset}>
            Réinitialiser
          </Button>
        ) : null}
      </div>

      <PagedGrid
        query={doctors}
        getKey={(doctor) => doctor.id}
        render={(doctor) => <DoctorCard doctor={doctor} />}
        count={(total) => `${total} médecin${total > 1 ? 's' : ''}`}
        onPageChange={(page) => update({ page: page > 1 ? String(page) : undefined })}
        empty={
          <EmptyState
            title="Aucun médecin trouvé"
            description="Modifiez votre recherche ou retirez des filtres."
          >
            {hasFilters ? (
              <Button variant="outline" onClick={reset}>
                Réinitialiser les filtres
              </Button>
            ) : null}
          </EmptyState>
        }
      />
    </div>
  );
}
