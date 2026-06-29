'use client';

import { ThemeProvider } from './ThemeProvider';
import { SocketProvider } from './SocketProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SocketProvider>{children}</SocketProvider>
    </ThemeProvider>
  );
}
