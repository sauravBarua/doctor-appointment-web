import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyEmailForm } from '@/features/auth/verify-email-form';

export const metadata: Metadata = { title: 'Vérification de l’e-mail' };

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
