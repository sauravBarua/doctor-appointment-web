import type { Metadata } from 'next';
import { DashboardHome } from '@/features/dashboard/dashboard-home';

export const metadata: Metadata = { title: 'Tableau de bord' };

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <DashboardHome />
    </div>
  );
}
