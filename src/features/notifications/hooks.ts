'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { errorMessage } from '@/lib/api/errors';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationQuery,
} from './api';

export function useNotifications(query: NotificationQuery, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['notifications', 'list', query],
    queryFn: () => fetchNotifications(query),
    enabled: options.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: fetchUnreadCount,
    staleTime: 30_000,
    refetchInterval: 120_000, // safety net if the socket is down
  });
}

function useRefreshNotifications() {
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries({ queryKey: ['notifications'] });
}

export function useMarkRead() {
  const refresh = useRefreshNotifications();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: refresh,
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function useMarkAllRead() {
  const refresh = useRefreshNotifications();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: refresh,
    onError: (error) => toast.error(errorMessage(error)),
  });
}
