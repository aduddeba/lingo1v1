import { NextResponse } from 'next/server';

// Guest multiplayer routes stay open. Authentication is enforced inside
// protected API route handlers, where the signed session can be validated
// with Node crypto and checked against persistent user storage.
export function middleware(): NextResponse {
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/users/:path*'],
};
