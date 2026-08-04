import type { Metadata } from 'next';
import Link from 'next/link';
import { GAME_MODES } from '@/lib/constants/game';
import type { GameMode } from '@/types';

export const metadata: Metadata = {
  title: 'Practice',
};

const PRACTICE_ROUTES: Record<GameMode, string> = {
  historical_evolution: '/practice/historical-evolution',
  forgery: '/practice/forgery',
  script_blitz: '/practice/script-blitz',
  city_country: '/practice/city-country',
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(Object.entries(GAME_MODES) as [GameMode, { label: string; description: string }][]).map(
          ([key, mode]) => (
            <Link key={key} href={PRACTICE_ROUTES[key] as never} className="block h-full">
              <div className="relative h-full rounded-2xl border-2 border-brand-200 bg-white p-5 transition-all hover:border-brand-400 hover:shadow-md">
                <span className="absolute right-3 top-3 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                  Available
                </span>
                <h2 className="font-bold text-gray-900">{mode.label}</h2>
                <p className="mt-1 text-sm text-gray-500">{mode.description}</p>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
