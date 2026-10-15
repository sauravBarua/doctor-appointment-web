import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WeekChart } from './week-chart';

const days = [
  { date: '2026-10-15', count: 0 },
  { date: '2026-10-17', count: 1 },
  { date: '2026-10-19', count: 3 },
];

describe('WeekChart', () => {
  it('décrit chaque jour pour les lecteurs d’écran', () => {
    render(<WeekChart days={days} />);
    expect(screen.getByLabelText('Samedi 17 octobre : 1 rendez-vous')).toBeInTheDocument();
    expect(screen.getByLabelText('Lundi 19 octobre : 3 rendez-vous')).toBeInTheDocument();
  });

  it('propose un tableau avec les mêmes valeurs', () => {
    render(<WeekChart days={days} />);
    const row = screen.getByRole('row', { name: /Lundi 19 octobre/ });
    expect(row).toHaveTextContent('3');
  });
});
