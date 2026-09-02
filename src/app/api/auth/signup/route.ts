import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth/cookies';
import { AuthError, signup } from '@/lib/auth/service';

interface SignupBody {
  username?: unknown;
  idToken?: unknown;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as SignupBody | null;
  const username = typeof body?.username === 'string' ? body.username : '';
  const idToken = typeof body?.idToken === 'string' ? body.idToken : '';

  try {
    const { user, token } = await signup({ username, idToken });
    await setSessionCookie(token);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      const status = error.code === 'EMAIL_TAKEN' || error.code === 'USERNAME_TAKEN' ? 409 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }
    throw error;
  }
}
