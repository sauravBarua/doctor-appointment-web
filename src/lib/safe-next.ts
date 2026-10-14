export const AUTH_HOME = '/dashboard';

// Only allow same-site relative paths, so `?next=` can't be used as an open redirect.
export function safeNext(value: string | null | undefined, fallback = AUTH_HOME): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return fallback;
  }
  return value;
}
