'use client';

import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export function DesignCheck() {
  return (
    <section aria-labelledby="design-check" className="mx-auto max-w-6xl px-4 pb-20">
      <h2 id="design-check" className="font-display text-2xl">
        Contrôle du design{' '}
        <span className="text-muted-foreground text-sm font-normal">(temporaire)</span>
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge>Réservé</Badge>
        <Badge variant="secondary">Terminé</Badge>
        <Badge variant="destructive">Annulé</Badge>
        <Badge variant="outline">En attente</Badge>
        <Button
          onClick={() =>
            toast.success('Rendez-vous réservé', {
              description: 'mar. 14 oct. · 09:30 (heure de Paris)',
            })
          }
        >
          Afficher un toast de succès
        </Button>
        <Button variant="outline" onClick={() => toast.error('Ce créneau vient d’être pris')}>
          Afficher un toast d’erreur
        </Button>
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="mt-6 grid max-w-sm gap-2">
        <Label htmlFor="design-email">E-mail</Label>
        <Input id="design-email" type="email" placeholder="vous@exemple.fr" />
      </div>
    </section>
  );
}
