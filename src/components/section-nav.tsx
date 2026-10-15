'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function SectionNav({
  items,
  label,
}: {
  items: { href: string; label: string }[];
  label: string;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="border-b">
      <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-block border-b-2 px-3 py-3 text-sm whitespace-nowrap transition-colors',
                  active
                    ? 'border-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground border-transparent',
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
