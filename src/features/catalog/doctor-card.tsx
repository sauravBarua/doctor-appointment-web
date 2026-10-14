import { Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Doctor } from '@/lib/api/schemas/catalog';
import { DoctorAvatar } from './doctor-avatar';

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card className="focus-within:ring-ring relative h-full transition-shadow focus-within:ring-2 hover:shadow-md">
      <CardContent className="flex gap-4">
        <DoctorAvatar name={doctor.name} image={doctor.image} className="size-14" />
        <div className="grid min-w-0 flex-1 gap-2">
          <h3 className="font-display text-lg leading-tight">
            {/* Stretched link: the whole card is clickable, with one focus target. */}
            <Link
              href={`/doctors/${doctor.id}`}
              className="outline-none after:absolute after:inset-0"
            >
              {doctor.name}
            </Link>
          </h3>
          <Badge variant="secondary" className="w-fit">
            {doctor.specialty.name}
          </Badge>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate">
              {doctor.clinic.name}, {doctor.clinic.city}
            </span>
          </p>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <Clock className="size-4 shrink-0" aria-hidden />
            Consultation de {doctor.slotDurationMinutes} min
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
