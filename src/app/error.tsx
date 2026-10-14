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
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="text-muted-foreground">An unexpected error occurred. You can try again.</p>
      {error.digest ? <p className="text-muted-foreground text-xs">Ref: {error.digest}</p> : null}
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
