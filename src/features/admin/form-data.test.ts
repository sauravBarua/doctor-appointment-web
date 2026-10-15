import { describe, expect, it } from 'vitest';
import { toFormData } from './form-data';

describe('toFormData', () => {
  it('met les champs en JSON dans `data` et ignore les valeurs undefined', () => {
    const form = toFormData({ name: 'Cardiologie', bio: undefined });
    expect(JSON.parse(String(form.get('data')))).toEqual({ name: 'Cardiologie' });
    expect(form.has('image')).toBe(false);
  });

  it('joint l’image sous la clé `image`', () => {
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    expect(toFormData({}, file).get('image')).toBeInstanceOf(File);
  });
});
