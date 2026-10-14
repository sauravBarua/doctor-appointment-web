import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { errorMessage } from '@/lib/api/errors';

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertTitle>Chargement impossible</AlertTitle>
      <AlertDescription className="grid gap-3">
        <span>{errorMessage(error)}</span>
        {onRetry ? (
          <Button size="sm" variant="outline" className="w-fit" onClick={onRetry}>
            Réessayer
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
