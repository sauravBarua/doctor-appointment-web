import type { Metadata } from 'next';
import { WelcomeCard } from '@/features/auth/welcome-card';

export const metadata: Metadata = { title: 'Tableau de bord' };

export default function DashboardPage() {
  return <WelcomeCard />;
}
