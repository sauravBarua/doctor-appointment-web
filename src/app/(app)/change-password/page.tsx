import type { Metadata } from 'next';
import { ChangePasswordForm } from '@/features/auth/change-password-form';

export const metadata: Metadata = { title: 'Changer le mot de passe' };

export default function ChangePasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-md px-4 py-10">
      <ChangePasswordForm />
    </div>
  );
}
