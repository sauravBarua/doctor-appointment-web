'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/api/client';
import { errorMessage } from '@/lib/api/errors';
import { sessionUserSchema } from '@/lib/api/schemas/auth';
import { useSessionStore } from '@/stores/session';
import { ROLE_LABELS } from './labels';

export function WelcomeCard() {
  const user = useSessionStore((s) => s.user);

  const check = useMutation({
    mutationFn: () => apiRequest({ url: '/auth/me' }, sessionUserSchema),
    onSuccess: (me) => toast.success(`Session valide : ${me.email}`),
    onError: (error) => toast.error(errorMessage(error)),
  });

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-2xl">Bonjour, {user.name}</CardTitle>
        <CardDescription>
          Vous êtes connecté en tant que {ROLE_LABELS[user.role].toLowerCase()}. Les tableaux de
          bord arrivent dans les prochaines étapes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button onClick={() => check.mutate()} disabled={check.isPending}>
          Vérifier ma session
        </Button>
        {process.env.NODE_ENV !== 'production' ? (
          <Button
            variant="outline"
            onClick={() => useSessionStore.getState().setAccessToken('jeton-invalide')}
          >
            Invalider le jeton (test du rafraîchissement)
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
