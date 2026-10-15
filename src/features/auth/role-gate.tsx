'use client';

import Link from 'next/link';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { useSessionStore, type Role } from '@/stores/session';

// UI convenience only: the API enforces roles on every route.
export function RoleGate({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const role = useSessionStore((s) => s.user?.role);
  if (!role || !roles.includes(role)) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <EmptyState
          title="Accès réservé"
          description="Cette section n’est pas disponible pour votre compte."
        >
          <Button asChild>
            <Link href="/dashboard">Retour au tableau de bord</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }
  return <>{children}</>;
}
