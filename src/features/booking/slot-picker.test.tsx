import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { SlotsResponse } from '@/lib/api/schemas/appointments';
import { SlotPicker } from './slot-picker';

const slot = {
  startTime: '2026-10-17T07:00:00.000Z',
  endTime: '2026-10-17T07:30:00.000Z',
  startLocal: '2026-10-17T09:00:00+02:00',
  endLocal: '2026-10-17T09:30:00+02:00',
  label: '09:00-09:30',
};
const data: SlotsResponse = {
  doctorId: 'd1',
  timezone: 'Europe/Paris',
  slotDurationMinutes: 30,
  from: '2026-10-17',
  to: '2026-10-18',
  days: [
    { date: '2026-10-17', slots: [slot] },
    { date: '2026-10-18', slots: [] },
  ],
};

describe('SlotPicker', () => {
  it('affiche les créneaux du premier jour disponible et désactive les jours vides', () => {
    render(
      <SlotPicker
        data={data}
        pickedDate={null}
        onPickDate={vi.fn()}
        selectedStart={null}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('Samedi 17 octobre')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '09:00' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /18/ })).toBeDisabled();
  });

  it('transmet le créneau choisi', async () => {
    const onSelect = vi.fn();
    render(
      <SlotPicker
        data={data}
        pickedDate={null}
        onPickDate={vi.fn()}
        selectedStart={null}
        onSelect={onSelect}
      />,
    );
    await userEvent.setup().click(screen.getByRole('button', { name: '09:00' }));
    expect(onSelect).toHaveBeenCalledWith(slot);
  });

  it('marque le créneau sélectionné', () => {
    render(
      <SlotPicker
        data={data}
        pickedDate={null}
        onPickDate={vi.fn()}
        selectedStart={slot.startTime}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: '09:00' })).toHaveAttribute('aria-pressed', 'true');
  });
});
