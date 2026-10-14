'use client';

import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toApiError } from '@/lib/api/errors';
import { googleExchangeRequest } from '@/lib/api/session-client';
import { AUTH_HOME } from '@/lib/safe-next';
import { useSessionStore } from '@/stores/session';

export function GoogleCallback() {
  const router = useRouter();
  const code = useSearchParams().get('code');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const fail = (errorCode: string) =>
      router.replace(`/auth/error?code=${encodeURIComponent(errorCode)}`);
    if (!code) return fail('INVALID_GOOGLE_CODE');

    googleExchangeRequest(code)
      .then((payload) => {
        useSessionStore.getState().setSession(payload);
        router.replace(AUTH_HOME);
      })
      .catch((error: unknown) => fail(toApiError(error).code));
  }, [code, router]);

  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <Loader2 className="text-muted-foreground size-6 animate-spin" aria-hidden />
      <p className="text-muted-foreground text-sm">Connexion avec Google…</p>
    </div>
  );
}
