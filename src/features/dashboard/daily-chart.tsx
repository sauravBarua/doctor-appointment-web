import { capitalize, dayNumber, formatYmdLong } from '@/lib/dates';

interface Day {
  date: string;
  count: number;
}

const label = (day: Day) => `${capitalize(formatYmdLong(day.date))} : ${day.count} rendez-vous`;
const shortDate = (date: string) => `${dayNumber(date)}/${date.slice(5, 7)}`;

// Keep tooltips inside the chart near both edges.
function tipClass(index: number, length: number) {
  if (index < 4) return 'left-0';
  if (index >= length - 4) return 'right-0';
  return 'left-1/2 -translate-x-1/2';
}

export function DailyChart({ days, label: ariaLabel }: { days: Day[]; label: string }) {
  const max = Math.max(1, ...days.map((day) => day.count));

  return (
    <figure className="grid gap-3">
      <div role="img" aria-label={ariaLabel} className="grid gap-1">
        <ul className="flex h-40 items-end gap-1 border-b">
          {days.map((day, index) => (
            <li
              key={day.date}
              className="group relative flex h-full flex-1 items-end justify-center"
            >
              {day.count > 0 ? (
                <div
                  className="bg-primary w-full max-w-4 rounded-t-[4px] transition group-hover:brightness-110"
                  style={{ height: `${(day.count / max) * 100}%` }}
                />
              ) : null}
              <span
                aria-hidden
                className={`bg-popover text-popover-foreground pointer-events-none absolute bottom-full z-10 mb-1 hidden rounded-md border px-2 py-1 text-xs whitespace-nowrap shadow-md group-hover:block ${tipClass(index, days.length)}`}
              >
                <strong className="text-sm">{day.count}</strong> rendez-vous
                <span className="text-muted-foreground block">
                  {capitalize(formatYmdLong(day.date))}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <div aria-hidden className="text-muted-foreground flex gap-1 text-xs">
          {days.map((day, index) => (
            <span key={day.date} className="relative h-4 flex-1">
              {index % 7 === 0 ? (
                <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
                  {shortDate(day.date)}
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      <details className="text-sm">
        <summary className="text-muted-foreground hover:text-foreground w-fit cursor-pointer">
          Afficher le tableau
        </summary>
        <table className="mt-2 w-full max-w-sm text-left">
          <caption className="sr-only">{ariaLabel}</caption>
          <thead>
            <tr className="text-muted-foreground">
              <th scope="col" className="py-1 font-normal">
                Jour
              </th>
              <th scope="col" className="py-1 text-right font-normal">
                Rendez-vous
              </th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.date} className="border-t" title={label(day)}>
                <th scope="row" className="py-1 font-normal">
                  {capitalize(formatYmdLong(day.date))}
                </th>
                <td className="py-1 text-right tabular-nums">{day.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
