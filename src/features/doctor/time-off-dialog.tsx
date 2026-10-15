'use client';

import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FieldError } from '@/components/field-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { errorMessage } from '@/lib/api/errors';
import { todayIn } from '@/lib/dates';
import { useCreateTimeOff } from './hooks';
import { validateTimeOff, type TimeOffErrors, type TimeOffForm } from './time-off-form';

const EMPTY: TimeOffForm = {
  startDate: '',
  startTime: '09:00',
  endDate: '',
  endTime: '18:00',
  reason: '',
};

export function TimeOffDialog({
  open,
  timeZone,
  onClose,
}: {
  open: boolean;
  timeZone: string;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <DialogContent>
        {open ? <TimeOffFormBody timeZone={timeZone} onClose={onClose} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function TimeOffFormBody({ timeZone, onClose }: { timeZone: string; onClose: () => void }) {
  const create = useCreateTimeOff();
  const [form, setForm] = useState<TimeOffForm>(EMPTY);
  const [errors, setErrors] = useState<TimeOffErrors>({});
  const [today] = useState(() => todayIn(timeZone));

  const set = (key: keyof TimeOffForm) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const result = validateTimeOff(form, timeZone);
    setErrors(result.errors);
    if (!result.startTime || !result.endTime) return;
    try {
      await create.mutateAsync({
        startTime: result.startTime,
        endTime: result.endTime,
        reason: form.reason.trim() || undefined,
      });
      toast.success('Congé ajouté');
      onClose();
    } catch {
      // Rendered from `create.error` below.
    }
  }

  const field = (id: keyof TimeOffForm, label: string, type: string, extra?: { min?: string }) => (
    <div className="grid gap-2">
      <Label htmlFor={`off-${id}`}>{label}</Label>
      <Input
        id={`off-${id}`}
        type={type}
        value={form[id]}
        onChange={set(id)}
        aria-invalid={Boolean(errors[id])}
        aria-describedby={`off-${id}-error`}
        {...extra}
      />
      <FieldError id={`off-${id}-error`} errors={errors[id] ? [errors[id]] : []} />
    </div>
  );

  return (
    <form noValidate onSubmit={(event) => void submit(event)} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Ajouter un congé</DialogTitle>
        <DialogDescription>
          Aucun créneau ne sera proposé pendant cette période. Heure locale : {timeZone}.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        {field('startDate', 'Début (date)', 'date', { min: today })}
        {field('startTime', 'Début (heure)', 'time')}
        {field('endDate', 'Fin (date)', 'date', { min: today })}
        {field('endTime', 'Fin (heure)', 'time')}
      </div>
      {field('reason', 'Motif (facultatif)', 'text')}

      {create.error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{errorMessage(create.error)}</AlertDescription>
        </Alert>
      ) : null}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? 'Enregistrement…' : 'Ajouter'}
        </Button>
      </DialogFooter>
    </form>
  );
}
