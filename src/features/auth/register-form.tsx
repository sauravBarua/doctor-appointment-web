'use client';

import { revalidateLogic, useForm } from '@tanstack/react-form';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { TextField } from '@/components/text-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { errorMessage } from '@/lib/api/errors';
import { useRegister } from './hooks';
import { GoogleButton } from './google-button';
import { newPasswordSchema } from './password-rules';

const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Au moins 2 caractères').max(80, '80 caractères maximum'),
    email: z.email('Adresse e-mail invalide'),
    password: newPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirmez le mot de passe'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export function RegisterForm() {
  const router = useRouter();
  const register = useRegister();

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: registerSchema },
    onSubmit: async ({ value }) => {
      const email = value.email.trim();
      try {
        await register.mutateAsync({ name: value.name.trim(), email, password: value.password });
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } catch {
        // Rendered from `register.error` below.
      }
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-2xl">Créer un compte</CardTitle>
        <CardDescription>Réservez vos rendez-vous en quelques clics.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form
          noValidate
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          {register.error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{errorMessage(register.error)}</AlertDescription>
            </Alert>
          ) : null}

          <form.Field name="name">
            {(field) => <TextField field={field} label="Nom complet" autoComplete="name" />}
          </form.Field>
          <form.Field name="email">
            {(field) => (
              <TextField
                field={field}
                label="Adresse e-mail"
                type="email"
                autoComplete="email"
                inputMode="email"
              />
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <TextField
                field={field}
                label="Mot de passe"
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
                label="Confirmer le mot de passe"
                password
                autoComplete="new-password"
              />
            )}
          </form.Field>

          <Button type="submit" disabled={register.isPending}>
            {register.isPending ? 'Création…' : 'Créer mon compte'}
          </Button>
        </form>
        <GoogleButton mode="signup" />
      </CardContent>
      <CardFooter className="text-muted-foreground justify-center gap-1 text-sm">
        Déjà un compte ?
        <Link href="/login" className="text-primary font-medium hover:underline">
          Se connecter
        </Link>
      </CardFooter>
    </Card>
  );
}
