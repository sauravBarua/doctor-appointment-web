'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/stores/session';

export function HeaderActions() {
  const status = useSessionStore((s) => s.status);

  // Reserve the space while the session restores, so the buttons don't flip after load.
  if (status === 'loading') return <div className="h-9 w-28" aria-hidden />;

  if (status === 'authenticated') {
    return (
      <Button asChild>
        <Link href="/dashboard">Mon espace</Link>
      </Button>
    );
  }

  return (
    <>
      <Button asChild variant="ghost" className="hidden sm:inline-flex">
        <Link href="/login">Se connecter</Link>
      </Button>
      <Button asChild>
        <Link href="/register">Commencer</Link>
      </Button>
    </>
  );
}
