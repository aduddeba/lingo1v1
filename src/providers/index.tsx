'use client';

import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';
import { SocketProvider } from './SocketProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>{children}</SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
