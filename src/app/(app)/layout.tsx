import { AppHeader } from '@/components/app-header';
import { AppGate } from '@/features/auth/app-gate';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppGate>
      <div className="flex min-h-dvh flex-col">
        <AppHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      </div>
    </AppGate>
  );
}
