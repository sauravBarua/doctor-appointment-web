import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { SITE } from '@/config/site';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description: SITE.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7fbfb' },
    { media: '(prefers-color-scheme: dark)', color: '#12181c' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${sans.variable} ${display.variable}`}>
      <body className="bg-background text-foreground min-h-dvh font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
