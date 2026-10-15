import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { addDays, todayIn, zonedToInstant } from '@/lib/dates';
import type { Doctor } from '@/lib/api/schemas/catalog';
import { useSessionStore } from '@/stores/session';
import { PATIENT } from '../../../tests/fixtures';
import { API, fail, ok } from '../../../tests/msw/helpers';
import { server } from '../../../tests/msw/server';
import { renderWithClient } from '../../../tests/render';
import { BookingFlow } from './booking-flow';
import { useBookingStore } from './store';

const TZ = 'Europe/Paris';

const doctor: Doctor = {
  id: 'd1',
  name: 'Dr. Camille Dubois',
  image: null,
  bio: null,
  slotDurationMinutes: 30,
  specialty: { id: 's1', name: 'Cardiologie' },
  clinic: {
    id: 'c1',
    name: 'Clinique de La Muette',
    city: 'Paris',
    address: '46 Rue Nicolo, 75116 Paris',
    imageUrl: null,
    timezone: TZ,
  },
};

function slot(date: string, hm: string) {
  const start = zonedToInstant(date, hm, TZ);
  const end = new Date(start.getTime() + 30 * 60_000);
  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    startLocal: `${date}T${hm}:00`,
    endLocal: `${date}T${hm}:30`,
    label: hm,
  };
}

const today = todayIn(TZ);
const tomorrow = addDays(today, 1);
const first = slot(tomorrow, '09:00');

const slotsBody = () =>
  ok({
    doctorId: 'd1',
    timezone: TZ,
    slotDurationMinutes: 30,
    from: today,
    to: addDays(today, 6),
    days: [{ date: tomorrow, slots: [first, slot(tomorrow, '09:30')] }],
  });

const appointment = {
  id: 'a1',
  status: 'BOOKED',
  startTime: first.startTime,
  endTime: first.endTime,
  startLocal: first.startLocal,
  endLocal: first.endLocal,
  timezone: TZ,
  doctor: {
    id: 'd1',
    name: doctor.name,
    specialty: 'Cardiologie',
    clinic: { id: 'c1', name: doctor.clinic.name, city: 'Paris', address: doctor.clinic.address },
  },
  patient: { id: 'p1', name: 'Alice Martin' },
  cancelledAt: null,
  cancelReason: null,
  createdAt: new Date().toISOString(),
};

beforeEach(() => {
  sessionStorage.clear();
  useBookingStore.setState({ selection: null });
  useSessionStore.getState().setSession({ accessToken: 'token', user: PATIENT });
});

async function pickFirstSlot() {
  const user = userEvent.setup();
  await user.click(await screen.findByRole('button', { name: '09:00' }, { timeout: 5000 }));
  return user;
}

describe('BookingFlow', () => {
  it('réserve le créneau choisi et affiche la confirmation', async () => {
    let booked: { doctorId: string; startTime: string } | null = null;
    server.use(
      http.get(`${API}/doctors/d1/slots`, () => slotsBody()),
      http.post(`${API}/appointments`, async ({ request }) => {
        booked = (await request.json()) as { doctorId: string; startTime: string };
        return ok(appointment, 201);
      }),
    );

    renderWithClient(<BookingFlow doctor={doctor} />);
    const user = await pickFirstSlot();
    await user.click(screen.getByRole('button', { name: 'Confirmer le rendez-vous' }));

    expect(
      await screen.findByRole('heading', { name: 'Rendez-vous confirmé' }),
    ).toBeInTheDocument();
    expect(booked).toEqual({ doctorId: 'd1', startTime: first.startTime });
  });

  it('perd la course sur un créneau : message, sélection effacée, créneaux rechargés', async () => {
    let slotCalls = 0;
    server.use(
      http.get(`${API}/doctors/d1/slots`, () => {
        slotCalls += 1;
        return slotsBody();
      }),
      http.post(`${API}/appointments`, () => fail(409, 'SLOT_TAKEN')),
    );

    renderWithClient(<BookingFlow doctor={doctor} />);
    const user = await pickFirstSlot();
    await user.click(screen.getByRole('button', { name: 'Confirmer le rendez-vous' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/créneau/i);
    expect(screen.getByText('Aucun créneau sélectionné.')).toBeInTheDocument();
    await waitFor(() => expect(slotCalls).toBeGreaterThanOrEqual(2));
  });
});
