import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route guard: protect game routes behind authentication.
// Currently a pass-through; wire JWT/session validation here when auth is added.
export function middleware(request: NextRequest): NextResponse {
  // Example future check:
  // const token = request.cookies.get('session')?.value;
  // if (!token) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}

export const config = {
  // Match /lobby and /match/* but not static assets or Next.js internals
  matcher: ['/lobby', '/match/:path*'],
};
