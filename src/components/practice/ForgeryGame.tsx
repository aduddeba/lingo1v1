'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForgery } from '@/hooks/useForgery';
import { PracticeHUD } from './PracticeHUD';
import { PracticeComplete } from './PracticeComplete';
import { ForgeryQuestionCard } from './ForgeryQuestionCard';
import { ForgeryFeedback } from './ForgeryFeedback';
import { FORGERY_REGIONS, ALL_REGION_IDS } from '@/lib/practice/forgeryEngine';
import type { ForgeryConfig, PracticeDifficulty, PracticeQuestionCount } from '@/types/practice';

// ─── Settings panel ───────────────────────────────────────────────────────────

const DIFFICULTIES: { value: PracticeDifficulty; label: string; hint: string }[] = [
  { value: 'easy', label: 'Easy', hint: '20 s · ×1 pts' },
  { value: 'medium', label: 'Medium', hint: '15 s · ×1.5 pts' },
  { value: 'hard', label: 'Hard', hint: '12 s · ×2 pts' },
  { value: 'mixed', label: 'Mixed', hint: 'All difficulties' },
];

const COUNTS: PracticeQuestionCount[] = [5, 10, 15, 20];

function SettingsPanel({ onStart }: { onStart: (config: ForgeryConfig) => void }) {
  const [difficulty, setDifficulty] = useState<PracticeDifficulty>('mixed');
  const [questionCount, setQuestionCount] = useState<PracticeQuestionCount>(10);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(ALL_REGION_IDS);

  const toggleRegion = (id: string) => {
    setSelectedRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const canStart = selectedRegions.length > 0;

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
        <h1 className="mt-1 text-2xl font-extrabold text-gray-900">Forgery</h1>
        <p className="mt-2 text-sm text-gray-500">
          One text is real. One is AI-generated. Can you tell the difference?
        </p>
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

      {/* Region filter */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Regions</p>
          <button
            onClick={() =>
              setSelectedRegions(
                selectedRegions.length === ALL_REGION_IDS.length ? [] : ALL_REGION_IDS
              )
            }
            className="text-xs text-brand-600 hover:text-brand-700"
          >
            {selectedRegions.length === ALL_REGION_IDS.length ? 'Deselect all' : 'Select all'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {FORGERY_REGIONS.map((region) => {
            const checked = selectedRegions.includes(region.id);
            return (
              <button
                key={region.id}
                onClick={() => toggleRegion(region.id)}
                className={`flex items-start gap-2.5 rounded-xl border-2 p-3 text-left transition-colors ${
                  checked
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
                }`}
              >
                {/* Checkbox indicator */}
                <div
                  className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    checked ? 'border-brand-500 bg-brand-500' : 'border-gray-300 bg-white'
                  }`}
                >
                  {checked && (
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 10 8">
                      <path
                        d="M1 4l3 3 5-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight text-gray-900">{region.label}</p>
                  <p className="mt-0.5 truncate text-xs text-gray-400">{region.hint}</p>
                </div>
              </button>
            );
          })}
        </div>
        {!canStart && (
          <p className="mt-2 text-xs text-red-500">Select at least one region to continue.</p>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Questions</p>
        <div className="flex gap-2">
          {COUNTS.map((n) => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-bold transition-colors ${
                questionCount === n
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 text-gray-500 hover:border-brand-300'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={!canStart}
        onClick={() => onStart({ mode: 'forgery', difficulty, questionCount, regions: selectedRegions })}
        className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Start Practice
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
      className="flex flex-col items-center justify-center gap-4 py-16 text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Forgery</p>
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="text-3xl font-extrabold text-brand-600"
      >
        Get Ready!
      </motion.p>
      <p className="text-sm text-gray-400">Pick the real language sample</p>
    </motion.div>
  );
}

// ─── Main game ────────────────────────────────────────────────────────────────

export function ForgeryGame() {
  const forgery = useForgery();
  const advancedRef = useRef(false);

  useEffect(() => {
    advancedRef.current = false;
  }, [forgery.currentIndex, forgery.phase]);

  const safeAdvance = () => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    forgery.advanceQuestion();
  };

  const isLastQuestion = forgery.currentIndex === forgery.totalQuestions - 1;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <AnimatePresence mode="wait">
        {forgery.phase === 'settings' && (
          <SettingsPanel key="settings" onStart={forgery.startSession} />
        )}

        {forgery.phase === 'intro' && (
          <IntroPanel key="intro" onDone={forgery.startQuestion} />
        )}

        {(forgery.phase === 'question' || forgery.phase === 'feedback') && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PracticeHUD
              score={forgery.score}
              streak={forgery.streak}
              correctCount={forgery.correctCount}
              currentIndex={forgery.currentIndex}
              totalQuestions={forgery.totalQuestions}
              timeRemaining={forgery.timeRemaining}
              timeLimit={forgery.timeLimit}
              phase={forgery.phase}
            />

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <AnimatePresence mode="wait">
                {forgery.phase === 'question' && forgery.currentQuestion && (
                  <ForgeryQuestionCard
                    key={`q-${forgery.currentIndex}`}
                    question={forgery.currentQuestion}
                    onAnswer={forgery.submitAnswer}
                  />
                )}

                {forgery.phase === 'feedback' && forgery.lastResult && (
                  <ForgeryFeedback
                    key={`f-${forgery.currentIndex}`}
                    result={forgery.lastResult}
                    isLast={isLastQuestion}
                    onNext={safeAdvance}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {forgery.phase === 'complete' && (
          <div key="complete" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <PracticeComplete
              stats={forgery.stats}
              onPlayAgain={forgery.resetSession}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
