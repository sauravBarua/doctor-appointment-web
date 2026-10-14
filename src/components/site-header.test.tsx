import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  it('affiche la marque, les liens principaux et les actions de connexion', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('link', { name: /santé rdv/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Médecins' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Se connecter' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Commencer' })).toBeInTheDocument();
  });
});
