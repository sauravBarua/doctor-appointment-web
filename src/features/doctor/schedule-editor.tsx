'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ErrorState } from '@/components/error-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Rule } from '@/lib/api/schemas/schedule';
import { useAvailability, useDeleteRule } from './hooks';
import { WEEKDAYS } from './minutes';
import { RuleDialog, type RuleDialogState } from './rule-dialog';

export function ScheduleEditor() {
  const availability = useAvailability();
  const remove = useDeleteRule();
  const [editing, setEditing] = useState<RuleDialogState | null>(null);
  const [deleting, setDeleting] = useState<Rule | null>(null);

  if (availability.isPending) {
    return (
      <div className="grid gap-3" role="status" aria-label="Chargement">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }
  if (availability.error) {
    return <ErrorState error={availability.error} onRetry={() => void availability.refetch()} />;
  }

  const { rules, timezone, slotDurationMinutes } = availability.data;

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      toast.success('Plage supprimée');
      setDeleting(null);
    } catch {
      // Rendered by the dialog.
    }
  }

  return (
    <div className="grid gap-6">
      <p className="text-muted-foreground text-sm">
        Plages hebdomadaires en heure locale ({timezone}). Les créneaux durent {slotDurationMinutes}{' '}
        minutes.
      </p>

      <ul className="grid gap-3">
        {WEEKDAYS.map((dayName, index) => {
          const weekday = index + 1;
          const dayRules = rules
            .filter((rule) => rule.weekday === weekday)
            .sort((a, b) => a.startMinute - b.startMinute);
          return (
            <li key={dayName}>
              <Card>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <h2 className="font-display w-28 shrink-0 text-lg">{dayName}</h2>
                  <ul className="flex flex-1 flex-wrap gap-2">
                    {dayRules.length === 0 ? (
                      <li className="text-muted-foreground text-sm">Indisponible</li>
                    ) : (
                      dayRules.map((rule) => (
                        <li key={rule.id} className="flex items-center rounded-md border pl-3">
                          <span className="text-sm tabular-nums">
                            {rule.start} – {rule.end}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Modifier la plage ${rule.start} – ${rule.end} du ${dayName.toLowerCase()}`}
                            onClick={() => setEditing({ weekday, rule })}
                          >
                            <Pencil className="size-4" aria-hidden />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Supprimer la plage ${rule.start} – ${rule.end} du ${dayName.toLowerCase()}`}
                            onClick={() => setDeleting(rule)}
                          >
                            <Trash2 className="size-4" aria-hidden />
                          </Button>
                        </li>
                      ))
                    )}
                  </ul>
                  <Button variant="outline" size="sm" onClick={() => setEditing({ weekday })}>
                    <Plus aria-hidden /> Ajouter
                  </Button>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

      <RuleDialog state={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={deleting !== null}
        title="Supprimer cette plage ?"
        description={
          deleting
            ? `${WEEKDAYS[deleting.weekday - 1]} · ${deleting.start} – ${deleting.end}. Ces créneaux ne seront plus proposés aux patients.`
            : ''
        }
        confirmLabel="Supprimer"
        pending={remove.isPending}
        error={remove.error}
        onConfirm={() => void confirmDelete()}
        onClose={() => {
          setDeleting(null);
          remove.reset();
        }}
      />
    </div>
  );
}
