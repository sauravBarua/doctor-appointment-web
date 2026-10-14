import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { fetchClinics, fetchDoctors, fetchSpecialties } from './api';
import { OPTIONS_PAGE_SIZE, type CatalogFilters } from './filters';

export const doctorsQuery = (filters: CatalogFilters) =>
  queryOptions({
    queryKey: ['doctors', 'list', filters],
    queryFn: () => fetchDoctors(filters),
    placeholderData: keepPreviousData,
  });

export const specialtiesQuery = ({ page, q }: CatalogFilters) =>
  queryOptions({
    queryKey: ['specialties', 'list', { page, q }],
    queryFn: () => fetchSpecialties({ page, q }),
    placeholderData: keepPreviousData,
  });

export const clinicsQuery = ({ page, q }: CatalogFilters) =>
  queryOptions({
    queryKey: ['clinics', 'list', { page, q }],
    queryFn: () => fetchClinics({ page, q }),
    placeholderData: keepPreviousData,
  });

// Full lists for the filter dropdowns.
export const specialtyOptionsQuery = queryOptions({
  queryKey: ['specialties', 'options'],
  queryFn: () => fetchSpecialties({ page: 1, pageSize: OPTIONS_PAGE_SIZE }),
  staleTime: 5 * 60_000,
});

export const clinicOptionsQuery = queryOptions({
  queryKey: ['clinics', 'options'],
  queryFn: () => fetchClinics({ page: 1, pageSize: OPTIONS_PAGE_SIZE }),
  staleTime: 5 * 60_000,
});
