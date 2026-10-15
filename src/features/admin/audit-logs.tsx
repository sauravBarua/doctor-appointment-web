'use client';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { PaginationBar } from '@/components/pagination-bar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { parseFilters } from '@/features/catalog/filters';
import { useCatalogParams } from '@/features/catalog/use-catalog-params';
import { SITE } from '@/config/site';
import { formatDateTime, zonedToInstant } from '@/lib/dates';
import { actionLabel, roleLabel } from './audit-format';
import { useAuditLogs } from './hooks';

const YMD = /^\d{4}-\d{2}-\d{2}$/;
const ymd = (value: string | null) => (value && YMD.test(value) ? value : undefined);

export function AuditLogs() {
  const { searchParams, update } = useCatalogParams();
  const { page } = parseFilters(searchParams);
  const from = ymd(searchParams.get('from'));
  const to = ymd(searchParams.get('to'));
  const query = useAuditLogs({
    page,
    from: from ? zonedToInstant(from, '00:00', SITE.timezone).toISOString() : undefined,
    to: to ? zonedToInstant(to, '23:59', SITE.timezone).toISOString() : undefined,
  });
  const { data, isPending, error } = query;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="grid gap-2">
          <Label htmlFor="audit-from">Du</Label>
          <Input
            id="audit-from"
            type="date"
            value={from ?? ''}
            max={to}
            onChange={(e) => update({ from: e.target.value || undefined })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="audit-to">Au</Label>
          <Input
            id="audit-to"
            type="date"
            value={to ?? ''}
            min={from}
            onChange={(e) => update({ to: e.target.value || undefined })}
          />
        </div>
        <p className="text-muted-foreground pb-2 text-xs">Heure de {SITE.timezone}</p>
      </div>

      {isPending ? (
        <div className="grid gap-3" role="status" aria-label="Chargement">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      ) : error && !data ? (
        <ErrorState error={error} onRetry={() => void query.refetch()} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title="Aucune entrée"
          description="Aucune activité ne correspond à cette période."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Acteur</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Élément</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(log.createdAt, SITE.timezone)}
                    </TableCell>
                    <TableCell>
                      {log.actor?.name ?? 'Système'}
                      {log.actorRole ? (
                        <span className="text-muted-foreground block text-xs">
                          {roleLabel(log.actorRole)}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {actionLabel(log.action)}
                      {log.metadata && typeof log.metadata === 'object' ? (
                        <details className="text-muted-foreground text-xs">
                          <summary className="w-fit cursor-pointer">Détails</summary>
                          <pre className="bg-muted mt-1 max-w-xs overflow-x-auto rounded-md p-2">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.entityType
                        ? `${log.entityType} ${log.entityId?.slice(0, 8) ?? ''}`.trim()
                        : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{log.ip ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationBar
            page={data.meta.page}
            pageSize={data.meta.pageSize}
            total={data.meta.total}
            onPageChange={(next) => update({ page: next > 1 ? String(next) : undefined })}
          />
        </>
      )}
    </div>
  );
}
