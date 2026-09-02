import { cookies } from 'next/headers';
import {
  FIREBASE_SESSION_DURATION_SECONDS,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from './constants';
import { createFirebaseSessionCookie, verifyFirebaseSessionCookie, verifySessionToken } from './session';
import { getPublicUserById } from './users';
import { isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import type { AuthSession } from '@/types';

export async function setSessionCookie(idToken: string): Promise<void> {
  const isFirebaseIdToken = idToken.split('.').length === 3;
  const useFirebaseSessionCookie = isFirebaseAdminConfigured() && isFirebaseIdToken;
  const sessionCookie = useFirebaseSessionCookie ? await createFirebaseSessionCookie(idToken) : idToken;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env['NODE_ENV'] === 'production',
    path: '/',
    maxAge: useFirebaseSessionCookie ? FIREBASE_SESSION_DURATION_SECONDS : SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const claims =
    (isFirebaseAdminConfigured() ? await verifyFirebaseSessionCookie(token) : null) ??
    verifySessionToken(token);
  if (!claims) return null;

  const user = await getPublicUserById(claims.sub);
  if (!user) return null;

  return { user };
}
