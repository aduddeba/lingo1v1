'use client';

import { SocketProvider } from './SocketProvider';

// Compose all app-level providers here. Adding a new provider (e.g. auth,
// theme, feature flags) means touching only this file.
export function Providers({ children }: { children: React.ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>;
}
