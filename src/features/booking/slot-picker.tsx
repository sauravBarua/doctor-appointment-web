'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  capitalize,
  dayNumber,
  formatDayMonth,
  formatTime,
  formatYmdLong,
  weekdayShort,
} from '@/lib/dates';
import type { Slot, SlotsResponse } from '@/lib/api/schemas/appointments';
import { cn } from '@/lib/utils';

export const MAX_WEEKS = 8;

export function WeekNav({
  from,
  to,
  weekOffset,
  onChange,
}: {
  from: string;
  to: string;
  weekOffset: number;
  onChange: (offset: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label="Semaine précédente"
        disabled={weekOffset === 0}
        onClick={() => onChange(weekOffset - 1)}
      >
        <ChevronLeft aria-hidden />
      </Button>
      <p className="text-sm font-medium" aria-live="polite">
        Du {formatDayMonth(from)} au {formatDayMonth(to)}
      </p>
      <Button
        variant="outline"
        size="icon"
        aria-label="Semaine suivante"
        disabled={weekOffset >= MAX_WEEKS - 1}
        onClick={() => onChange(weekOffset + 1)}
      >
        <ChevronRight aria-hidden />
      </Button>
    </div>
  );
}

interface Props {
  data: SlotsResponse;
  pickedDate: string | null;
  onPickDate: (date: string) => void;
  selectedStart: string | null;
  onSelect: (slot: Slot) => void;
}

export function SlotPicker({ data, pickedDate, onPickDate, selectedStart, onSelect }: Props) {
  const withSlots = data.days.filter((day) => day.slots.length > 0);
  const active = withSlots.find((day) => day.date === pickedDate) ?? withSlots[0];

  return (
    <div className="grid gap-5">
      <div role="group" aria-label="Jours" className="flex gap-2 overflow-x-auto pb-1">
        {data.days.map((day) => {
          const count = day.slots.length;
          const isActive = day.date === active?.date;
          return (
            <button
              key={day.date}
              type="button"
              disabled={count === 0}
              aria-pressed={isActive}
              onClick={() => onPickDate(day.date)}
              className={cn(
                'flex min-w-20 shrink-0 flex-col items-center rounded-lg border px-3 py-2 text-sm transition-colors',
                'focus-visible:ring-ring/50 focus-visible:ring-3 focus-visible:outline-none',
                isActive ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted',
                count === 0 && 'cursor-not-allowed opacity-40 hover:bg-transparent',
              )}
            >
              <span className="text-xs uppercase">{weekdayShort(day.date)}</span>
              <span className="text-lg font-semibold">{dayNumber(day.date)}</span>
              <span className="text-[11px]">
                {count === 0 ? '—' : `${count} créneau${count > 1 ? 'x' : ''}`}
              </span>
            </button>
          );
        })}
      </div>

      {active ? (
        <div className="grid gap-3">
          <h3 className="font-medium">{capitalize(formatYmdLong(active.date))}</h3>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {active.slots.map((slot) => {
              const selected = slot.startTime === selectedStart;
              return (
                <li key={slot.startTime}>
                  <Button
                    type="button"
                    variant={selected ? 'default' : 'outline'}
                    aria-pressed={selected}
                    className="w-full"
                    onClick={() => onSelect(slot)}
                  >
                    {formatTime(slot.startTime, data.timezone)}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
          Aucun créneau disponible cette semaine. Essayez la semaine suivante.
        </p>
      )}
    </div>
  );
}
