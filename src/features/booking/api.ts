import { api, apiRequest } from '@/lib/api/client';
import { publicApi } from '@/lib/api/http';
import { parseList } from '@/lib/api/list';
import { parseData } from '@/lib/api/parse';
import {
  appointmentSchema,
  patientDashboardSchema,
  slotsResponseSchema,
  type AppointmentStatus,
} from '@/lib/api/schemas/appointments';

export async function fetchSlots(doctorId: string, from: string, to: string) {
  const { data } = await publicApi.get(`/doctors/${encodeURIComponent(doctorId)}/slots`, {
    params: { from, to },
  });
  return parseData(data, slotsResponseSchema);
}

export function bookAppointment(input: { doctorId: string; startTime: string }) {
  return apiRequest({ method: 'POST', url: '/appointments', data: input }, appointmentSchema);
}

export function cancelAppointment({ id, reason }: { id: string; reason?: string }) {
  return apiRequest(
    {
      method: 'POST',
      url: `/appointments/${encodeURIComponent(id)}/cancel`,
      data: reason ? { reason } : {},
    },
    appointmentSchema,
  );
}

export interface AppointmentQuery {
  page: number;
  pageSize?: number;
  status?: AppointmentStatus;
  from?: string; // ISO instant
  to?: string;
}

export async function fetchAppointments(query: AppointmentQuery) {
  const { data } = await api.get('/appointments', {
    params: {
      page: query.page,
      pageSize: query.pageSize ?? 10,
      status: query.status,
      from: query.from,
      to: query.to,
    },
  });
  return parseList(data, appointmentSchema);
}

export function fetchPatientDashboard() {
  return apiRequest({ method: 'GET', url: '/dashboard/patient' }, patientDashboardSchema);
}
