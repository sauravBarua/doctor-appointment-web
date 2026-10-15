import type { Metadata } from 'next';
import { ScheduleEditor } from '@/features/doctor/schedule-editor';

export const metadata: Metadata = { title: 'Disponibilités' };

export default function SchedulePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="font-display mb-2 text-3xl tracking-tight">Disponibilités</h1>
      <ScheduleEditor />
    </div>
  );
}
