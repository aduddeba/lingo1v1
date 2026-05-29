'use client';

import { useState } from 'react';
import type { FeatureCollection, Polygon } from 'geojson';
import { generateMapSet } from '@/lib/forgery-geography/generator';
import type { GeneratedMapSet, Difficulty } from '@/lib/forgery-geography/generator';
import { SvgWorldMap } from './SvgWorldMap';
import { IndoEuropeanMigrationMap } from './IndoEuropeanMigrationMap';

// ─── Types ────────────────────────────────────────────────────────────────────

type Side = 'left' | 'right';
type Phase = 'settings' | 'playing' | 'revealed';

interface Round {
  seed: number;
  difficulty: Difficulty;
  regionId: string;
  mapSet: GeneratedMapSet;
  realSide: Side;
}

interface RoundResult {
  forgedCorrect: boolean;
  distanceKm: number | null;
  pinScore: number;
  total: number;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function haversineKm([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreRound(round: Round, forgedGuess: Side, pin: [number, number] | null): RoundResult {
  const actualForgedSide: Side = round.realSide === 'left' ? 'right' : 'left';
  const forgedCorrect = forgedGuess === actualForgedSide;
  const distanceKm = pin ? haversineKm(pin, round.mapSet.trueOrigin) : null;
  const pinScore = distanceKm !== null ? Math.max(0, Math.round(100 * (1 - distanceKm / 1500))) : 0;
  return { forgedCorrect, distanceKm, pinScore, total: (forgedCorrect ? 100 : 0) + pinScore };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const REGIONS = [
  { id: 'europe', label: 'Europe' },
  { id: 'east_asia', label: 'East Asia' },
  { id: 'southeast_asia', label: 'SE Asia' },
  { id: 'south_asia', label: 'South Asia' },
  { id: 'west_asia_north_africa', label: 'W. Asia & N. Africa' },
  { id: 'sub_saharan_africa', label: 'Sub-Saharan Africa' },
];

const DIFFICULTIES: { value: Difficulty; label: string; hint: string }[] = [
  { value: 'easy',   label: 'Easy',   hint: 'Satellite on a distant continent' },
  { value: 'medium', label: 'Medium', hint: 'Satellite in an adjacent wrong region' },
  { value: 'hard',   label: 'Hard',   hint: 'Satellite just across a geographic barrier' },
];

// ─── Settings panel ───────────────────────────────────────────────────────────

function SettingsPanel({ onStart }: { onStart: (d: Difficulty, r: string) => void }) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [regionId, setRegionId] = useState('europe');

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Practice Mode</p>
        <h1 className="mt-1 text-2xl font-extrabold text-gray-900">Forgery Geography</h1>
        <p className="mt-2 text-sm text-gray-500">
          Two maps. One distribution is real, one is forged. Spot the fake — then pin the true origin.
        </p>
      </div>

      <IndoEuropeanMigrationMap className="w-full shadow-sm" />

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Difficulty</p>
        <div className="space-y-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={`w-full rounded-xl border-2 p-3 text-left transition-colors ${
                difficulty === d.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-semibold text-gray-900">{d.label}</span>
              <span className="ml-2 text-xs text-gray-400">{d.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Region</p>
        <div className="grid grid-cols-2 gap-2">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setRegionId(r.id)}
              className={`rounded-xl border-2 px-3 py-2 text-sm font-medium transition-colors ${
                regionId === r.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-indigo-300'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(difficulty, regionId)}
        className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
      >
        Start Round
      </button>
    </div>
  );
}

// ─── Map pair ─────────────────────────────────────────────────────────────────

interface MapCardProps {
  side: Side;
  label: string;
  overlay: FeatureCollection<Polygon> | null;
  phase: Phase;
  isForgedGuess: boolean;
  isUserRealSide: boolean;
  onMarkForged: () => void;
  onMapClick?: (coord: [number, number]) => void;
  pin: [number, number] | null;
  originMarker: [number, number] | null;
  revealLabel?: 'real' | 'forged';
  forgedGuessCorrect?: boolean;
}

function MapCard({
  label,
  overlay,
  phase,
  isForgedGuess,
  isUserRealSide,
  onMarkForged,
  onMapClick,
  pin,
  originMarker,
  revealLabel,
  forgedGuessCorrect,
}: MapCardProps) {
  const borderClass =
    phase === 'playing'
      ? isForgedGuess
        ? 'ring-2 ring-rose-400'
        : isUserRealSide
          ? 'ring-2 ring-indigo-400'
          : 'ring-1 ring-gray-200'
      : revealLabel === 'forged'
        ? forgedGuessCorrect
          ? 'ring-2 ring-rose-400'
          : 'ring-2 ring-rose-300'
        : 'ring-2 ring-emerald-400';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        {phase === 'revealed' && revealLabel && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              revealLabel === 'real'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            {revealLabel === 'real' ? 'Real' : 'Forged'}
          </span>
        )}
        {phase === 'playing' && isUserRealSide && (
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">
            Click to pin origin
          </span>
        )}
      </div>

      <div className={`aspect-[2/1] overflow-hidden rounded-xl ${borderClass}`}>
        <SvgWorldMap
          overlay={overlay}
          onMapClick={onMapClick}
          pin={pin}
          originMarker={originMarker}
        />
      </div>

      {phase === 'playing' && (
        <button
          onClick={onMarkForged}
          className={`w-full rounded-lg border-2 py-2 text-sm font-semibold transition-colors ${
            isForgedGuess
              ? 'border-rose-500 bg-rose-500 text-white'
              : 'border-gray-300 text-gray-600 hover:border-rose-400 hover:text-rose-600'
          }`}
        >
          {isForgedGuess ? '✗ Marked as Forged' : 'Mark as Forged'}
        </button>
      )}
    </div>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({
  result,
  sessionScore,
  roundNumber,
  onNext,
  onSettings,
}: {
  result: RoundResult;
  sessionScore: number;
  roundNumber: number;
  onNext: () => void;
  onSettings: () => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-3 divide-x divide-gray-100 text-center">
        <div className="pr-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Forgery</p>
          <p className={`mt-1 text-2xl font-extrabold ${result.forgedCorrect ? 'text-emerald-600' : 'text-rose-500'}`}>
            {result.forgedCorrect ? '+100' : '0'}
          </p>
          <p className="text-xs text-gray-400">{result.forgedCorrect ? 'Correct' : 'Wrong'}</p>
        </div>
        <div className="px-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Origin Pin</p>
          <p className="mt-1 text-2xl font-extrabold text-indigo-600">+{result.pinScore}</p>
          <p className="text-xs text-gray-400">
            {result.distanceKm !== null ? `${Math.round(result.distanceKm)} km off` : 'No pin'}
          </p>
        </div>
        <div className="pl-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Round</p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">{result.total}</p>
          <p className="text-xs text-gray-400">/ 200 pts</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-gray-50 px-4 py-2 text-center text-xs text-gray-500">
        Session total after {roundNumber} {roundNumber === 1 ? 'round' : 'rounds'}:{' '}
        <span className="font-bold text-gray-700">{sessionScore} pts</span>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onNext}
          className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
        >
          Next Round
        </button>
        <button
          onClick={onSettings}
          className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:border-gray-300"
        >
          Settings
        </button>
      </div>
    </div>
  );
}

// ─── Main board ───────────────────────────────────────────────────────────────

export function ForgeryGeographyBoard() {
  const [phase, setPhase] = useState<Phase>('settings');
  const [round, setRound] = useState<Round | null>(null);
  const [forgedGuess, setForgedGuess] = useState<Side | null>(null);
  const [originPin, setOriginPin] = useState<[number, number] | null>(null);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [roundNumber, setRoundNumber] = useState(0);

  function startRound(difficulty: Difficulty, regionId: string) {
    const seed = Date.now() % 1_000_000;
    const mapSet = generateMapSet({ seed, difficulty, regionId });
    const realSide: Side = Math.random() < 0.5 ? 'left' : 'right';
    setRound({ seed, difficulty, regionId, mapSet, realSide });
    setForgedGuess(null);
    setOriginPin(null);
    setResult(null);
    setPhase('playing');
    setRoundNumber((n) => n + 1);
  }

  function lockAnswer() {
    if (!round || !forgedGuess) return;
    const r = scoreRound(round, forgedGuess, originPin);
    setResult(r);
    setSessionScore((s) => s + r.total);
    setPhase('revealed');
  }

  function nextRound() {
    if (!round) return;
    startRound(round.difficulty, round.regionId);
  }

  if (phase === 'settings') {
    return (
      <div className="py-6">
        <SettingsPanel onStart={startRound} />
      </div>
    );
  }

  if (!round) return null;

  const leftOverlay = round.realSide === 'left' ? round.mapSet.real : round.mapSet.forged;
  const rightOverlay = round.realSide === 'right' ? round.mapSet.real : round.mapSet.forged;
  const actualForgedSide: Side = round.realSide === 'left' ? 'right' : 'left';
  const userRealSide: Side | null = forgedGuess ? (forgedGuess === 'left' ? 'right' : 'left') : null;
  const diffLabel = round.difficulty.charAt(0).toUpperCase() + round.difficulty.slice(1);
  const regionLabel = REGIONS.find((r) => r.id === round.regionId)?.label ?? round.regionId;

  return (
    <div className="space-y-4">
      {/* HUD */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Round {roundNumber}
          </span>
          <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {diffLabel} · {regionLabel}
          </span>
        </div>
        <span className="text-sm font-bold text-gray-700">{sessionScore} pts</span>
      </div>

      {/* Maps */}
      <div className="grid grid-cols-2 gap-4">
        {(['left', 'right'] as Side[]).map((side) => {
          const overlay = side === 'left' ? leftOverlay : rightOverlay;
          const isForgedGuess = forgedGuess === side;
          const isUserRealSide = userRealSide === side;
          const revealLabel: 'real' | 'forged' | undefined =
            phase === 'revealed' ? (side === actualForgedSide ? 'forged' : 'real') : undefined;

          return (
            <MapCard
              key={side}
              side={side}
              label={side === 'left' ? 'Map A' : 'Map B'}
              overlay={overlay}
              phase={phase}
              isForgedGuess={isForgedGuess}
              isUserRealSide={isUserRealSide}
              onMarkForged={() => {
                setForgedGuess(side);
                setOriginPin(null);
              }}
              onMapClick={
                phase === 'playing' && isUserRealSide
                  ? (coord) => setOriginPin(coord)
                  : undefined
              }
              pin={isUserRealSide ? originPin : null}
              originMarker={
                phase === 'revealed' && side === round.realSide
                  ? round.mapSet.trueOrigin
                  : null
              }
              revealLabel={revealLabel}
              forgedGuessCorrect={result?.forgedCorrect}
            />
          );
        })}
      </div>

      {/* Playing controls */}
      {phase === 'playing' && (
        <div className="flex items-center gap-3">
          <div className="flex-1 text-sm text-gray-500">
            {!forgedGuess
              ? 'Click "Mark as Forged" under the map you think contains an impossible distribution.'
              : !originPin
                ? 'Now click on Map ' +
                  (userRealSide === 'left' ? 'A' : 'B') +
                  ' to drop a pin at the language\'s true origin.'
                : 'Pin placed. Lock your answer or move the pin by clicking again.'}
          </div>
          <button
            disabled={!forgedGuess}
            onClick={lockAnswer}
            className="shrink-0 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Lock Answer
          </button>
        </div>
      )}

      {/* Reveal */}
      {phase === 'revealed' && result && (
        <ResultCard
          result={result}
          sessionScore={sessionScore}
          roundNumber={roundNumber}
          onNext={nextRound}
          onSettings={() => setPhase('settings')}
        />
      )}
    </div>
  );
}
