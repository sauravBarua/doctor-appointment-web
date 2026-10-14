import { api } from '@/lib/api/client';
import { parseList } from '@/lib/api/list';
import { parseData } from '@/lib/api/parse';
import { clinicSchema, doctorSchema, specialtySchema } from '@/lib/api/schemas/catalog';
import { PAGE_SIZE } from './filters';

export interface ListParams {
  page: number;
  pageSize?: number;
  q?: string;
}

export interface DoctorQuery {
  page: number;
  q?: string;
  specialtyId?: string;
  clinicId?: string;
}

export async function fetchDoctors(filters: DoctorQuery) {
  const { data } = await api.get('/doctors', {
    params: {
      page: filters.page,
      pageSize: PAGE_SIZE,
      q: filters.q,
      specialtyId: filters.specialtyId,
      clinicId: filters.clinicId,
    },
  });
  return parseList(data, doctorSchema);
}

export async function fetchDoctor(id: string) {
  const { data } = await api.get(`/doctors/${encodeURIComponent(id)}`);
  return parseData(data, doctorSchema);
}

export async function fetchSpecialties({ page, pageSize = PAGE_SIZE, q }: ListParams) {
  const { data } = await api.get('/specialties', { params: { page, pageSize, search: q } });
  return parseList(data, specialtySchema);
}

export async function fetchClinics({ page, pageSize = PAGE_SIZE, q }: ListParams) {
  const { data } = await api.get('/clinics', { params: { page, pageSize, search: q } });
  return parseList(data, clinicSchema);
}
