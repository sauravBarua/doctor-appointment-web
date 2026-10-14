import { Building2, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Clinic } from '@/lib/api/schemas/catalog';

export function ClinicCard({ clinic }: { clinic: Clinic }) {
  return (
    <Card className="focus-within:ring-ring relative h-full gap-0 overflow-hidden py-0 transition-shadow focus-within:ring-2 hover:shadow-md">
      <div className="bg-muted relative aspect-[16/9]">
        {clinic.imageUrl ? (
          <Image
            src={clinic.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center">
            <Building2 className="size-10" aria-hidden />
          </div>
        )}
      </div>
      <CardContent className="grid gap-1 py-4">
        <h3 className="font-display text-lg leading-tight">
          <Link
            href={`/doctors?clinicId=${clinic.id}`}
            className="outline-none after:absolute after:inset-0"
          >
            {clinic.name}
          </Link>
        </h3>
        <p className="text-muted-foreground flex items-start gap-1.5 text-sm">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
          {clinic.address}
        </p>
      </CardContent>
    </Card>
  );
}
