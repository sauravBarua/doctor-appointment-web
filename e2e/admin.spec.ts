import { expect, test } from '@playwright/test';
import { loginAs } from './helpers/session';

test.beforeEach(async ({ page }) => {
  await loginAs(page, 'admin');
});

test('le tableau de bord administrateur s’affiche', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByText('Vue d’ensemble de la plateforme.')).toBeVisible();
});

test('le journal d’audit est accessible', async ({ page }) => {
  await page.goto('/admin/audit-logs');
  await expect(page.getByRole('heading', { name: 'Journal d’audit' })).toBeVisible();
});

test('l’administrateur crée puis supprime une spécialité', async ({ page }) => {
  const name = `E2E Spécialité ${Date.now()}`;
  await page.goto('/admin/specialties');

  await page.getByRole('button', { name: 'Ajouter une spécialité' }).click();
  await page.getByRole('dialog').getByLabel('Nom').fill(name);
  await page.getByRole('dialog').getByRole('button', { name: 'Créer' }).click();
  await expect(page.getByText('Spécialité créée')).toBeVisible();

  await page.getByRole('searchbox').fill(name);
  await expect(page.getByRole('row', { name: new RegExp(name) })).toBeVisible();

  await page.getByRole('button', { name: `Supprimer ${name}` }).click();
  await page
    .getByRole('alertdialog')
    .getByRole('button', { name: 'Supprimer', exact: true })
    .click();
  await expect(page.getByText('Spécialité supprimée')).toBeVisible();
  await expect(page.getByRole('row', { name: new RegExp(name) })).toBeHidden();
});
