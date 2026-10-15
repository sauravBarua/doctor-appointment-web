'use client';

import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { errorMessage } from '@/lib/api/errors';
import type { Rule } from '@/lib/api/schemas/schedule';
import { useSaveRule } from './hooks';
import { formatMinute, MINUTE_OPTIONS, WEEKDAYS } from './minutes';

export interface RuleDialogState {
  weekday: number;
  rule?: Rule;
}

export function RuleDialog({
  state,
  onClose,
}: {
  state: RuleDialogState | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={state !== null} onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogContent>
        {state ? (
          <RuleForm
            key={state.rule?.id ?? `new-${state.weekday}`}
            state={state}
            onClose={onClose}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function RuleForm({ state, onClose }: { state: RuleDialogState; onClose: () => void }) {
  const save = useSaveRule();
  const [start, setStart] = useState(state.rule?.startMinute ?? 540);
  const [end, setEnd] = useState(state.rule?.endMinute ?? 720);
  const invalid = end <= start;
  const day = WEEKDAYS[state.weekday - 1];

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (invalid) return;
    try {
      await save.mutateAsync({
        id: state.rule?.id,
        weekday: state.weekday,
        startMinute: start,
        endMinute: end,
      });
      toast.success('Plage enregistrée');
      onClose();
    } catch {
      // Rendered from `save.error` below.
    }
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>
          {state.rule ? 'Modifier la plage' : 'Ajouter une plage'} · {day}
        </DialogTitle>
        <DialogDescription>
          Les créneaux sont générés automatiquement dans cette plage.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="rule-start">Début</Label>
          <Select value={String(start)} onValueChange={(value) => setStart(Number(value))}>
            <SelectTrigger id="rule-start" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MINUTE_OPTIONS.slice(0, -1).map((minute) => (
                <SelectItem key={minute} value={String(minute)}>
                  {formatMinute(minute)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rule-end">Fin</Label>
          <Select value={String(end)} onValueChange={(value) => setEnd(Number(value))}>
            <SelectTrigger id="rule-end" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MINUTE_OPTIONS.slice(1).map((minute) => (
                <SelectItem key={minute} value={String(minute)}>
                  {formatMinute(minute)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {invalid ? (
        <p role="alert" className="text-destructive text-sm">
          L’heure de fin doit être après l’heure de début.
        </p>
      ) : null}
      {save.error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{errorMessage(save.error)}</AlertDescription>
        </Alert>
      ) : null}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={invalid || save.isPending}>
          {save.isPending ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </DialogFooter>
    </form>
  );
}
