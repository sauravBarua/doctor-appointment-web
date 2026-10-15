'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { SessionBootstrap } from '@/features/auth/session-bootstrap';
import { NotificationsRealtime } from '@/features/notifications/realtime';
import { getQueryClient } from '@/lib/query-client';
import '@/lib/zod-locale';

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <SessionBootstrap />
        <NotificationsRealtime />
        {children}
        <Toaster richColors closeButton position="top-right" />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
