import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Appointment, AppointmentStatus } from '@/lib/api/schemas/appointments';
import { capitalize, dayOfMonth, formatDateLong, formatTime, monthShort } from '@/lib/dates';

const STATUS: Record<
  AppointmentStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  BOOKED: { label: 'Confirmé', variant: 'default' },
  COMPLETED: { label: 'Terminé', variant: 'secondary' },
  CANCELLED: { label: 'Annulé', variant: 'destructive' },
};

export function AppointmentCard({
  appointment,
  onCancel,
}: {
  appointment: Appointment;
  onCancel?: (appointment: Appointment) => void;
}) {
  const { doctor, timezone, startTime, endTime, status } = appointment;
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div
          aria-hidden
          className="bg-accent text-accent-foreground flex size-16 shrink-0 flex-col items-center justify-center rounded-lg"
        >
          <span className="text-xl leading-none font-semibold">
            {dayOfMonth(startTime, timezone)}
          </span>
          <span className="text-xs uppercase">{monthShort(startTime, timezone)}</span>
        </div>
        <div className="grid min-w-0 flex-1 gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg leading-tight">
              <Link href={`/doctors/${doctor.id}`} className="hover:underline">
                {doctor.name}
              </Link>
            </h3>
            <Badge variant={STATUS[status].variant}>{STATUS[status].label}</Badge>
          </div>
          <p className="text-muted-foreground text-sm">{doctor.specialty}</p>
          <p className="text-sm font-medium">
            {capitalize(formatDateLong(startTime, timezone))} · {formatTime(startTime, timezone)} –{' '}
            {formatTime(endTime, timezone)}
          </p>
          <p className="text-muted-foreground flex items-start gap-1.5 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
            {doctor.clinic.name}, {doctor.clinic.address}
          </p>
          {status === 'CANCELLED' && appointment.cancelReason ? (
            <p className="text-muted-foreground text-sm">Motif : {appointment.cancelReason}</p>
          ) : null}
        </div>
        {onCancel ? (
          <Button variant="outline" size="sm" onClick={() => onCancel(appointment)}>
            Annuler
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
