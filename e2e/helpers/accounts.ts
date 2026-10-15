export const API_URL = process.env.E2E_API_URL ?? 'http://localhost:3000/api/v1';

export type Role = 'patient' | 'doctor' | 'admin';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Copy .env.e2e.example to .env.e2e and fill it in.`);
  return value;
}

export function account(role: Role) {
  const key = role.toUpperCase();
  return { email: required(`E2E_${key}_EMAIL`), password: required(`E2E_${key}_PASSWORD`) };
}

export const doctorId = () => required('E2E_DOCTOR_ID');
