'use client';

import { create } from 'zustand';
import type { SessionUser } from '@/lib/api/schemas/auth';

export type { Role, SessionUser } from '@/lib/api/schemas/auth';

type Status = 'loading' | 'authenticated' | 'anonymous';

interface SessionState {
  status: Status;
  accessToken: string | null;
  user: SessionUser | null;
  setSession: (payload: { accessToken: string; user: SessionUser }) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: SessionUser) => void;
  clear: () => void;
}

// Client-only. Never write to it while rendering on the server: the module instance is
// shared across requests there. Only effects and event handlers call these setters.
export const useSessionStore = create<SessionState>()((set) => ({
  status: 'loading',
  accessToken: null,
  user: null,
  setSession: ({ accessToken, user }) => set({ status: 'authenticated', accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  clear: () => set({ status: 'anonymous', accessToken: null, user: null }),
}));
