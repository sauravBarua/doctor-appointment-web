'use client';

import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { errorMessage } from '@/lib/api/errors';
import type { Appointment } from '@/lib/api/schemas/appointments';
import { capitalize, formatDateLong, formatTime } from '@/lib/dates';
import { useCancel } from './hooks';

export function CancelDialog({
  appointment,
  onClose,
}: {
  appointment: Appointment | null;
  onClose: () => void;
}) {
  const cancel = useCancel();
  const [reason, setReason] = useState('');

  function close() {
    setReason('');
    cancel.reset();
    onClose();
  }

  async function confirm() {
    if (!appointment) return;
    try {
      await cancel.mutateAsync({ id: appointment.id, reason: reason.trim() || undefined });
      toast.success('Rendez-vous annulé');
      close();
    } catch {
      // Rendered from `cancel.error` below.
    }
  }

  return (
    <AlertDialog open={appointment !== null} onOpenChange={(open) => (open ? undefined : close())}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Annuler ce rendez-vous ?</AlertDialogTitle>
          <AlertDialogDescription>
            {appointment
              ? `${appointment.doctor.name} · ${capitalize(formatDateLong(appointment.startTime, appointment.timezone))} à ${formatTime(appointment.startTime, appointment.timezone)}. `
              : ''}
            Le créneau sera libéré pour d’autres patients.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="cancel-reason">Motif (facultatif)</Label>
          <Textarea
            id="cancel-reason"
            maxLength={300}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>
        {cancel.error ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{errorMessage(cancel.error)}</AlertDescription>
          </Alert>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel>Garder le rendez-vous</AlertDialogCancel>
          <Button variant="destructive" disabled={cancel.isPending} onClick={() => void confirm()}>
            {cancel.isPending ? 'Annulation…' : 'Annuler le rendez-vous'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
