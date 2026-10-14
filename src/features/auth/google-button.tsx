import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/lib/env';

export function GoogleButton({ mode }: { mode: 'signin' | 'signup' }) {
  const href = `${API_BASE_URL}/auth/${mode === 'signin' ? 'google' : 'google/signup'}`;
  return (
    <>
      <div className="text-muted-foreground flex items-center gap-3 text-xs" aria-hidden>
        <span className="bg-border h-px flex-1" />
        ou
        <span className="bg-border h-px flex-1" />
      </div>
      <Button asChild variant="outline" className="w-full">
        <a href={href}>{mode === 'signin' ? 'Continuer avec Google' : 'S’inscrire avec Google'}</a>
      </Button>
    </>
  );
}
