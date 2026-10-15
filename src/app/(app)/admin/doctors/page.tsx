import type { Metadata } from 'next';
import { AdminPageShell } from '@/features/admin/page-shell';
import { DoctorsAdmin } from '@/features/admin/doctors-admin';

export const metadata: Metadata = { title: 'Médecins' };

export default function AdminDoctorsPage() {
  return (
    <AdminPageShell
      title="Médecins"
      description="Créez les comptes médecins et gérez leur visibilité."
    >
      <DoctorsAdmin />
    </AdminPageShell>
  );
}
