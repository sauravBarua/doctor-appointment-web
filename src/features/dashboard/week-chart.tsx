import { capitalize, dayNumber, formatYmdLong, weekdayShort } from '@/lib/dates';

interface Day {
  date: string;
  count: number;
}

const plural = (count: number) => `${count} rendez-vous`;

export function WeekChart({ days }: { days: Day[] }) {
  const max = Math.max(1, ...days.map((day) => day.count));

  return (
    <figure className="grid gap-3">
      <ul className="flex gap-2" aria-label="Rendez-vous par jour sur 7 jours">
        {days.map((day) => {
          const label = `${capitalize(formatYmdLong(day.date))} : ${plural(day.count)}`;
          return (
            <li
              key={day.date}
              tabIndex={0}
              aria-label={label}
              className="group focus-visible:ring-ring/50 relative flex flex-1 flex-col items-center gap-2 rounded-md outline-none focus-visible:ring-3"
            >
              <div className="relative flex h-36 w-full items-end justify-center border-b">
                {day.count > 0 ? (
                  <div
                    className="bg-primary w-6 rounded-t-[4px] transition group-hover:brightness-110 group-focus-visible:brightness-110"
                    style={{ height: `${(day.count / max) * 100}%` }}
                  />
                ) : null}
                <span
                  aria-hidden
                  className="bg-popover text-popover-foreground pointer-events-none absolute bottom-full z-10 mb-1 hidden rounded-md border px-2 py-1 text-xs whitespace-nowrap shadow-md group-hover:block group-focus-visible:block"
                >
                  <strong className="text-sm">{day.count}</strong>{' '}
                  {day.count > 1 ? 'rendez-vous' : 'rendez-vous'}
                  <span className="text-muted-foreground block">
                    {capitalize(formatYmdLong(day.date))}
                  </span>
                </span>
              </div>
              <span aria-hidden className="text-muted-foreground grid text-center text-xs">
                <span className="uppercase">{weekdayShort(day.date)}</span>
                <span className="text-foreground font-medium">{dayNumber(day.date)}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <details className="text-sm">
        <summary className="text-muted-foreground hover:text-foreground w-fit cursor-pointer">
          Afficher le tableau
        </summary>
        <table className="mt-2 w-full max-w-sm text-left">
          <caption className="sr-only">Rendez-vous par jour</caption>
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
              <tr key={day.date} className="border-t">
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
