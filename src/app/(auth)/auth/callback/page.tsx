import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GoogleCallback } from '@/features/auth/google-callback';

export const metadata: Metadata = { title: 'Connexion avec Google', robots: { index: false } };

export default function GoogleCallbackPage() {
  return (
    <Suspense>
      <GoogleCallback />
    </Suspense>
  );
}
