'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import { ErrorState } from '@/components/error-state';
import { PaginationBar } from '@/components/pagination-bar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Page } from '@/lib/api/list';
import { cn } from '@/lib/utils';

interface Props<T> {
  query: UseQueryResult<Page<T>>;
  getKey: (item: T) => string;
  render: (item: T) => React.ReactNode;
  count: (total: number) => string;
  empty: React.ReactNode;
  onPageChange: (page: number) => void;
}

const GRID = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3';

export function PagedGrid<T>({ query, getKey, render, count, empty, onPageChange }: Props<T>) {
  const { data, isPending, isFetching, error, refetch } = query;

  if (isPending) {
    return (
      <div className={GRID} role="status" aria-label="Chargement">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-36 rounded-xl" />
        ))}
      </div>
    );
  }
  if (error && !data) return <ErrorState error={error} onRetry={() => void refetch()} />;
  if (!data || data.items.length === 0) return <>{empty}</>;

  return (
    <div className="grid gap-6">
      <p aria-live="polite" className="text-muted-foreground text-sm">
        {count(data.meta.total)}
      </p>
      <ul className={cn(GRID, isFetching && 'opacity-60 transition-opacity')}>
        {data.items.map((item) => (
          <li key={getKey(item)}>{render(item)}</li>
        ))}
      </ul>
      <PaginationBar
        page={data.meta.page}
        pageSize={data.meta.pageSize}
        total={data.meta.total}
        onPageChange={onPageChange}
      />
    </div>
  );
}
