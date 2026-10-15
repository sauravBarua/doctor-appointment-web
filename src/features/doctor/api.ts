import { api, apiRequest } from '@/lib/api/client';
import { parseList } from '@/lib/api/list';
import {
  availabilitySchema,
  doctorDashboardSchema,
  timeOffSchema,
} from '@/lib/api/schemas/schedule';

export const fetchAvailability = () =>
  apiRequest({ method: 'GET', url: '/doctor/availability' }, availabilitySchema);

export interface RuleInput {
  id?: string;
  weekday: number;
  startMinute: number;
  endMinute: number;
}

// The write responses aren't needed: callers refetch the list.
export async function saveRule({ id, weekday, startMinute, endMinute }: RuleInput) {
  if (id)
    await api.patch(`/doctor/availability/${encodeURIComponent(id)}`, { startMinute, endMinute });
  else await api.post('/doctor/availability', { weekday, startMinute, endMinute });
}

export async function deleteRule(id: string) {
  await api.delete(`/doctor/availability/${encodeURIComponent(id)}`);
}

export async function fetchTimeOff(page: number) {
  const { data } = await api.get('/doctor/time-off', { params: { page, pageSize: 10 } });
  return parseList(data, timeOffSchema);
}

export async function createTimeOff(input: {
  startTime: string;
  endTime: string;
  reason?: string;
}) {
  await api.post('/doctor/time-off', input);
}

export async function deleteTimeOff(id: string) {
  await api.delete(`/doctor/time-off/${encodeURIComponent(id)}`);
}

export const fetchDoctorDashboard = () =>
  apiRequest({ method: 'GET', url: '/dashboard/doctor' }, doctorDashboardSchema);
