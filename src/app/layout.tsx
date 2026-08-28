import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';
import { Header } from '@/components/layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Lingo1v1',
    template: '%s | Lingo1v1',
  },
  description:
    'Real-time competitive linguistics game. Challenge opponents to anagram, word-chain, and definition duels.',
  keywords: ['word game', 'linguistics', 'multiplayer', 'competitive', 'real-time'],
};

export const viewport: Viewport = {
  themeColor: '#0284c7',
};

// Root layout is a Server Component - providers are client components rendered
// inside it, keeping the HTML shell on the server for fast first paint.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
