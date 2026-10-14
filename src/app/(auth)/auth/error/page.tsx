import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiError, errorMessage } from '@/lib/api/errors';

export const metadata: Metadata = { title: 'Connexion impossible', robots: { index: false } };

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const message = errorMessage(
    new ApiError(0, code ?? 'GOOGLE_AUTH_FAILED', ''),
    'La connexion avec Google a échoué. Réessayez.',
  );
  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Connexion impossible</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center gap-2">
        <Button asChild>
          <Link href="/login">Se connecter</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/register">Créer un compte</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
