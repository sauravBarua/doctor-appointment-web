import { RoleGate } from '@/features/auth/role-gate';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleGate roles={['ADMIN']}>{children}</RoleGate>;
}
