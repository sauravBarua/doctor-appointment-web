import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DailyChart } from './daily-chart';

const days = [
  { date: '2026-10-13', count: 0 },
  { date: '2026-10-14', count: 8 },
  { date: '2026-10-15', count: 2 },
];

describe('DailyChart', () => {
  it('expose le graphique avec un nom accessible', () => {
    render(<DailyChart days={days} label="Rendez-vous par jour" />);
    expect(screen.getByRole('img', { name: 'Rendez-vous par jour' })).toBeInTheDocument();
  });

  it('propose un tableau avec les mêmes valeurs', () => {
    render(<DailyChart days={days} label="Rendez-vous par jour" />);
    const table = screen.getByRole('table', { hidden: true });
    expect(table).toHaveTextContent('Mardi 13 octobre');
    expect(table).toHaveTextContent('8');
  });
});
