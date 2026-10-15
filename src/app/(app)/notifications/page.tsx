import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NotificationsList } from '@/features/notifications/notifications-list';

export const metadata: Metadata = { title: 'Notifications' };

export default function NotificationsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="font-display mb-8 text-3xl tracking-tight">Notifications</h1>
      <Suspense>
        <NotificationsList />
      </Suspense>
    </div>
  );
}
