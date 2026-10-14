import Link from 'next/link';
import { BellRing, CalendarCheck, Clock } from 'lucide-react';
import { DesignCheck } from '@/components/design-check';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FEATURES = [
  {
    icon: CalendarCheck,
    title: 'Disponibilités en direct',
    text: 'Des créneaux de 30 minutes qui disparaissent dès que quelqu’un les réserve.',
  },
  {
    icon: Clock,
    title: 'Toujours à l’heure de Paris',
    text: 'Chaque créneau et chaque rendez-vous s’affiche dans le fuseau horaire de la clinique. Aucune conversion.',
  },
  {
    icon: BellRing,
    title: 'Notifications instantanées',
    text: 'Soyez averti dès qu’un rendez-vous est réservé ou annulé.',
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent)]"
        />
        <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
          <Badge variant="secondary" className="mb-6">
            Paris · Réservation en ligne
          </Badge>
          <h1 className="font-display mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
            Votre prochain rendez-vous, réservé en moins d’une minute.
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg text-pretty">
            Trouvez un spécialiste, choisissez un créneau libre et recevez une confirmation
            immédiate.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/doctors">Trouver un médecin</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register">Créer un compte</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <Card key={title}>
            <CardHeader>
              <div className="bg-accent text-accent-foreground mb-2 flex size-10 items-center justify-center rounded-lg">
                <Icon className="size-5" aria-hidden />
              </div>
              <CardTitle className="font-display text-xl">{title}</CardTitle>
              <CardDescription>{text}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </section>

      <DesignCheck />
    </>
  );
}
