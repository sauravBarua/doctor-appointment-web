import { api } from '@/lib/api/client';
import { parseList } from '@/lib/api/list';
import { notificationSchema } from '@/lib/api/schemas/notifications';

export interface NotificationQuery {
  page: number;
  pageSize: number;
  unread?: boolean;
}

export async function fetchNotifications(query: NotificationQuery) {
  const { data } = await api.get('/notifications', {
    params: { page: query.page, pageSize: query.pageSize, unread: query.unread },
  });
  return parseList(data, notificationSchema);
}

// The unread badge reads `meta.total` of a one-item unread query. That shape is
// known, unlike the dedicated /unread-count payload.
export async function fetchUnreadCount() {
  return (await fetchNotifications({ page: 1, pageSize: 1, unread: true })).meta.total;
}

export async function markNotificationRead(id: string) {
  await api.patch(`/notifications/${encodeURIComponent(id)}/read`);
}

export async function markAllNotificationsRead() {
  await api.post('/notifications/read-all');
}
