import { Stethoscope } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Specialty } from '@/lib/api/schemas/catalog';

export function SpecialtyCard({ specialty }: { specialty: Specialty }) {
  return (
    <Card className="focus-within:ring-ring relative h-full transition-shadow focus-within:ring-2 hover:shadow-md">
      <CardContent className="flex items-center gap-4">
        <span className="bg-accent text-accent-foreground flex size-12 shrink-0 items-center justify-center rounded-lg">
          {specialty.iconUrl ? (
            <Image
              src={specialty.iconUrl}
              alt=""
              width={28}
              height={28}
              className="size-7 object-contain"
            />
          ) : (
            <Stethoscope className="size-6" aria-hidden />
          )}
        </span>
        <h3 className="font-display text-lg leading-tight">
          <Link
            href={`/doctors?specialtyId=${specialty.id}`}
            className="outline-none after:absolute after:inset-0"
          >
            {specialty.name}
          </Link>
        </h3>
      </CardContent>
    </Card>
  );
}
