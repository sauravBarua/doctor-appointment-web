'use client';

import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { PaginationBar } from '@/components/pagination-bar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseFilters } from '@/features/catalog/filters';
import { useCatalogParams } from '@/features/catalog/use-catalog-params';
import type { AppNotification } from '@/lib/api/schemas/notifications';
import { useSessionStore } from '@/stores/session';
import { notificationHref } from './format';
import { useMarkAllRead, useMarkRead, useNotifications, useUnreadCount } from './hooks';
import { NotificationItem } from './notification-item';

const PAGE_SIZE = 20;

export function NotificationsList() {
  const router = useRouter();
  const role = useSessionStore((s) => s.user?.role);
  const { searchParams, update } = useCatalogParams();
  const unreadOnly = searchParams.get('filter') === 'unread';
  const { page } = parseFilters(searchParams);

  const list = useNotifications({ page, pageSize: PAGE_SIZE, unread: unreadOnly || undefined });
  const unread = useUnreadCount();
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const { data, isPending, error } = list;

  function activate(notification: AppNotification) {
    if (!notification.readAt) markRead.mutate(notification.id);
    const href = notificationHref(notification, role);
    if (href) router.push(href);
  }

  return (
    <Tabs
      value={unreadOnly ? 'unread' : 'all'}
      onValueChange={(value) => update({ filter: value === 'unread' ? 'unread' : undefined })}
      className="grid gap-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="unread">Non lues{unread.data ? ` (${unread.data})` : ''}</TabsTrigger>
        </TabsList>
        <Button
          variant="outline"
          size="sm"
          disabled={!unread.data || markAll.isPending}
          onClick={() => markAll.mutate()}
        >
          Tout marquer comme lu
        </Button>
      </div>

      <TabsContent value={unreadOnly ? 'unread' : 'all'} className="grid gap-4">
        {isPending ? (
          <div className="grid gap-3" role="status" aria-label="Chargement">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        ) : error && !data ? (
          <ErrorState error={error} onRetry={() => void list.refetch()} />
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            title={unreadOnly ? 'Aucune notification non lue' : 'Aucune notification'}
            description="Vous serez prévenu ici de vos rendez-vous."
          />
        ) : (
          <>
            <Card className="gap-0 overflow-hidden py-0">
              <ul className="divide-y">
                {data.items.map((notification) => (
                  <li key={notification.id}>
                    <NotificationItem
                      notification={notification}
                      role={role}
                      onActivate={activate}
                      onMarkRead={(item) => markRead.mutate(item.id)}
                    />
                  </li>
                ))}
              </ul>
            </Card>
            <PaginationBar
              page={data.meta.page}
              pageSize={data.meta.pageSize}
              total={data.meta.total}
              onPageChange={(next) => update({ page: next > 1 ? String(next) : undefined })}
            />
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}
