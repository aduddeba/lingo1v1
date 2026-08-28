import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { PublicUser } from '@/types';

export type AuthStatus = 'loading' | 'authenticated' | 'guest' | 'unauthenticated';

interface AuthState {
  user: PublicUser | null;
  status: AuthStatus;
}

interface AuthActions {
  setSession: (user: PublicUser | null) => void;
  setStatus: (status: AuthStatus) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    (set) => ({
      user: null,
      status: 'loading',
      setSession: (user) =>
        set(
          { user, status: user ? 'authenticated' : 'unauthenticated' },
          false,
          'setSession'
        ),
      setStatus: (status) => set({ status }, false, 'setStatus'),
      clearSession: () => set({ user: null, status: 'unauthenticated' }, false, 'clearSession'),
    }),
    { name: 'AuthStore' }
  )
);
