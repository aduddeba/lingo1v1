import { createHmac, timingSafeEqual } from 'node:crypto';
import { SESSION_DURATION_SECONDS } from './constants';

export interface SessionClaims {
  sub: string;
  username: string;
  email: string;
  exp: number;
  purpose: 'session' | 'socket';
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function getAuthSecret(): string {
  const secret = process.env['AUTH_SECRET'];
  if (!secret && process.env['NODE_ENV'] === 'production') {
    throw new Error('AUTH_SECRET must be configured in production.');
  }
  return secret ?? 'dev-lingo1v1-auth-secret-change-me';
}

function sign(unsignedToken: string): string {
  return createHmac('sha256', getAuthSecret()).update(unsignedToken).digest('base64url');
}

function createSignedToken(claims: SessionClaims): string {
  const payload = base64UrlEncode(JSON.stringify(claims));
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function verifySignedToken(token: string | undefined | null): SessionClaims | null {
  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expectedSignature = sign(payload);
  const actual = Buffer.from(signature, 'base64url');
  const expected = Buffer.from(expectedSignature, 'base64url');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  try {
    const claims = JSON.parse(base64UrlDecode(payload)) as Partial<SessionClaims>;
    if (
      typeof claims.sub !== 'string' ||
      typeof claims.username !== 'string' ||
      typeof claims.email !== 'string' ||
      typeof claims.exp !== 'number' ||
      (claims.purpose !== 'session' && claims.purpose !== 'socket')
    ) {
      return null;
    }

    if (claims.exp <= Math.floor(Date.now() / 1000)) return null;

    return {
      sub: claims.sub,
      username: claims.username,
      email: claims.email,
      exp: claims.exp,
      purpose: claims.purpose,
    };
  } catch {
    return null;
  }
}

export function createSessionToken(input: {
  userId: string;
  username: string;
  email: string;
  now?: number;
}): string {
  const now = input.now ?? Date.now();
  return createSignedToken({
    sub: input.userId,
    username: input.username,
    email: input.email,
    exp: Math.floor(now / 1000) + SESSION_DURATION_SECONDS,
    purpose: 'session',
  });
}

export function verifySessionToken(token: string | undefined | null): SessionClaims | null {
  const claims = verifySignedToken(token);
  return claims?.purpose === 'session' ? claims : null;
}

export function createSocketAuthToken(input: {
  userId: string;
  username: string;
  email: string;
  now?: number;
}): string {
  const now = input.now ?? Date.now();
  return createSignedToken({
    sub: input.userId,
    username: input.username,
    email: input.email,
    exp: Math.floor(now / 1000) + 60 * 5,
    purpose: 'socket',
  });
}

export function verifySocketAuthToken(token: string | undefined | null): SessionClaims | null {
  const claims = verifySignedToken(token);
  return claims?.purpose === 'socket' ? claims : null;
}

export function parseCookieHeader(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce<Record<string, string>>((cookies, part) => {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex === -1) return cookies;

    const name = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    if (name) cookies[name] = decodeURIComponent(value);
    return cookies;
  }, {});
}
