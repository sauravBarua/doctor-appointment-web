import { expect, test } from '@playwright/test';
import { capitalize, dayNumber, formatDateLong, zonedToInstant } from '@/lib/dates';
import { account, doctorId } from './helpers/accounts';
import { ensureTomorrowAvailability } from './helpers/api';
import { loginAs } from './helpers/session';

// The second test cancels what the first one booked.
test.describe.configure({ mode: 'serial' });

let tomorrow = '';
let bookedTime = '';

test.beforeAll(async ({ playwright }) => {
  const request = await playwright.request.newContext();
  tomorrow = await ensureTomorrowAvailability(request);
  await request.dispose();
});

test('un visiteur choisit un créneau, se connecte puis réserve', async ({ page }) => {
  await page.goto(`/doctors/${doctorId()}/book`);

  await page
    .getByRole('group', { name: 'Jours' })
    .getByRole('button', { name: new RegExp(`^\\S+ ${dayNumber(tomorrow)} `) })
    .click();
  const firstSlot = page.getByRole('button', { name: /^\d{2}:\d{2}$/ }).first();
  bookedTime = ((await firstSlot.textContent()) ?? '').trim();
  await firstSlot.click();

  await page.getByRole('link', { name: 'Se connecter pour réserver' }).click();
  await expect(page).toHaveURL(/\/login\?next=/);

  const patient = account('patient');
  await page.locator('#email').fill(patient.email);
  await page.locator('#password').fill(patient.password);
  await page.getByRole('button', { name: 'Se connecter' }).click();

  // Back on the booking page with the slot still selected.
  await expect(page).toHaveURL(new RegExp(`/doctors/${doctorId()}/book`));
  await expect(page.getByText('Aucun créneau sélectionné.')).toBeHidden();
  await page.getByRole('button', { name: 'Confirmer le rendez-vous' }).click();
  await expect(page.getByRole('heading', { name: 'Rendez-vous confirmé' })).toBeVisible();
});

test('le patient annule le rendez-vous qu’il vient de prendre', async ({ page }) => {
  await loginAs(page, 'patient');
  await page.goto('/appointments');

  const iso = zonedToInstant(tomorrow, bookedTime, 'Europe/Paris').toISOString();
  const card = page
    .locator('[data-slot="card"]')
    .filter({ hasText: capitalize(formatDateLong(iso, 'Europe/Paris')) })
    .filter({ hasText: `${bookedTime} –` })
    .first();

  await card.getByRole('button', { name: 'Annuler', exact: true }).click();
  await page
    .getByRole('alertdialog')
    .getByRole('button', { name: 'Annuler le rendez-vous', exact: true })
    .click();
  await expect(page.getByText('Rendez-vous annulé')).toBeVisible();
});
