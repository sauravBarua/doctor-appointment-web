import { Clock, ExternalLink, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchDoctor } from '@/features/catalog/api';
import { DoctorAvatar } from '@/features/catalog/doctor-avatar';
import { toApiError } from '@/lib/api/errors';

export const dynamic = 'force-dynamic';

// One fetch per request, shared by generateMetadata and the page.
const getDoctor = cache(async (id: string) => {
  try {
    return await fetchDoctor(id);
  } catch (error) {
    const apiError = toApiError(error);
    if (apiError.status === 404 || apiError.status === 400) return null; // unknown or malformed id
    throw apiError;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const doctor = await getDoctor((await params).id);
  if (!doctor) return { title: 'Médecin introuvable' };
  return {
    title: doctor.name,
    description: `${doctor.name}, ${doctor.specialty.name} à ${doctor.clinic.city}. Prenez rendez-vous en ligne.`,
  };
}

export default async function DoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const doctor = await getDoctor((await params).id);
  if (!doctor) notFound();
  const { clinic } = doctor;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${clinic.name} ${clinic.address}`)}`;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <nav aria-label="Fil d’Ariane" className="text-muted-foreground mb-6 text-sm">
        <Link href="/doctors" className="hover:underline">
          Médecins
        </Link>
        <span aria-hidden> / </span>
        <span aria-current="page">{doctor.name}</span>
      </nav>

      <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <DoctorAvatar name={doctor.name} image={doctor.image} className="size-28 text-2xl" />
        <div className="grid gap-2">
          <h1 className="font-display text-3xl tracking-tight">{doctor.name}</h1>
          <Badge variant="secondary" className="w-fit">
            {doctor.specialty.name}
          </Badge>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <Clock className="size-4" aria-hidden />
            Consultations de {doctor.slotDurationMinutes} minutes
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_20rem]">
        <section aria-labelledby="about">
          <h2 id="about" className="font-display mb-3 text-xl">
            À propos
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {doctor.bio ?? 'Ce médecin n’a pas encore renseigné de présentation.'}
          </p>
        </section>

        <aside className="grid content-start gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">{clinic.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <p className="text-muted-foreground flex items-start gap-1.5">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                {clinic.address}
              </p>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex w-fit items-center gap-1 hover:underline"
              >
                Voir sur la carte <ExternalLink className="size-3.5" aria-hidden />
                <span className="sr-only">(s’ouvre dans un nouvel onglet)</span>
              </a>
            </CardContent>
          </Card>
          <Button asChild size="lg">
            <Link href={`/doctors/${doctor.id}/book`}>Prendre rendez-vous</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
