'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useScriptBlitz } from '@/hooks/useScriptBlitz';
import { checkAnswer, BLITZ_TIME_LIMIT, BLITZ_QUESTION_LIMIT } from '@/lib/practice/scriptBlitzEngine';
import type { ScriptBlitzConfig, ScriptBlitzAnswerResult } from '@/types/practice';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTextSize(text: string): string {
  if (text.length <= 4)  return 'text-7xl md:text-8xl';
  if (text.length <= 10) return 'text-5xl md:text-6xl';
  if (text.length <= 20) return 'text-3xl md:text-4xl';
  return 'text-2xl md:text-3xl';
}

function formatScore(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// ─── Settings panel ───────────────────────────────────────────────────────────

type CategoryOption = ScriptBlitzConfig['category'];
type DifficultyOption = ScriptBlitzConfig['difficulty'];

const CATEGORIES: { value: CategoryOption; label: string; hint: string }[] = [
  { value: 'mixed',    label: 'Mixed',     hint: 'All three types' },
  { value: 'script',   label: 'Scripts',   hint: 'Writing system ID' },
  { value: 'language', label: 'Languages', hint: 'Identify the language' },
  { value: 'surname',  label: 'Surnames',  hint: 'Country of origin' },
];

const DIFFICULTIES: { value: DifficultyOption; label: string; hint: string }[] = [
  { value: 'mixed',  label: 'Mixed',  hint: 'All difficulties' },
  { value: 'easy',   label: 'Easy',   hint: 'Distinctive & common' },
  { value: 'medium', label: 'Medium', hint: 'Some knowledge needed' },
  { value: 'hard',   label: 'Hard',   hint: 'Closely related' },
];

function SettingsPanel({ onStart }: { onStart: (c: ScriptBlitzConfig) => void }) {
  const [category, setCategory]     = useState<CategoryOption>('mixed');
  const [difficulty, setDifficulty] = useState<DifficultyOption>('mixed');

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-7"
    >
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Practice Mode</p>
        <h1 className="mt-1 text-2xl font-extrabold text-gray-900">Origin Blitz</h1>
        <p className="mt-2 text-sm text-gray-500">
          Identify scripts, languages, and surname origins at lightning speed. Type fast, score big.
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Category</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`rounded-xl border-2 p-3 text-left transition-colors ${
                category === c.value
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
              }`}
            >
              <p className="font-semibold text-gray-900">{c.label}</p>
              <p className="text-xs text-gray-400">{c.hint}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Difficulty</p>
        <div className="grid grid-cols-2 gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={`rounded-xl border-2 p-3 text-left transition-colors ${
                difficulty === d.value
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
              }`}
            >
              <p className="font-semibold text-gray-900">{d.label}</p>
              <p className="text-xs text-gray-400">{d.hint}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-700">
        <p className="font-semibold">How to play</p>
        <ul className="mt-1 space-y-0.5 text-brand-600">
          <li>• <span className="font-medium">Scripts</span> — name the writing system (e.g. "Cyrillic")</li>
          <li>• <span className="font-medium">Languages</span> — name the language (e.g. "Finnish")</li>
          <li>• <span className="font-medium">Surnames</span> — name the country (e.g. "Japan")</li>
          <li>• Press Enter to submit. Faster = more points. Streak = bonus.</li>
        </ul>
      </div>

      <button
        onClick={() => onStart({ mode: 'script_blitz', category, difficulty })}
        className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
      >
        Start Origin Blitz
      </button>
    </motion.div>
  );
}

// ─── Intro panel ──────────────────────────────────────────────────────────────

function IntroPanel({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 1600);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Origin Blitz</p>
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="text-3xl font-extrabold text-brand-600"
      >
        Get Ready!
      </motion.p>
      <p className="text-sm text-gray-400">Scripts · Languages · Surname Origins</p>
    </motion.div>
  );
}

// ─── Arcade game panel ────────────────────────────────────────────────────────

interface ArcadeProps {
  onEnd: () => void;
}

function ArcadePanel({ onEnd }: ArcadeProps) {
  const blitz = useScriptBlitz();
  const inputRef  = useRef<HTMLInputElement>(null);
  const advancedRef = useRef(false);

  const [inputValue, setInputValue] = useState('');
  const [shake, setShake]           = useState(false);
  // Track popup per answer to re-trigger the animation each time
  const [popup, setPopup] = useState<{ key: number; points: number } | null>(null);

  const q          = blitz.currentQuestion;
  const lastResult = blitz.lastResult;
  const timerPct   = (blitz.timeRemaining / BLITZ_TIME_LIMIT) * 100;
  const danger     = blitz.timeRemaining <= 4;

  // Focus input at start of each question
  useEffect(() => {
    if (blitz.phase === 'question') {
      setInputValue('');
      inputRef.current?.focus();
      advancedRef.current = false;
    }
  }, [blitz.phase, blitz.poolIndex]);

  // Show score popup when a correct answer lands
  useEffect(() => {
    if (blitz.phase === 'feedback' && lastResult?.correct) {
      setPopup({ key: Date.now(), points: lastResult.pointsEarned });
    }
  }, [blitz.phase, blitz.poolIndex, lastResult?.correct, lastResult?.pointsEarned]);

  // Auto-advance after brief feedback pause
  useEffect(() => {
    if (blitz.phase !== 'feedback' || advancedRef.current) return;
    const delay = lastResult?.correct ? 700 : lastResult?.timedOut ? 2200 : 1000;
    const id = setTimeout(() => {
      if (advancedRef.current) return;
      advancedRef.current = true;
      blitz.advanceQuestion();
    }, delay);
    return () => clearTimeout(id);
  }, [blitz.phase, blitz.poolIndex, lastResult, blitz.advanceQuestion]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (blitz.phase !== 'question') return;
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || blitz.phase !== 'question' || !q) return;
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (checkAnswer(inputValue, q)) {
      blitz.submitAnswer(inputValue);
      setInputValue('');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setInputValue('');
    }
  };

  const cardBorder =
    blitz.phase === 'feedback' && lastResult?.correct
      ? 'border-green-300 bg-green-50'
      : blitz.phase === 'feedback' && (lastResult?.timedOut || lastResult?.skipped)
      ? 'border-gray-300 bg-gray-50'
      : 'border-gray-100 bg-white';

  return (
    <div className="flex h-full flex-col">
      {/* ── Top stats ──────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between">
        {/* Score + streak */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Score</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={blitz.score}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-xl font-extrabold tabular-nums text-brand-700"
              >
                {formatScore(blitz.score)}
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {blitz.streak >= 2 && (
              <motion.div
                key={blitz.streak}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-full bg-orange-100 px-3 py-1 text-center"
              >
                <p className="text-sm font-extrabold text-orange-600">{blitz.streak}×</p>
                <p className="text-xs text-orange-400">streak</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accuracy + controls */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Accuracy</p>
            <p className="text-xl font-extrabold tabular-nums text-gray-700">{blitz.accuracy}%</p>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={blitz.togglePause}
              title={blitz.isPaused ? 'Resume' : 'Pause'}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
            >
              {blitz.isPaused ? (
                // Play icon
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                </svg>
              ) : (
                // Pause icon
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                </svg>
              )}
            </button>

            <button
              onClick={blitz.skipQuestion}
              disabled={blitz.phase !== 'question'}
              title="Skip this question"
              className="flex h-8 items-center px-2 rounded-lg border border-gray-200 text-xs text-gray-400 hover:border-gray-300 hover:text-gray-600 disabled:opacity-30"
            >
              Skip
            </button>

            <button
              onClick={onEnd}
              title="End session and see stats"
              className="flex h-8 items-center px-2 rounded-lg border border-red-100 text-xs text-red-400 hover:border-red-300 hover:text-red-600"
            >
              End
            </button>
          </div>
        </div>
      </div>

      {/* ── Main card ──────────────────────────────────────────────────── */}
      <div
        className={`relative flex flex-1 flex-col items-center justify-center gap-6 rounded-2xl border-2 px-6 py-8 shadow-sm transition-colors duration-300 ${cardBorder}`}
        style={{ minHeight: 280 }}
      >
        {/* Score popup */}
        <AnimatePresence>
          {popup && (
            <motion.div
              key={popup.key}
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], y: -40, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 text-2xl font-extrabold text-green-500"
            >
              +{popup.points}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause overlay */}
        {blitz.isPaused && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/95">
            <p className="text-4xl font-extrabold text-gray-300">Paused</p>
            <button
              onClick={blitz.togglePause}
              className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
            >
              Resume
            </button>
          </div>
        )}

        {/* Category label */}
        <AnimatePresence mode="wait">
          {q && (
            <motion.p
              key={`lbl-${blitz.poolIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-semibold uppercase tracking-widest text-gray-400"
            >
              {q.category === 'script'
                ? 'What script is this?'
                : q.category === 'language'
                ? 'What language is this?'
                : 'What country is this surname from?'}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Large display text */}
        <AnimatePresence mode="wait">
          {q && (
            <motion.p
              key={`txt-${blitz.poolIndex}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={`${getTextSize(q.displayText)} text-center font-bold leading-tight text-gray-900`}
              style={{ fontFamily: 'system-ui, "Segoe UI", sans-serif' }}
            >
              {q.displayText}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Feedback message (overlays input area) */}
        <AnimatePresence mode="wait">
          {blitz.phase === 'feedback' && lastResult && (
            <motion.div
              key={`fb-${blitz.poolIndex}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-1 text-center"
            >
              {lastResult.correct ? (
                <>
                  <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-bold text-green-700">
                    Correct! +{lastResult.pointsEarned} pts
                  </span>
                  {lastResult.streakBonus && (
                    <span className="text-xs font-semibold text-orange-500">Streak bonus!</span>
                  )}
                </>
              ) : lastResult.timedOut ? (
                <>
                  <span className="rounded-full bg-gray-200 px-4 py-1 text-sm font-bold text-gray-600">
                    Time&apos;s up
                  </span>
                  <p className="mt-1 text-sm text-gray-500">
                    Answer:{' '}
                    <span className="font-bold text-gray-800">{lastResult.correctAnswer}</span>
                  </p>
                  {q?.hint && (
                    <p className="mt-0.5 max-w-xs text-xs text-gray-400">{q.hint}</p>
                  )}
                </>
              ) : lastResult.skipped ? (
                <>
                  <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm font-bold text-yellow-700">
                    Skipped
                  </span>
                  <p className="mt-1 text-sm text-gray-500">
                    Answer:{' '}
                    <span className="font-bold text-gray-800">{lastResult.correctAnswer}</span>
                  </p>
                </>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input field — visible only during question phase */}
        {blitz.phase === 'question' && (
          <motion.div
            className="w-full max-w-sm"
            animate={shake ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
            transition={{ duration: 0.35 }}
          >
            <input
              ref={inputRef}
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type and press Enter…"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-center text-base font-semibold text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-brand-400 focus:bg-white"
            />
            <p className="mt-1.5 text-center text-xs text-gray-400">
              Press{' '}
              <kbd className="rounded border border-gray-300 bg-gray-100 px-1 py-0.5 font-mono text-xs">
                Enter
              </kbd>{' '}
              to submit
            </p>
          </motion.div>
        )}
      </div>

      {/* ── Timer bar ──────────────────────────────────────────────────── */}
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className={danger ? 'font-bold text-red-500' : 'text-gray-400'}>
            {blitz.isPaused ? 'Paused' : `${blitz.timeRemaining}s`}
          </span>
          <span className="text-gray-400">{blitz.totalAnswered} / {BLITZ_QUESTION_LIMIT}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
              blitz.phase !== 'question' || blitz.isPaused
                ? danger ? 'bg-red-500' : 'bg-brand-500'
                : danger ? 'bg-red-500' : 'bg-brand-500'
            }`}
            style={{
              width: blitz.phase === 'question' && !blitz.isPaused ? `${timerPct}%` : `${timerPct}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── History panel ────────────────────────────────────────────────────────────

function HistoryPanel({
  history,
  onClose,
}: {
  history: ScriptBlitzAnswerResult[];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute inset-0 z-20 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Answer History</h2>
        <button
          onClick={onClose}
          className="text-sm text-gray-400 hover:text-gray-700"
        >
          Close
        </button>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-gray-400">No answers yet.</p>
      ) : (
        <div className="space-y-2">
          {[...history].reverse().map((r, i) => (
            <div
              key={i}
              className={`flex items-start justify-between rounded-xl p-3 ${
                r.correct ? 'bg-green-50' : r.skipped ? 'bg-yellow-50' : 'bg-red-50'
              }`}
            >
              <div className="min-w-0">
                <p
                  className="text-lg font-medium text-gray-800 leading-tight"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {r.displayText}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {r.correct
                    ? `Correct — "${r.typedAnswer}"`
                    : r.skipped
                    ? 'Skipped'
                    : r.timedOut
                    ? 'Timed out'
                    : `Wrong — typed "${r.typedAnswer}"`}
                </p>
                {!r.correct && (
                  <p className="text-xs font-semibold text-gray-700">
                    Answer: {r.correctAnswer}
                  </p>
                )}
              </div>
              <span
                className={`ml-3 flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                  r.correct ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {r.correct ? `+${r.pointsEarned}` : '0'}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Complete panel ───────────────────────────────────────────────────────────

const TIERS = [
  { min: 90, label: 'Script Master',  color: 'text-yellow-600' },
  { min: 75, label: 'Linguist',       color: 'text-brand-600' },
  { min: 55, label: 'Apprentice',     color: 'text-green-600' },
  { min: 35, label: 'Student',        color: 'text-gray-700' },
  { min: 0,  label: 'Beginner',       color: 'text-gray-500' },
] as const;

interface CompleteProps {
  stats: { score: number; correctCount: number; totalAnswered: number; maxStreak: number };
  history: ScriptBlitzAnswerResult[];
  onPlayAgain: () => void;
}

function CompletePanel({ stats, history, onPlayAgain }: CompleteProps) {
  const [showHistory, setShowHistory] = useState(false);
  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.correctCount / stats.totalAnswered) * 100)
      : 0;
  const tier = TIERS.find((t) => accuracy >= t.min) ?? TIERS[4];

  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
    >
      <AnimatePresence>
        {showHistory && (
          <HistoryPanel
            history={history}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Session Complete
        </p>
        <p className={`mt-1 text-lg font-extrabold ${tier.color}`}>{tier.label}</p>

        <div className="my-6">
          <p className="text-5xl font-extrabold tabular-nums text-gray-900">
            {stats.score.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-gray-400">points</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-2xl font-extrabold text-gray-900">{accuracy}%</p>
            <p className="mt-0.5 text-xs text-gray-400">Accuracy</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-2xl font-extrabold text-gray-900">
              {stats.correctCount}/{stats.totalAnswered}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">Correct</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-2xl font-extrabold text-gray-900">{stats.maxStreak}</p>
            <p className="mt-0.5 text-xs text-gray-400">Best streak</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={onPlayAgain}
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          Play Again
        </button>
        {history.length > 0 && (
          <button
            onClick={() => setShowHistory(true)}
            className="w-full rounded-xl border-2 border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300"
          >
            View Answer History
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export function ScriptBlitzGame() {
  const blitz = useScriptBlitz();

  const handleEnd = useCallback(() => blitz.endSession(), [blitz.endSession]);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <AnimatePresence mode="wait">
        {blitz.phase === 'settings' && (
          <SettingsPanel key="settings" onStart={blitz.startSession} />
        )}

        {blitz.phase === 'intro' && (
          <IntroPanel key="intro" onDone={blitz.startQuestion} />
        )}

        {(blitz.phase === 'question' || blitz.phase === 'feedback') && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
            style={{ minHeight: 480 }}
          >
            <ArcadePanel onEnd={handleEnd} />
          </motion.div>
        )}

        {blitz.phase === 'complete' && (
          <CompletePanel
            key="complete"
            stats={blitz.stats}
            history={blitz.history}
            onPlayAgain={blitz.resetSession}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
