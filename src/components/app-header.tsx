'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SITE } from '@/config/site';
import { useLogout } from '@/features/auth/hooks';
import { ROLE_LABELS } from '@/features/auth/labels';
import { NotificationBell } from '@/features/notifications/notification-bell';
import { useSessionStore } from '@/stores/session';

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function AppHeader() {
  const user = useSessionStore((s) => s.user);
  const logout = useLogout();

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
        <Link href="/dashboard" className="font-display text-xl font-semibold tracking-tight">
          {SITE.name}
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {user && !user.mustChangePassword ? <NotificationBell /> : null}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2" aria-label="Menu du compte">
                  <span className="bg-accent text-accent-foreground flex size-8 items-center justify-center rounded-full text-xs font-medium">
                    {initials(user.name)}
                  </span>
                  <span className="hidden max-w-40 truncate text-sm sm:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="grid gap-1 font-normal">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                  <Badge variant="secondary" className="mt-1 w-fit">
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Tableau de bord</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Mon profil</Link>
                </DropdownMenuItem>
                {user.role === 'PATIENT' ? (
                  <DropdownMenuItem asChild>
                    <Link href="/appointments">Mes rendez-vous</Link>
                  </DropdownMenuItem>
                ) : null}
                {user.role === 'DOCTOR' ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/doctor/appointments">Rendez-vous</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/doctor/schedule">Disponibilités</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/doctor/time-off">Congés</Link>
                    </DropdownMenuItem>
                  </>
                ) : null}
                <DropdownMenuItem onSelect={() => logout.mutate()}>
                  <LogOut className="size-4" /> Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
}
