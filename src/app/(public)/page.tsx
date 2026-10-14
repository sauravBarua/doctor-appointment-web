import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchDoctors, fetchSpecialties } from '@/features/catalog/api';
import { DoctorCard } from '@/features/catalog/doctor-card';
import { SpecialtyCard } from '@/features/catalog/specialty-card';

export const dynamic = 'force-dynamic';

// The home page must still render when the API is down.
async function safe<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [specialties, doctors] = await Promise.all([
    safe(fetchSpecialties({ page: 1, pageSize: 6 })),
    safe(fetchDoctors({ page: 1 })),
  ]);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent)]"
        />
        <div className="mx-auto grid max-w-3xl gap-6 px-4 py-20 text-center sm:py-28">
          <h1 className="font-display text-4xl tracking-tight text-balance sm:text-5xl">
            Prenez rendez-vous avec le bon médecin, en quelques minutes.
          </h1>
          <p className="text-muted-foreground text-lg text-balance">
            Choisissez une spécialité, comparez les disponibilités et réservez en ligne.
          </p>
          <form
            action="/doctors"
            method="get"
            role="search"
            className="mx-auto flex w-full max-w-lg gap-2"
          >
            <Label htmlFor="hero-q" className="sr-only">
              Rechercher un médecin
            </Label>
            <Input
              id="hero-q"
              name="q"
              placeholder="Nom du médecin…"
              autoComplete="off"
              className="h-11"
            />
            <Button type="submit" size="lg">
              Rechercher
            </Button>
          </form>
        </div>
      </section>

      {specialties && specialties.items.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-4 py-14" aria-labelledby="home-specialties">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="home-specialties" className="font-display text-2xl tracking-tight">
              Spécialités
            </h2>
            <Link
              href="/specialties"
              className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
            >
              Tout voir <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specialties.items.map((specialty) => (
              <li key={specialty.id}>
                <SpecialtyCard specialty={specialty} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {doctors && doctors.items.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-4 pb-16" aria-labelledby="home-doctors">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="home-doctors" className="font-display text-2xl tracking-tight">
              Médecins à la une
            </h2>
            <Link
              href="/doctors"
              className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
            >
              Tout voir <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.items.slice(0, 6).map((doctor) => (
              <li key={doctor.id}>
                <DoctorCard doctor={doctor} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
