'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ErrorState } from '@/components/error-state';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import type { AppNotification } from '@/lib/api/schemas/notifications';
import { useSessionStore } from '@/stores/session';
import { notificationHref } from './format';
import { useMarkAllRead, useMarkRead, useNotifications, useUnreadCount } from './hooks';
import { NotificationItem } from './notification-item';

export function NotificationBell() {
  const router = useRouter();
  const role = useSessionStore((s) => s.user?.role);
  const [open, setOpen] = useState(false);
  const unread = useUnreadCount();
  const latest = useNotifications({ page: 1, pageSize: 5 }, { enabled: open });
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const count = unread.data ?? 0;

  function activate(notification: AppNotification) {
    if (!notification.readAt) markRead.mutate(notification.id);
    setOpen(false);
    const href = notificationHref(notification, role);
    if (href) router.push(href);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            count > 0 ? `Notifications, ${count} non lue${count > 1 ? 's' : ''}` : 'Notifications'
          }
        >
          <Bell className="size-5" aria-hidden />
          {count > 0 ? (
            <span
              aria-hidden
              className="bg-destructive absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium text-white"
            >
              {count > 99 ? '99+' : count}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] max-w-[calc(100vw-1rem)] p-0">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <Button
            variant="ghost"
            size="sm"
            disabled={count === 0 || markAll.isPending}
            onClick={() => markAll.mutate()}
          >
            Tout marquer comme lu
          </Button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {latest.isPending ? (
            <div className="grid gap-2 p-4" role="status" aria-label="Chargement">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : latest.error && !latest.data ? (
            <div className="p-4">
              <ErrorState error={latest.error} onRetry={() => void latest.refetch()} />
            </div>
          ) : latest.data && latest.data.items.length > 0 ? (
            <ul className="divide-y">
              {latest.data.items.map((notification) => (
                <li key={notification.id}>
                  <NotificationItem notification={notification} role={role} onActivate={activate} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground p-6 text-center text-sm">Aucune notification.</p>
          )}
        </div>

        <div className="border-t px-4 py-2 text-center">
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="text-primary text-sm hover:underline"
          >
            Voir toutes les notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
