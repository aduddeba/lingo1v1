'use client';

import { useState, type FormEvent } from 'react';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { Button, Card, Input } from '@/components/ui';
import { firebaseAuth } from '@/lib/firebase/client';
import { useAuthStore, usePlayerStore } from '@/store';
import { userToPlayer } from '@/providers/AuthProvider';
import type { PublicUser } from '@/types';

type AuthMode = 'login' | 'signup';

interface AuthResponse {
  user?: PublicUser;
  error?: string;
}

function getFirebaseAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return 'Google sign-in was cancelled or could not be completed.';
  }

  if (error.code === 'auth/unauthorized-domain') {
    const hostname = window.location.hostname;
    return `This device is opening the app from ${hostname}, which is not allowed in Firebase Auth yet. Add ${hostname} in Firebase Console > Authentication > Settings > Authorized domains.`;
  }

  if (error.code === 'auth/operation-not-allowed') {
    return 'Google sign-in is not enabled yet. Enable Google in Firebase Console > Authentication > Sign-in method.';
  }

  if (error.code === 'auth/popup-blocked') {
    return 'The browser blocked the Google sign-in popup. Allow popups for this site and try again.';
  }

  if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
    return 'Google sign-in was cancelled before it completed.';
  }

  if (error.code === 'auth/auth-domain-config-required') {
    return 'Firebase is missing its auth domain. Check NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN in your environment file.';
  }

  if (error.code === 'auth/invalid-api-key' || error.code === 'auth/app-not-authorized') {
    return 'Firebase rejected this app configuration. Check the Firebase web API key and authorized domains.';
  }

  return `Google sign-in failed: ${error.code}`;
}

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const setPlayer = usePlayerStore((s) => s.setPlayer);
  const router = useRouter();

  const finishFirebaseLogin = async (idToken: string): Promise<boolean> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ idToken }),
    }).catch(() => null);

    if (!response) {
      setError('Unable to reach the server.');
      return false;
    }

    const data = (await response.json().catch(() => ({}))) as AuthResponse;
    if (!response.ok || !data.user) {
      setError(data.error ?? 'Authentication failed.');
      return false;
    }

    await signOut(firebaseAuth).catch(() => undefined);
    setSession(data.user);
    setPlayer(userToPlayer(data.user));
    router.push('/lobby');
    return true;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsLoading(true);

    let createdFirebaseUser = false;
    let idToken = '';
    let useLegacyPasswordLogin = false;

    try {
      const credential =
        mode === 'signup'
          ? await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password)
          : await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      createdFirebaseUser = mode === 'signup';
      idToken = await credential.user.getIdToken();
    } catch {
      if (mode === 'signup') {
        setIsLoading(false);
        setError('Invalid email or password.');
        return;
      }

      useLegacyPasswordLogin = true;
    }

    const response = await fetch(`/api/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(
        useLegacyPasswordLogin
          ? { email: email.trim(), password }
          : mode === 'signup'
          ? { username: username.trim(), idToken }
          : { idToken }
      ),
    }).catch(() => null);

    setIsLoading(false);

    if (!response) {
      if (createdFirebaseUser && firebaseAuth.currentUser) {
        await deleteUser(firebaseAuth.currentUser).catch(() => undefined);
      }
      setError('Unable to reach the server.');
      return;
    }

    const data = (await response.json().catch(() => ({}))) as AuthResponse;
    if (!response.ok || !data.user) {
      if (createdFirebaseUser && firebaseAuth.currentUser) {
        await deleteUser(firebaseAuth.currentUser).catch(() => undefined);
      }
      setError(data.error ?? 'Authentication failed.');
      return;
    }

    await signOut(firebaseAuth).catch(() => undefined);
    setSession(data.user);
    setPlayer(userToPlayer(data.user));
    router.push('/lobby');
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setNotice(null);
    setIsGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(firebaseAuth, provider);
      const idToken = await credential.user.getIdToken();
      await finishFirebaseLogin(idToken);
    } catch (error) {
      setError(getFirebaseAuthErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const resetEmail = email.trim();
    setError(null);
    setNotice(null);

    if (!resetEmail) {
      setError('Enter your email address first, then request a reset link.');
      return;
    }

    setIsResetLoading(true);
    try {
      await sendPasswordResetEmail(firebaseAuth, resetEmail);
      setNotice('Password reset email sent. Check your inbox.');
    } catch {
      setError('Unable to send a reset email for that address.');
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <Card variant="bordered" className="w-full max-w-sm">
      <div className="mb-6 grid grid-cols-2 rounded-lg bg-gray-100 p-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={mode === 'login' ? 'rounded-md bg-white px-3 py-2 text-brand-700 shadow-sm' : 'px-3 py-2 text-gray-500'}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={mode === 'signup' ? 'rounded-md bg-white px-3 py-2 text-brand-700 shadow-sm' : 'px-3 py-2 text-gray-500'}
        >
          Sign up
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        {mode === 'login'
          ? 'Log in to keep your profile ready for ranked play later.'
          : 'Your account starts at 1000 Elo with a clean record.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {mode === 'signup' && (
          <Input
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={2}
            maxLength={20}
            autoComplete="username"
            required
          />
        )}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          minLength={8}
          required
        />
        {mode === 'login' && (
          <button
            type="button"
            onClick={() => {
              void handlePasswordReset();
            }}
            disabled={isResetLoading}
            className="self-start text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isResetLoading ? 'Sending reset link...' : 'Forgot your password?'}
          </button>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {notice && <p className="text-sm text-green-600">{notice}</p>}
        <Button type="submit" isLoading={isLoading} className="w-full">
          {mode === 'login' ? 'Log in' : 'Create account'}
        </Button>
      </form>

      <div className="mt-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        or
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={() => {
          void handleGoogleLogin();
        }}
        disabled={isGoogleLoading}
        aria-busy={isGoogleLoading}
        className="mt-4 flex h-10 w-full items-center justify-center gap-3 rounded-full border border-[#747775] bg-white px-3 text-sm font-medium text-[#1F1F1F] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
      >
        {isGoogleLoading ? <GoogleButtonSpinner /> : <GoogleLogo />}
        <span>{isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
      </button>
    </Card>
  );
}

function GoogleLogo() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px] flex-none"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.71-1.57 2.69-3.88 2.69-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.35 0-4.34-1.59-5.05-3.72H.94v2.33A8.99 8.99 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7a5.41 5.41 0 0 1 0-3.4V4.97H.94a9.01 9.01 0 0 0 0 8.06l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A8.99 8.99 0 0 0 .94 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}

function GoogleButtonSpinner() {
  return (
    <span
      aria-hidden="true"
      className="h-[18px] w-[18px] flex-none animate-spin rounded-full border-2 border-[#747775] border-t-transparent"
    />
  );
}
