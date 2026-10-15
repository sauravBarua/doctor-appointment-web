'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { PaginationBar } from '@/components/pagination-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { parseFilters } from '@/features/catalog/filters';
import { useCatalogParams } from '@/features/catalog/use-catalog-params';
import type { TimeOff } from '@/lib/api/schemas/schedule';
import { SITE } from '@/config/site';
import { formatPeriod } from '@/lib/dates';
import { useAvailability, useDeleteTimeOff, useTimeOff } from './hooks';
import { TimeOffDialog } from './time-off-dialog';

export function TimeOffManager() {
  const { searchParams, update } = useCatalogParams();
  const { page } = parseFilters(searchParams);
  const list = useTimeOff(page);
  const availability = useAvailability();
  const remove = useDeleteTimeOff();
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<TimeOff | null>(null);
  const timeZone = availability.data?.timezone ?? SITE.timezone;
  const { data, isPending, error } = list;

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      toast.success('Congé supprimé');
      setDeleting(null);
    } catch {
      // Rendered by the dialog.
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          Périodes pendant lesquelles aucun créneau n’est proposé.
        </p>
        <Button onClick={() => setAdding(true)}>
          <Plus aria-hidden /> Ajouter un congé
        </Button>
      </div>

      {isPending ? (
        <div className="grid gap-3" role="status" aria-label="Chargement">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      ) : error && !data ? (
        <ErrorState error={error} onRetry={() => void list.refetch()} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="Aucun congé"
          description="Ajoutez une période d’absence pour bloquer les réservations."
        />
      ) : (
        <>
          <ul className="grid gap-3">
            {data.items.map((item) => (
              <li key={item.id}>
                <Card>
                  <CardContent className="flex items-center justify-between gap-4">
                    <div className="grid gap-1">
                      <p className="font-medium">
                        {formatPeriod(item.startTime, item.endTime, timeZone)}
                      </p>
                      {item.reason ? (
                        <p className="text-muted-foreground text-sm">Motif : {item.reason}</p>
                      ) : null}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Supprimer le congé : ${formatPeriod(item.startTime, item.endTime, timeZone)}`}
                      onClick={() => setDeleting(item)}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
          <PaginationBar
            page={data.meta.page}
            pageSize={data.meta.pageSize}
            total={data.meta.total}
            onPageChange={(next) => update({ page: next > 1 ? String(next) : undefined })}
          />
        </>
      )}

      <TimeOffDialog open={adding} timeZone={timeZone} onClose={() => setAdding(false)} />
      <ConfirmDialog
        open={deleting !== null}
        title="Supprimer ce congé ?"
        description="Les créneaux de cette période seront de nouveau proposés aux patients."
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
