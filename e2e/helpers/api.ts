import { expect, type APIRequestContext } from '@playwright/test';
import { addDays, todayIn } from '@/lib/dates';
import { account, API_URL, type Role } from './accounts';

export async function apiToken(request: APIRequestContext, role: Role): Promise<string> {
  const response = await request.post(`${API_URL}/auth/login`, { data: account(role) });
  expect(response.ok(), `API sign in as ${role}`).toBeTruthy();
  return ((await response.json()) as { data: { accessToken: string } }).data.accessToken;
}

// Makes sure the doctor has a 10:00-12:00 window on tomorrow's weekday (clinic time).
// Returns tomorrow as yyyy-MM-dd.
export async function ensureTomorrowAvailability(request: APIRequestContext): Promise<string> {
  const tomorrow = addDays(todayIn('Europe/Paris'), 1);
  const weekday = new Date(`${tomorrow}T12:00:00Z`).getUTCDay() || 7; // 1 = Monday ... 7 = Sunday
  const token = await apiToken(request, 'doctor');
  const response = await request.post(`${API_URL}/doctor/availability`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { weekday, startMinute: 600, endMinute: 720 },
  });
  if (!response.ok()) {
    // A window that already overlaps is fine: slots exist either way.
    const body = (await response.json()) as { error?: { code?: string } };
    expect(body.error?.code, 'availability setup').toBe('AVAILABILITY_OVERLAP');
  }
  return tomorrow;
}
