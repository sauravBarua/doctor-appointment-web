import { expect, type Page } from '@playwright/test';
import { account, type Role } from './accounts';

// Signs in through the app's own session route. The cookies land in this page's context,
// and the app restores the session from them on the next navigation.
export async function loginAs(page: Page, role: Role) {
  const response = await page.request.post('/api/session/login', { data: account(role) });
  const body = response.ok() ? '' : (await response.text()).slice(0, 300);
  expect(response.ok(), `sign in as ${role}: HTTP ${response.status()} ${body}`).toBeTruthy();
}
