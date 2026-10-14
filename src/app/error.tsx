'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-3xl">Une erreur est survenue</h1>
      <p className="text-muted-foreground">
        Une erreur inattendue s’est produite. Vous pouvez réessayer.
      </p>
      {error.digest ? <p className="text-muted-foreground text-xs">Réf. : {error.digest}</p> : null}
      <Button onClick={reset}>Réessayer</Button>
    </div>
  );
}
