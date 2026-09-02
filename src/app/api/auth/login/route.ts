import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth/cookies';
import { AuthError, login } from '@/lib/auth/service';

interface LoginBody {
  idToken?: unknown;
  email?: unknown;
  password?: unknown;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginBody | null;
  const idToken = typeof body?.idToken === 'string' ? body.idToken : '';
  const email = typeof body?.email === 'string' ? body.email : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  try {
    const { user, token } = await login({ idToken, email, password });
    await setSessionCookie(token);
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof AuthError) {
      const status = error.code === 'INVALID_CREDENTIALS' ? 401 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }
    throw error;
  }
}
