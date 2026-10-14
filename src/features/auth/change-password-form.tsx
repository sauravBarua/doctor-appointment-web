'use client';

import { revalidateLogic, useForm } from '@tanstack/react-form';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { TextField } from '@/components/text-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { errorMessage } from '@/lib/api/errors';
import { AUTH_HOME } from '@/lib/safe-next';
import { useSessionStore } from '@/stores/session';
import { useChangePassword } from './hooks';
import { newPasswordSchema } from './password-rules';

const changeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Saisissez votre mot de passe actuel'),
    newPassword: newPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirmez le nouveau mot de passe'),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    message: 'Le nouveau mot de passe doit être différent de l’actuel',
    path: ['newPassword'],
  });

export function ChangePasswordForm() {
  const router = useRouter();
  const forced = useSessionStore((s) => s.user?.mustChangePassword ?? false);
  const change = useChangePassword();

  const form = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: changeSchema },
    onSubmit: async ({ value }) => {
      try {
        await change.mutateAsync({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        });
        toast.success('Mot de passe modifié');
        router.replace(AUTH_HOME);
      } catch {
        // Rendered from `change.error` below.
      }
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Changer le mot de passe</CardTitle>
        <CardDescription>
          Choisissez un mot de passe que vous êtes seul à connaître.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          {forced ? (
            <Alert>
              <ShieldAlert />
              <AlertDescription>
                Votre mot de passe est temporaire. Remplacez-le pour accéder à votre espace.
              </AlertDescription>
            </Alert>
          ) : null}
          {change.error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{errorMessage(change.error)}</AlertDescription>
            </Alert>
          ) : null}

          <form.Field name="currentPassword">
            {(field) => (
              <TextField
                field={field}
                label="Mot de passe actuel"
                password
                autoComplete="current-password"
              />
            )}
          </form.Field>
          <form.Field name="newPassword">
            {(field) => (
              <TextField
                field={field}
                label="Nouveau mot de passe"
                password
                autoComplete="new-password"
                hint="8 caractères minimum, avec au moins une lettre et un chiffre."
              />
            )}
          </form.Field>
          <form.Field name="confirmPassword">
            {(field) => (
              <TextField
                field={field}
                label="Confirmer le nouveau mot de passe"
                password
                autoComplete="new-password"
              />
            )}
          </form.Field>

          <Button type="submit" disabled={change.isPending}>
            {change.isPending ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
