import { describe, expect, it } from 'vitest';
import { buildChanges, profileSchema } from './profile-changes';

const current = { name: 'Alice Martin' };

describe('buildChanges', () => {
  it('n’envoie rien quand rien ne change', () => {
    expect(buildChanges({ name: 'Alice Martin', bio: '' }, current, false)).toEqual({});
  });

  it('envoie le nouveau nom', () => {
    expect(buildChanges({ name: 'Alice Durand', bio: '' }, current, false)).toEqual({
      name: 'Alice Durand',
    });
  });

  it('ignore la présentation pour un patient', () => {
    expect(buildChanges({ name: 'Alice Martin', bio: 'Bonjour' }, current, false)).toEqual({});
  });

  it('envoie la présentation d’un médecin quand elle est remplie', () => {
    expect(buildChanges({ name: 'Alice Martin', bio: 'Cardiologue' }, current, true)).toEqual({
      bio: 'Cardiologue',
    });
  });
});

describe('profileSchema', () => {
  it('refuse un nom trop court', () => {
    expect(profileSchema.safeParse({ name: 'x', bio: '' }).success).toBe(false);
  });
});
