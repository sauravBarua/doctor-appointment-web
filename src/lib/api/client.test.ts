import { delay, http } from 'msw';
import { z } from 'zod';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSessionStore } from '@/stores/session';
import { API, BFF, fail, ok } from '../../../tests/msw/helpers';
import { server } from '../../../tests/msw/server';
import { PATIENT } from '../../../tests/fixtures';
import { apiRequest } from './client';

const ping = () => apiRequest({ method: 'GET', url: '/ping' }, z.object({ ok: z.boolean() }));

beforeEach(() => {
  useSessionStore.getState().setSession({ accessToken: 'old', user: PATIENT });
});

describe('api client', () => {
  it('envoie le jeton d’accès dans l’en-tête Authorization', async () => {
    let header: string | null = null;
    server.use(
      http.get(`${API}/ping`, ({ request }) => {
        header = request.headers.get('authorization');
        return ok({ ok: true });
      }),
    );
    await ping();
    expect(header).toBe('Bearer old');
  });

  it('rafraîchit une seule fois pour deux requêtes en 401, puis les rejoue', async () => {
    let refreshes = 0;
    let retried = 0;
    server.use(
      http.get(`${API}/ping`, ({ request }) => {
        if (request.headers.get('authorization') === 'Bearer new') {
          retried += 1;
          return ok({ ok: true });
        }
        return fail(401, 'UNAUTHORIZED');
      }),
      http.post(`${BFF}/refresh`, async () => {
        refreshes += 1;
        await delay(50); // both 401s land before the refresh finishes
        return ok({ accessToken: 'new', user: PATIENT });
      }),
    );

    await Promise.all([ping(), ping()]);

    expect(refreshes).toBe(1);
    expect(retried).toBe(2);
    expect(useSessionStore.getState().accessToken).toBe('new');
  });

  it('déconnecte quand le rafraîchissement échoue', async () => {
    server.use(
      http.get(`${API}/ping`, () => fail(401, 'UNAUTHORIZED')),
      http.post(`${BFF}/refresh`, () => fail(401, 'UNAUTHORIZED')),
    );
    await expect(ping()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    expect(useSessionStore.getState().status).toBe('anonymous');
  });

  it('ne tente pas de rafraîchir un visiteur anonyme', async () => {
    useSessionStore.getState().clear();
    let refreshes = 0;
    server.use(
      http.get(`${API}/ping`, () => fail(401, 'UNAUTHORIZED')),
      http.post(`${BFF}/refresh`, () => {
        refreshes += 1;
        return ok({ accessToken: 'new', user: PATIENT });
      }),
    );
    await expect(ping()).rejects.toMatchObject({ status: 401 });
    expect(refreshes).toBe(0);
  });
});
