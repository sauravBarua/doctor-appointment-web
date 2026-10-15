import { expect, test } from '@playwright/test';

test('la page d’accueil présente le service', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { level: 1, name: /Prenez rendez-vous avec le bon médecin/ }),
  ).toBeVisible();
});

test('le catalogue mène à la fiche d’un médecin', async ({ page }) => {
  await page.goto('/doctors');
  await page.locator('a[href^="/doctors/"]').first().click();
  await expect(page).toHaveURL(/\/doctors\/[0-9a-f-]{36}$/);
});

test('une page privée renvoie vers la connexion', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard/);
});

test('une page inconnue affiche la page 404 en français', async ({ page }) => {
  await page.goto('/cette-page-nexiste-pas');
  await expect(page.getByText('Page introuvable')).toBeVisible();
});

test('robots.txt protège les espaces privés', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.ok()).toBeTruthy();
  const text = await response.text();
  expect(text).toContain('Disallow: /admin');
  expect(text).toContain('Sitemap:');
});
