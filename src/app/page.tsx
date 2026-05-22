import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { GAME_MODES } from '@/lib/constants/game';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-16 py-12">
      <section className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          Lingo<span className="text-brand-600">1v1</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-balance text-lg text-gray-500">
          Challenge opponents to real-time linguistics duels — anagrams, word chains, definition
          races &amp; more.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/lobby">
            <Button size="lg">Find a Match</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      <section className="w-full">
        <h2 className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
          Game Modes
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.entries(GAME_MODES).map(([key, mode]) => (
            <Card key={key} variant="bordered" className="transition-shadow hover:shadow-md">
              <h3 className="font-semibold text-gray-900">{mode.label}</h3>
              <p className="mt-1 text-sm text-gray-500">{mode.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
