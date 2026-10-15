import type { Metadata } from 'next';
import { AdminPageShell } from '@/features/admin/page-shell';
import { ClinicsAdmin } from '@/features/admin/clinics-admin';

export const metadata: Metadata = { title: 'Cliniques' };

export default function AdminClinicsPage() {
  return (
    <AdminPageShell title="Cliniques" description="Lieux de consultation et leur fuseau horaire.">
      <ClinicsAdmin />
    </AdminPageShell>
  );
}
