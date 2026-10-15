import type { Metadata } from 'next';
import { AdminPageShell } from '@/features/admin/page-shell';
import { SpecialtiesAdmin } from '@/features/admin/specialties-admin';

export const metadata: Metadata = { title: 'Spécialités' };

export default function AdminSpecialtiesPage() {
  return (
    <AdminPageShell title="Spécialités" description="Le catalogue affiché aux patients.">
      <SpecialtiesAdmin />
    </AdminPageShell>
  );
}
