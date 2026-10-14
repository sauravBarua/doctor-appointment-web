'use client';

import { revalidateLogic, useForm } from '@tanstack/react-form';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { FieldError } from '@/components/field-error';
import { PasswordInput } from '@/components/password-input';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { errorMessage, toApiError } from '@/lib/api/errors';
import { safeNext } from '@/lib/safe-next';
import { useSessionStore } from '@/stores/session';
import { useLogin } from './hooks';

const loginSchema = z.object({
  email: z.email('Adresse e-mail invalide'),
  password: z.string().min(1, 'Le mot de passe est obligatoire'),
});

function loginErrorMessage(error: unknown): string {
  const apiError = toApiError(error);
  if (apiError.status === 401) return 'E-mail ou mot de passe incorrect.';
  return errorMessage(apiError);
}

export function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const status = useSessionStore((s) => s.status);
  const login = useLogin();

  // Already signed in (or just signed in): go where we were headed.
  useEffect(() => {
    if (status === 'authenticated') router.replace(next);
  }, [status, next, router]);

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: loginSchema },
    onSubmit: async ({ value }) => {
      try {
        await login.mutateAsync({ email: value.email.trim(), password: value.password });
        toast.success('Connexion réussie');
        router.replace(next);
      } catch {
        // The error is rendered from `login.error` below.
      }
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-2xl">Connexion</CardTitle>
        <CardDescription>Accédez à vos rendez-vous.</CardDescription>
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
          {login.error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{loginErrorMessage(login.error)}</AlertDescription>
            </Alert>
          ) : null}

          <form.Field name="email">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby="email-error"
                />
                <FieldError id="email-error" errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby="password-error"
                />
                <FieldError id="password-error" errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>

          <Button type="submit" disabled={login.isPending}>
            {login.isPending ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-muted-foreground justify-center gap-1 text-sm">
        Pas encore de compte ?
        <Link href="/register" className="text-primary font-medium hover:underline">
          Créer un compte
        </Link>
      </CardFooter>
    </Card>
  );
}
