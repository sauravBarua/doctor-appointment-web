'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTimeOff,
  deleteRule,
  deleteTimeOff,
  fetchAvailability,
  fetchDoctorDashboard,
  fetchTimeOff,
  saveRule,
} from './api';

function useRefresh() {
  const queryClient = useQueryClient();
  // Availability and time off change the doctor's slots and dashboard counters.
  return () => {
    for (const key of ['doctor', 'dashboard', 'slots']) {
      void queryClient.invalidateQueries({ queryKey: [key] });
    }
  };
}

export const useAvailability = () =>
  useQuery({ queryKey: ['doctor', 'availability'], queryFn: fetchAvailability });

export function useSaveRule() {
  return useMutation({ mutationFn: saveRule, onSuccess: useRefresh() });
}

export function useDeleteRule() {
  return useMutation({ mutationFn: deleteRule, onSuccess: useRefresh() });
}

export function useTimeOff(page: number) {
  return useQuery({
    queryKey: ['doctor', 'time-off', { page }],
    queryFn: () => fetchTimeOff(page),
    placeholderData: keepPreviousData,
  });
}

export function useCreateTimeOff() {
  return useMutation({ mutationFn: createTimeOff, onSuccess: useRefresh() });
}

export function useDeleteTimeOff() {
  return useMutation({ mutationFn: deleteTimeOff, onSuccess: useRefresh() });
}

export const useDoctorDashboard = () =>
  useQuery({ queryKey: ['dashboard', 'doctor'], queryFn: fetchDoctorDashboard });
