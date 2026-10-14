import { describe, expect, it } from 'vitest';
import { parseFilters } from './filters';

describe('parseFilters', () => {
  it('lit les paramètres valides', () => {
    expect(parseFilters(new URLSearchParams('page=3&q=dupont'))).toMatchObject({
      page: 3,
      q: 'dupont',
    });
  });

  it('retombe sur les valeurs par défaut quand les paramètres sont invalides', () => {
    const filters = parseFilters({ page: '-4', specialtyId: 'nope', q: '   ' });
    expect(filters.page).toBe(1);
    expect(filters.specialtyId).toBeUndefined();
    expect(filters.q).toBeUndefined();
  });

  it('prend la première valeur quand un paramètre est répété', () => {
    expect(parseFilters({ page: ['2', '5'] }).page).toBe(2);
  });
});
