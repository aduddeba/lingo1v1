import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from './constants';
import { verifySessionToken } from './session';
import { getPublicUserById } from './users';
import type { AuthSession } from '@/types';

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env['NODE_ENV'] === 'production',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const claims = verifySessionToken(token);
  if (!claims) return null;

  const user = await getPublicUserById(claims.sub);
  if (!user) return null;

  return { user };
}
