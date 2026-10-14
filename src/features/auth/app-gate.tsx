'use client';

import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSessionStore } from '@/stores/session';

export function AppGate({ children }: { children: React.ReactNode }) {
  const status = useSessionStore((s) => s.status);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'anonymous') router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [status, pathname, router]);

  if (status !== 'authenticated') {
    return (
      <div className="flex min-h-dvh items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="text-muted-foreground size-6 animate-spin" aria-hidden />
        <span className="sr-only">Chargement…</span>
      </div>
    );
  }
  return <>{children}</>;
}
