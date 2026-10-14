import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-muted-foreground text-sm font-medium">404</p>
      <h1 className="font-display text-3xl">Page not found</h1>
      <p className="text-muted-foreground">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
