import { SearchX } from 'lucide-react';

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center">
      <SearchX className="text-muted-foreground size-8" aria-hidden />
      <h2 className="font-display text-xl">{title}</h2>
      <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      {children}
    </div>
  );
}
