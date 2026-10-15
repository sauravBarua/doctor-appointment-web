import type { z } from 'zod';
import { api, apiRequest } from '@/lib/api/client';
import { parseList } from '@/lib/api/list';
import {
  adminClinicSchema,
  adminDashboardSchema,
  adminDoctorSchema,
  adminSpecialtySchema,
  auditLogSchema,
  createDoctorResultSchema,
} from '@/lib/api/schemas/admin';
import { toFormData } from '@/lib/api/form-data';

export const ADMIN_PAGE_SIZE = 20;

export interface ListParams {
  page: number;
  pageSize?: number;
  search?: string;
  specialtyId?: string;
  clinicId?: string;
  isActive?: boolean;
}

async function list<T>(url: string, params: ListParams, schema: z.ZodType<T>) {
  const { data } = await api.get(url, { params: { pageSize: ADMIN_PAGE_SIZE, ...params } });
  return parseList(data, schema);
}

export const fetchAdminSpecialties = (p: ListParams) =>
  list('/admin/specialties', p, adminSpecialtySchema);
export const fetchAdminClinics = (p: ListParams) => list('/admin/clinics', p, adminClinicSchema);
export const fetchAdminDoctors = (p: ListParams) => list('/admin/doctors', p, adminDoctorSchema);

export interface AuditParams {
  page: number;
  from?: string;
  to?: string;
}
export async function fetchAuditLogs(params: AuditParams) {
  const { data } = await api.get('/admin/audit-logs', {
    params: { pageSize: ADMIN_PAGE_SIZE, ...params },
  });
  return parseList(data, auditLogSchema);
}

export const fetchAdminDashboard = () =>
  apiRequest({ method: 'GET', url: '/dashboard/admin' }, adminDashboardSchema);

// Write responses aren't needed: callers refetch the lists.
function crud(base: string) {
  const one = (id: string) => `${base}/${encodeURIComponent(id)}`;
  return {
    create: async (values: object, image?: File | null) => {
      await api.post(base, toFormData(values, image));
    },
    update: async (id: string, values: object, image?: File | null) => {
      await api.patch(one(id), toFormData(values, image));
    },
    setActive: async (id: string, isActive: boolean) => {
      await api.patch(one(id), { isActive });
    },
    remove: async (id: string) => {
      await api.delete(one(id));
    },
  };
}
export type Crud = ReturnType<typeof crud>;

export const specialties = crud('/admin/specialties');
export const clinics = crud('/admin/clinics');
export const doctors = crud('/admin/doctors');

export interface NewDoctor {
  name: string;
  email: string;
  clinicId: string;
  specialtyId: string;
  bio?: string;
}
export const createDoctor = (values: NewDoctor, image?: File | null) =>
  apiRequest(
    { method: 'POST', url: '/admin/doctors', data: toFormData(values, image) },
    createDoctorResultSchema,
  );
