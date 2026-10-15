import type { Metadata } from 'next';
import { AppHeader } from '@/components/app-header';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppGate } from '@/features/auth/app-gate';
import { AppSidebar } from '@/features/navigation/app-sidebar';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppGate>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex h-10 items-center border-b px-3">
              <SidebarTrigger />
            </div>
            <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AppGate>
  );
}
