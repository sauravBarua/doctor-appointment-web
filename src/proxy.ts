import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED = [
  '/dashboard',
  '/appointments',
  '/notifications',
  '/profile',
  '/doctor',
  '/admin',
];

// Cheap gate: no session cookie, no protected page. Real checks (expired or revoked
// sessions, roles) happen in the client gate and, above all, in the API itself.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const protectedPath = PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (protectedPath && !request.cookies.has('sid')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/appointments/:path*',
    '/notifications/:path*',
    '/profile/:path*',
    '/doctor/:path*',
    '/admin/:path*',
  ],
};
