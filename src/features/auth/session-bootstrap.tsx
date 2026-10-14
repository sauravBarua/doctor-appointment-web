'use client';

import { useEffect } from 'react';
import { refreshSession } from '@/lib/api/session-client';
import { useSessionStore } from '@/stores/session';

let started = false;

function hasSessionFlag() {
  return document.cookie.split('; ').includes('hs=1');
}

// Runs once per page load: restores the session from the httpOnly cookie, or marks the
// visitor anonymous without any network call when there is no cookie.
export function SessionBootstrap() {
  useEffect(() => {
    if (started) return;
    started = true;
    if (!hasSessionFlag()) {
      useSessionStore.getState().clear();
      return;
    }
    refreshSession().catch(() => useSessionStore.getState().clear());
  }, []);
  return null;
}
