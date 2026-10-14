'use client';

import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSessionStore } from '@/stores/session';

const CHANGE_PASSWORD = '/change-password';

export function AppGate({ children }: { children: React.ReactNode }) {
  const status = useSessionStore((s) => s.status);
  const mustChange = useSessionStore((s) => s.user?.mustChangePassword ?? false);
  const router = useRouter();
  const pathname = usePathname();
  const detour = status === 'authenticated' && mustChange && pathname !== CHANGE_PASSWORD;

  useEffect(() => {
    if (status === 'anonymous') router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (detour) router.replace(CHANGE_PASSWORD);
  }, [status, detour, pathname, router]);

  if (status !== 'authenticated' || detour) {
    return (
      <div className="flex min-h-dvh items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="text-muted-foreground size-6 animate-spin" aria-hidden />
        <span className="sr-only">Chargement…</span>
      </div>
    );
  }
  return <>{children}</>;
}
