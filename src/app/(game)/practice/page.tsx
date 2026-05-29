import type { Metadata } from 'next';
import Link from 'next/link';
import { GAME_MODES } from '@/lib/constants/game';
import type { GameMode } from '@/types';

export const metadata: Metadata = {
  title: 'Practice',
};

// Maps each game mode to its practice route (null = coming soon)
const PRACTICE_ROUTES: Partial<Record<GameMode, string>> = {
  historical_evolution: '/practice/historical-evolution',
  forgery: '/practice/forgery',
};

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Single Player
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-gray-900">Practice Mode</h1>
        <p className="mt-2 text-gray-500">
          Sharpen your skills solo before taking on live opponents.
        </p>
      </div>

      {/* Geography board lives outside the GameMode enum — own card */}
      <div className="mb-4">
        <Link href="/practice/forgery-geography" className="block">
          <div className="relative rounded-2xl border-2 border-brand-200 bg-white p-5 transition-all hover:border-brand-400 hover:shadow-md">
            <span className="absolute right-3 top-3 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
              Available
            </span>
            <h2 className="font-bold text-gray-900">Forgery Geography</h2>
            <p className="mt-1 text-sm text-gray-500">
              Two maps. One distribution is forged. Spot the fake and pin the true language origin.
            </p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(Object.entries(GAME_MODES) as [GameMode, { label: string; description: string }][]).map(
          ([key, mode]) => {
            const route = PRACTICE_ROUTES[key];
            const available = !!route;

            const inner = (
              <div
                className={`relative h-full rounded-2xl border-2 p-5 transition-all ${
                  available
                    ? 'border-brand-200 bg-white hover:border-brand-400 hover:shadow-md'
                    : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
              >
                {!available && (
                  <span className="absolute right-3 top-3 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-500">
                    Soon
                  </span>
                )}
                {available && (
                  <span className="absolute right-3 top-3 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    Available
                  </span>
                )}
                <h2 className="font-bold text-gray-900">{mode.label}</h2>
                <p className="mt-1 text-sm text-gray-500">{mode.description}</p>
              </div>
            );

            return available && route ? (
              <Link key={key} href={route} className="block h-full">
                {inner}
              </Link>
            ) : (
              <div key={key} className="h-full cursor-not-allowed">
                {inner}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
