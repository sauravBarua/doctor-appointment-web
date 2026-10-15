import { Suspense } from 'react';

export function AdminPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">{title}</h1>
        {description ? <p className="text-muted-foreground mt-1">{description}</p> : null}
      </header>
      {/* useSearchParams in the lists needs a Suspense boundary at build time. */}
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}
