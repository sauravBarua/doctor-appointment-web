'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bookAppointment,
  cancelAppointment,
  fetchAppointments,
  fetchPatientDashboard,
  fetchSlots,
  type AppointmentQuery,
} from './api';

export function useSlots(doctorId: string, from: string, to: string) {
  return useQuery({
    queryKey: ['slots', doctorId, from, to],
    queryFn: () => fetchSlots(doctorId, from, to),
    staleTime: 15_000,
  });
}

function useInvalidateBookings() {
  const queryClient = useQueryClient();
  return () => {
    for (const key of ['slots', 'appointments', 'dashboard']) {
      void queryClient.invalidateQueries({ queryKey: [key] });
    }
  };
}

export function useBook() {
  const invalidate = useInvalidateBookings();
  return useMutation({ mutationFn: bookAppointment, onSuccess: invalidate });
}

export function useCancel() {
  const invalidate = useInvalidateBookings();
  return useMutation({ mutationFn: cancelAppointment, onSuccess: invalidate });
}

export function useAppointments(key: string, query: AppointmentQuery) {
  return useQuery({
    queryKey: ['appointments', 'list', key, query],
    queryFn: () => fetchAppointments(query),
    placeholderData: keepPreviousData,
  });
}

export function usePatientDashboard() {
  return useQuery({ queryKey: ['dashboard', 'patient'], queryFn: fetchPatientDashboard });
}
