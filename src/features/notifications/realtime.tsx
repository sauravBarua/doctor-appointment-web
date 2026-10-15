'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { refreshSession } from '@/lib/api/session-client';
import { notificationSchema } from '@/lib/api/schemas/notifications';
import { API_ORIGIN } from '@/lib/env';
import { useSessionStore } from '@/stores/session';
import { notificationHref, notificationText } from './format';

const MAX_REAUTH_ATTEMPTS = 5;

// One socket per signed-in session. Renders nothing.
export function NotificationsRealtime() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const status = useSessionStore((s) => s.status);
  const role = useSessionStore((s) => s.user?.role);
  const blocked = useSessionStore((s) => s.user?.mustChangePassword ?? false);

  useEffect(() => {
    if (status !== 'authenticated' || blocked || !role) return;

    let stopped = false;
    let attempts = 0;
    const dev = process.env.NODE_ENV === 'development';

    const socket = io(API_ORIGIN, {
      // Called on every connection attempt, so a reconnect always sends the latest token.
      auth: (callback) => callback({ token: useSessionStore.getState().accessToken ?? '' }),
      transports: ['websocket'],
      reconnectionDelayMax: 10_000,
    });

    const refreshData = () => {
      for (const key of ['notifications', 'appointments', 'dashboard']) {
        void queryClient.invalidateQueries({ queryKey: [key] });
      }
    };

    // The server ends the connection after ~10 minutes (or rejects an expired token) and
    // Socket.IO does not retry those by itself: get a fresh access token, then reconnect.
    async function reauthenticate() {
      if (stopped || attempts >= MAX_REAUTH_ATTEMPTS) return;
      attempts += 1;
      try {
        await refreshSession();
      } catch {
        return; // the session is over: the app gate takes care of it
      }
      if (!stopped && !socket.connected) socket.connect();
    }

    socket.on('connect', () => {
      attempts = 0;
      refreshData(); // catch up on anything missed while disconnected
      if (dev) console.debug('[socket] connected');
    });
    socket.on('disconnect', (reason) => {
      if (dev) console.debug('[socket] disconnected:', reason);
      if (reason === 'io server disconnect') void reauthenticate();
    });
    socket.on('connect_error', (error) => {
      if (dev) console.debug('[socket] connect_error:', error.message);
      if (error.message === 'UNAUTHORIZED') void reauthenticate();
    });

    socket.onAny((event: string, payload: unknown) => {
      if (event === 'ready') return;
      if (dev) console.debug('[socket] event:', event, payload);
      refreshData();

      const parsed = notificationSchema.safeParse(payload);
      if (!parsed.success) return;
      const { title, description } = notificationText(parsed.data, role);
      const href = notificationHref(parsed.data, role);
      toast(title, {
        description,
        action: href ? { label: 'Voir', onClick: () => router.push(href) } : undefined,
      });
    });

    return () => {
      stopped = true;
      socket.offAny();
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [status, blocked, role, queryClient, router]);

  return null;
}
