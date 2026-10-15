import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TimeOffManager } from '@/features/doctor/time-off-manager';

export const metadata: Metadata = { title: 'Congés' };

export default function TimeOffPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="font-display mb-6 text-3xl tracking-tight">Congés</h1>
      <Suspense>
        <TimeOffManager />
      </Suspense>
    </div>
  );
}
