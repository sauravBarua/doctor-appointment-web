'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { errorMessage } from '@/lib/api/errors';
import {
  createDoctor,
  fetchAdminClinics,
  fetchAdminDashboard,
  fetchAdminDoctors,
  fetchAdminSpecialties,
  fetchAuditLogs,
  type AuditParams,
  type Crud,
  type ListParams,
  type NewDoctor,
} from './api';

function useRefresh() {
  const queryClient = useQueryClient();
  // The public catalog and dashboards change when admin data does.
  return () => {
    for (const key of ['admin', 'specialties', 'clinics', 'doctors', 'dashboard']) {
      void queryClient.invalidateQueries({ queryKey: [key] });
    }
  };
}

export const useAdminSpecialties = (params: ListParams) =>
  useQuery({
    queryKey: ['admin', 'specialties', params],
    queryFn: () => fetchAdminSpecialties(params),
    placeholderData: keepPreviousData,
  });

export const useAdminClinics = (params: ListParams) =>
  useQuery({
    queryKey: ['admin', 'clinics', params],
    queryFn: () => fetchAdminClinics(params),
    placeholderData: keepPreviousData,
  });

export const useAdminDoctors = (params: ListParams) =>
  useQuery({
    queryKey: ['admin', 'doctors', params],
    queryFn: () => fetchAdminDoctors(params),
    placeholderData: keepPreviousData,
  });

export const useAuditLogs = (params: AuditParams) =>
  useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: () => fetchAuditLogs(params),
    placeholderData: keepPreviousData,
  });

export const useAdminDashboard = () =>
  useQuery({ queryKey: ['dashboard', 'admin'], queryFn: fetchAdminDashboard });

// Active specialties and clinics for dropdowns.
export const useSpecialtyOptions = () =>
  useQuery({
    queryKey: ['admin', 'options', 'specialties'],
    queryFn: () => fetchAdminSpecialties({ page: 1, pageSize: 100, isActive: true }),
    select: (page) => page.items.map(({ id, name }) => ({ id, name })),
    staleTime: 60_000,
  });

export const useClinicOptions = () =>
  useQuery({
    queryKey: ['admin', 'options', 'clinics'],
    queryFn: () => fetchAdminClinics({ page: 1, pageSize: 100, isActive: true }),
    select: (page) => page.items.map(({ id, name }) => ({ id, name })),
    staleTime: 60_000,
  });

export interface SaveInput {
  id?: string;
  values: object;
  image?: File | null;
}

export function useSave(entity: Crud) {
  return useMutation({
    mutationFn: ({ id, values, image }: SaveInput) =>
      id ? entity.update(id, values, image) : entity.create(values, image),
    onSuccess: useRefresh(),
  });
}

export function useRemove(entity: Crud) {
  return useMutation({ mutationFn: (id: string) => entity.remove(id), onSuccess: useRefresh() });
}

export function useToggleActive(entity: Crud) {
  const mutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      entity.setActive(id, isActive),
    onSuccess: useRefresh(),
  });
  const toggle = (id: string, isActive: boolean) =>
    mutation.mutate(
      { id, isActive },
      {
        onSuccess: () => toast.success(isActive ? 'Activé' : 'Désactivé'),
        onError: (error) => toast.error(errorMessage(error)),
      },
    );
  return { toggle, isPending: mutation.isPending };
}

export function useCreateDoctor() {
  return useMutation({
    mutationFn: ({ values, image }: { values: NewDoctor; image: File | null }) =>
      createDoctor(values, image),
    onSuccess: useRefresh(),
  });
}
