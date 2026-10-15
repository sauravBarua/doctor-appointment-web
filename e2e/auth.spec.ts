import { expect, test } from '@playwright/test';
import { account } from './helpers/accounts';
import { loginAs } from './helpers/session';

test('un mauvais mot de passe affiche une erreur en français', async ({ page }) => {
  await page.goto('/login');
  await page.locator('#email').fill(account('patient').email);
  await page.locator('#password').fill('mauvais-mot-de-passe-1');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page.getByText('E-mail ou mot de passe incorrect.')).toBeVisible();
});

test('un patient se connecte et voit son menu', async ({ page }) => {
  const patient = account('patient');
  await page.goto('/login');
  await page.locator('#email').fill(patient.email);
  await page.locator('#password').fill(patient.password);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('link', { name: 'Mes rendez-vous' }).first()).toBeVisible();
});

test('l’en-tête public propose « Mon espace » une fois connecté', async ({ page }) => {
  await loginAs(page, 'patient');
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Mon espace' })).toBeVisible();
});

test('un patient ne voit pas l’administration', async ({ page }) => {
  await loginAs(page, 'patient');
  await page.goto('/admin/doctors');
  await expect(page.getByText('Accès réservé')).toBeVisible();
});

test('un médecin accède à son espace', async ({ page }) => {
  await loginAs(page, 'doctor');
  await page.goto('/doctor/schedule');
  await expect(page.getByText('Accès réservé')).toBeHidden();
  await expect(page.getByText('Espace médecin').first()).toBeVisible();
});
