'use client';

import { create } from 'zustand';

export type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  image: string | null;
}

type Status = 'loading' | 'authenticated' | 'anonymous';

interface SessionState {
  status: Status;
  accessToken: string | null;
  user: SessionUser | null;
  setSession: (payload: { accessToken: string; user: SessionUser }) => void;
  setAccessToken: (accessToken: string) => void;
  clear: () => void;
}

// Client-only. Never call setSession/clear during server rendering: the module instance
// is shared across requests on the server. Only effects and event handlers write to it.
export const useSessionStore = create<SessionState>()((set) => ({
  status: 'loading',
  accessToken: null,
  user: null,
  setSession: ({ accessToken, user }) => set({ status: 'authenticated', accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clear: () => set({ status: 'anonymous', accessToken: null, user: null }),
}));
