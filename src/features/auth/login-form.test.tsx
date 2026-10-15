import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSessionStore } from '@/stores/session';
import { PATIENT } from '../../../tests/fixtures';
import { BFF, fail, ok } from '../../../tests/msw/helpers';
import { server } from '../../../tests/msw/server';
import { renderWithClient } from '../../../tests/render';
import { LoginForm } from './login-form';

const nav = vi.hoisted(() => ({ replace: vi.fn(), push: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: () => nav,
  useSearchParams: () => new URLSearchParams(),
}));

beforeEach(() => {
  useSessionStore.getState().clear();
  nav.replace.mockClear();
  nav.push.mockClear();
});

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Adresse e-mail'), 'alice@example.fr');
  await user.type(screen.getByLabelText('Mot de passe'), 'Secret123');
  await user.click(screen.getByRole('button', { name: 'Se connecter' }));
}

describe('LoginForm', () => {
  it('ouvre la session et redirige vers le tableau de bord', async () => {
    server.use(http.post(`${BFF}/login`, () => ok({ accessToken: 'a', user: PATIENT })));
    renderWithClient(<LoginForm />);
    await fillAndSubmit();
    await waitFor(() => expect(nav.replace).toHaveBeenCalledWith('/dashboard'));
    expect(useSessionStore.getState().status).toBe('authenticated');
  });

  it('affiche un message français pour de mauvais identifiants', async () => {
    server.use(http.post(`${BFF}/login`, () => fail(401, 'INVALID_CREDENTIALS')));
    renderWithClient(<LoginForm />);
    await fillAndSubmit();
    expect(await screen.findByText('E-mail ou mot de passe incorrect.')).toBeInTheDocument();
    expect(nav.replace).not.toHaveBeenCalled();
  });

  it('envoie un compte non vérifié vers la saisie du code', async () => {
    server.use(http.post(`${BFF}/login`, () => fail(403, 'EMAIL_NOT_VERIFIED')));
    renderWithClient(<LoginForm />);
    await fillAndSubmit();
    await waitFor(() =>
      expect(nav.push).toHaveBeenCalledWith('/verify-email?email=alice%40example.fr'),
    );
  });

  it('valide le formulaire sans appeler le serveur', async () => {
    let calls = 0;
    server.use(
      http.post(`${BFF}/login`, () => {
        calls += 1;
        return ok({ accessToken: 'a', user: PATIENT });
      }),
    );
    renderWithClient(<LoginForm />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Se connecter' }));
    expect(await screen.findByText('Adresse e-mail invalide')).toBeInTheDocument();
    expect(calls).toBe(0);
  });
});
