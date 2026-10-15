'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSessionStore } from '@/stores/session';
import { ProfileForm } from './profile-form';

const ROLES = { PATIENT: 'Patient', DOCTOR: 'Médecin', ADMIN: 'Administrateur' } as const;

export function ProfileScreen() {
  const user = useSessionStore((s) => s.user);
  if (!user) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl tracking-tight">Mon profil</h1>
        <Badge variant="secondary">{ROLES[user.role]}</Badge>
      </header>

      <Card>
        <CardContent>
          <ProfileForm key={user.id} user={user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">Sécurité</CardTitle>
          <CardDescription>Choisissez un nouveau mot de passe pour votre compte.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/change-password">Changer le mot de passe</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
