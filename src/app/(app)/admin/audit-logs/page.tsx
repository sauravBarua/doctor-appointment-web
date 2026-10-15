import type { Metadata } from 'next';
import { AdminPageShell } from '@/features/admin/page-shell';
import { AuditLogs } from '@/features/admin/audit-logs';

export const metadata: Metadata = { title: 'Journal d’audit' };

export default function AdminAuditLogsPage() {
  return (
    <AdminPageShell title="Journal d’audit" description="Qui a fait quoi, et quand.">
      <AuditLogs />
    </AdminPageShell>
  );
}
