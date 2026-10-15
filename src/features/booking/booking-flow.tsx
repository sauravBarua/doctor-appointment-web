'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CalendarCheck, Info, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ErrorState } from '@/components/error-state';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DoctorAvatar } from '@/features/catalog/doctor-avatar';
import { errorMessage, toApiError } from '@/lib/api/errors';
import type { Appointment, Slot } from '@/lib/api/schemas/appointments';
import type { Doctor } from '@/lib/api/schemas/catalog';
import { addDays, capitalize, formatDateLong, formatTime, todayIn } from '@/lib/dates';
import { useSessionStore } from '@/stores/session';
import { useBook, useSlots } from './hooks';
import { SlotPicker, WeekNav } from './slot-picker';
import { useBookingStore } from './store';

// The slot is gone or no longer valid: refresh the list and drop the selection.
const SLOT_ERRORS = new Set(['SLOT_TAKEN', 'SLOT_UNAVAILABLE', 'INVALID_SLOT']);

export function BookingFlow({ doctor }: { doctor: Doctor }) {
  const timeZone = doctor.clinic.timezone;
  const queryClient = useQueryClient();
  const status = useSessionStore((s) => s.status);
  const role = useSessionStore((s) => s.user?.role);
  const selection = useBookingStore((s) => s.selection);
  const select = useBookingStore((s) => s.select);
  const clear = useBookingStore((s) => s.clear);
  const book = useBook();

  const [today] = useState(() => todayIn(timeZone));
  const [weekOffset, setWeekOffset] = useState(0);
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);

  const from = addDays(today, weekOffset * 7);
  const to = addDays(from, 6);
  const slots = useSlots(doctor.id, from, to);
  const chosen = selection?.doctorId === doctor.id ? selection : null;

  useEffect(() => {
    void useBookingStore.persist.rehydrate();
  }, []);

  function onSelect(slot: Slot) {
    select({ doctorId: doctor.id, startTime: slot.startTime, endTime: slot.endTime });
    book.reset();
  }

  async function confirm() {
    if (!chosen) return;
    try {
      const appointment = await book.mutateAsync({
        doctorId: doctor.id,
        startTime: chosen.startTime,
      });
      clear();
      setConfirmed(appointment);
      toast.success('Rendez-vous confirmé');
    } catch (error) {
      if (SLOT_ERRORS.has(toApiError(error).code)) {
        clear();
        void queryClient.invalidateQueries({ queryKey: ['slots'] });
      }
    }
  }

  if (confirmed) return <Confirmation appointment={confirmed} />;

  const loginHref = `/login?next=${encodeURIComponent(`/doctors/${doctor.id}/book`)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section aria-labelledby="slots-title" className="grid content-start gap-5">
        <h2 id="slots-title" className="font-display text-xl">
          Choisissez un créneau
        </h2>
        <WeekNav from={from} to={to} weekOffset={weekOffset} onChange={setWeekOffset} />
        {slots.isPending ? (
          <div className="grid gap-3" role="status" aria-label="Chargement des créneaux">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        ) : slots.error ? (
          <ErrorState error={slots.error} onRetry={() => void slots.refetch()} />
        ) : (
          <SlotPicker
            data={slots.data}
            pickedDate={pickedDate}
            onPickDate={setPickedDate}
            selectedStart={chosen?.startTime ?? null}
            onSelect={onSelect}
          />
        )}
      </section>

      <aside>
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="font-display text-lg">Votre rendez-vous</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-3">
              <DoctorAvatar name={doctor.name} image={doctor.image} className="size-12" />
              <div className="grid gap-1">
                <p className="leading-tight font-medium">{doctor.name}</p>
                <Badge variant="secondary" className="w-fit">
                  {doctor.specialty.name}
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground flex items-start gap-1.5 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              {doctor.clinic.name}, {doctor.clinic.address}
            </p>

            <div className="bg-muted rounded-lg p-3 text-sm" aria-live="polite">
              {chosen ? (
                <>
                  <p className="font-medium">
                    {capitalize(formatDateLong(chosen.startTime, timeZone))}
                  </p>
                  <p className="text-muted-foreground">
                    {formatTime(chosen.startTime, timeZone)} –{' '}
                    {formatTime(chosen.endTime, timeZone)} ({doctor.slotDurationMinutes} min)
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">Aucun créneau sélectionné.</p>
              )}
            </div>

            {book.error ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription>{errorMessage(book.error)}</AlertDescription>
              </Alert>
            ) : null}

            {status === 'authenticated' && role !== 'PATIENT' ? (
              <Alert>
                <Info />
                <AlertDescription>
                  Seuls les comptes patients peuvent réserver un rendez-vous.
                </AlertDescription>
              </Alert>
            ) : status === 'anonymous' ? (
              <div className="grid gap-2">
                <Button asChild disabled={!chosen}>
                  <Link href={loginHref}>Se connecter pour réserver</Link>
                </Button>
                <p className="text-muted-foreground text-center text-xs">
                  Pas de compte ?{' '}
                  <Link href="/register" className="text-primary hover:underline">
                    Créer un compte
                  </Link>
                </p>
              </div>
            ) : (
              <Button
                disabled={!chosen || book.isPending || status !== 'authenticated'}
                onClick={() => void confirm()}
              >
                {book.isPending ? 'Réservation…' : 'Confirmer le rendez-vous'}
              </Button>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function Confirmation({ appointment }: { appointment: Appointment }) {
  const { timezone, doctor } = appointment;
  return (
    <Card className="mx-auto max-w-lg text-center">
      <CardContent className="grid justify-items-center gap-4 py-8">
        <CalendarCheck className="text-primary size-10" aria-hidden />
        <h2 className="font-display text-2xl">Rendez-vous confirmé</h2>
        <div className="grid gap-1 text-sm">
          <p className="font-medium">{doctor.name}</p>
          <p>{capitalize(formatDateLong(appointment.startTime, timezone))}</p>
          <p>
            {formatTime(appointment.startTime, timezone)} –{' '}
            {formatTime(appointment.endTime, timezone)}
          </p>
          <p className="text-muted-foreground">
            {doctor.clinic.name}, {doctor.clinic.address}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link href="/appointments">Voir mes rendez-vous</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/doctors">Chercher un autre médecin</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
