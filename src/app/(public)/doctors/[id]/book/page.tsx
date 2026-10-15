import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookingFlow } from '@/features/booking/booking-flow';
import { getDoctor } from '@/features/catalog/get-doctor';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const doctor = await getDoctor((await params).id);
  return {
    title: doctor ? `Rendez-vous avec ${doctor.name}` : 'Médecin introuvable',
    robots: { index: false },
  };
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const doctor = await getDoctor((await params).id);
  if (!doctor) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <nav aria-label="Fil d’Ariane" className="text-muted-foreground mb-6 text-sm">
        <Link href="/doctors" className="hover:underline">
          Médecins
        </Link>
        <span aria-hidden> / </span>
        <Link href={`/doctors/${doctor.id}`} className="hover:underline">
          {doctor.name}
        </Link>
        <span aria-hidden> / </span>
        <span aria-current="page">Rendez-vous</span>
      </nav>
      <h1 className="font-display mb-8 text-3xl tracking-tight">Prendre rendez-vous</h1>
      <BookingFlow doctor={doctor} />
    </div>
  );
}
