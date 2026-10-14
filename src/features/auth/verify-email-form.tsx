'use client';

import { revalidateLogic, useForm } from '@tanstack/react-form';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
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
import { errorMessage, toApiError } from '@/lib/api/errors';
import { useResendOtp, useVerifyEmail } from './hooks';

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'Saisissez les 6 chiffres du code'),
});
const RESEND_SECONDS = 60; // assumed to match the API's OTP cooldown

export function VerifyEmailForm() {
  const router = useRouter();
  const email = useSearchParams().get('email')?.trim() ?? '';
  const verify = useVerifyEmail();
  const resend = useResendOtp();
  // A code was just sent by register/login, so start with a cooldown.
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const form = useForm({
    defaultValues: { otp: '' },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: otpSchema },
    onSubmit: async ({ value }) => {
      try {
        await verify.mutateAsync({ email, otp: value.otp });
        toast.success('E-mail vérifié. Vous pouvez vous connecter.');
        router.replace('/login?verified=1');
      } catch {
        // Rendered from `verify.error` below.
      }
    },
  });

  async function onResend() {
    try {
      await resend.mutateAsync({ email });
      toast.success('Un nouveau code a été envoyé.');
    } catch (error) {
      if (toApiError(error).code !== 'OTP_COOLDOWN') return;
    }
    setCooldown(RESEND_SECONDS);
  }

  if (!email) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">Vérification de l’e-mail</CardTitle>
          <CardDescription>Adresse e-mail manquante.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild variant="outline">
            <Link href="/login">Retour à la connexion</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-2xl">Vérifiez votre e-mail</CardTitle>
        <CardDescription>
          Nous avons envoyé un code à 6 chiffres à{' '}
          <strong className="text-foreground">{email}</strong>.
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
          {verify.error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{errorMessage(verify.error)}</AlertDescription>
            </Alert>
          ) : null}
          {resend.error && toApiError(resend.error).code !== 'OTP_COOLDOWN' ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{errorMessage(resend.error)}</AlertDescription>
            </Alert>
          ) : null}

          <form.Field name="otp">
            {(field) => (
              <TextField
                field={field}
                label="Code de vérification"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                className="text-center text-lg tracking-[0.5em]"
                transform={(value) => value.replace(/\D/g, '')}
              />
            )}
          </form.Field>

          <Button type="submit" disabled={verify.isPending}>
            {verify.isPending ? 'Vérification…' : 'Vérifier'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-muted-foreground flex-col gap-2 text-sm">
        <Button
          type="button"
          variant="ghost"
          onClick={() => void onResend()}
          disabled={cooldown > 0 || resend.isPending}
        >
          {cooldown > 0 ? `Renvoyer le code (${cooldown} s)` : 'Renvoyer le code'}
        </Button>
        <Link href="/login" className="hover:underline">
          Retour à la connexion
        </Link>
      </CardFooter>
    </Card>
  );
}
