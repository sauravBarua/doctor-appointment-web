import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/config/site';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="main"
      className="relative isolate flex min-h-dvh flex-col items-center justify-center px-4 py-10"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent)]"
      />
      <Link href="/" className="font-display mb-8 text-2xl font-semibold tracking-tight">
        {SITE.name}
      </Link>
      {children}
    </main>
  );
}
