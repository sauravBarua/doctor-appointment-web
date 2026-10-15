'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { PaginationBar } from '@/components/pagination-bar';
import { SearchBox } from '@/components/search-box';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { parseFilters } from '@/features/catalog/filters';
import { useCatalogParams } from '@/features/catalog/use-catalog-params';
import type { Page } from '@/lib/api/list';

interface Props<T> {
  query: UseQueryResult<Page<T>>;
  getId: (item: T) => string;
  columns: string[];
  renderCells: (item: T) => React.ReactNode;
  addLabel: string;
  onAdd: () => void;
  searchLabel: string;
  searchPlaceholder: string;
  emptyTitle: string;
  emptyDescription: string;
  filters?: React.ReactNode;
}

export function AdminList<T>({
  query,
  getId,
  columns,
  renderCells,
  addLabel,
  onAdd,
  searchLabel,
  searchPlaceholder,
  emptyTitle,
  emptyDescription,
  filters,
}: Props<T>) {
  const { searchParams, update } = useCatalogParams();
  const { q } = parseFilters(searchParams);
  const { data, isPending, error } = query;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-56 flex-1">
          <SearchBox
            defaultValue={q ?? ''}
            onSearch={(value) => update({ q: value || undefined })}
            label={searchLabel}
            placeholder={searchPlaceholder}
          />
        </div>
        {filters}
        <Button onClick={onAdd}>
          <Plus aria-hidden /> {addLabel}
        </Button>
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
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={getId(item)}>{renderCells(item)}</TableRow>
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
