import { Button } from '@/components/ui/button';
import type { AppNotification } from '@/lib/api/schemas/notifications';
import { relativeTime } from '@/lib/dates';
import { cn } from '@/lib/utils';
import type { Role } from '@/stores/session';
import { notificationText } from './format';

interface Props {
  notification: AppNotification;
  role?: Role;
  onActivate: (notification: AppNotification) => void;
  onMarkRead?: (notification: AppNotification) => void;
}

export function NotificationItem({ notification, role, onActivate, onMarkRead }: Props) {
  const { title, description } = notificationText(notification, role);
  const unread = notification.readAt === null;

  return (
    <div className="hover:bg-muted/50 flex items-start gap-2 px-4 py-3">
      <button
        type="button"
        onClick={() => onActivate(notification)}
        className="focus-visible:ring-ring/50 flex min-w-0 flex-1 items-start gap-3 rounded-md text-left outline-none focus-visible:ring-3"
      >
        <span
          aria-hidden
          className={cn(
            'mt-1.5 size-2 shrink-0 rounded-full',
            unread ? 'bg-primary' : 'bg-transparent',
          )}
        />
        <span className="grid min-w-0 gap-0.5">
          <span className={cn('text-sm', unread && 'font-semibold')}>
            {title}
            {unread ? <span className="sr-only"> (non lue)</span> : null}
          </span>
          <span className="text-muted-foreground text-sm">{description}</span>
          <time dateTime={notification.createdAt} className="text-muted-foreground text-xs">
            {relativeTime(notification.createdAt)}
          </time>
        </span>
      </button>
      {unread && onMarkRead ? (
        <Button variant="ghost" size="sm" onClick={() => onMarkRead(notification)}>
          Marquer comme lu
        </Button>
      ) : null}
    </div>
  );
}
