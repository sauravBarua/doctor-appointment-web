import { RoleGate } from '@/features/auth/role-gate';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <RoleGate roles={['DOCTOR']}>{children}</RoleGate>;
}
