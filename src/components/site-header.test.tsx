import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSessionStore } from '@/stores/session';
import { SiteHeader } from './site-header';

beforeEach(() => useSessionStore.getState().clear());

describe('SiteHeader', () => {
  it('affiche la marque, les liens principaux et la connexion pour un visiteur', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('link', { name: /santé rdv/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Médecins' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Se connecter' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Commencer' })).toBeInTheDocument();
  });

  it('propose l’espace personnel quand on est connecté', () => {
    useSessionStore.getState().setSession({
      accessToken: 'token',
      user: {
        id: '1',
        email: 'alice@example.fr',
        name: 'Alice',
        role: 'PATIENT',
        image: null,
        mustChangePassword: false,
      },
    });
    render(<SiteHeader />);
    expect(screen.getByRole('link', { name: 'Mon espace' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Se connecter' })).not.toBeInTheDocument();
  });
});
