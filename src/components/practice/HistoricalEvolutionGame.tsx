'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePractice } from '@/hooks';
import { PracticeHUD } from './PracticeHUD';
import { QuestionCard } from './QuestionCard';
import { ResultFeedback } from './ResultFeedback';
import { PracticeComplete } from './PracticeComplete';
import type { PracticeConfig, PracticeDifficulty, PracticeQuestionCount } from '@/types/practice';

// ─── Settings panel ───────────────────────────────────────────────────────────

const DIFFICULTIES: { value: PracticeDifficulty; label: string; hint: string }[] = [
  { value: 'easy', label: 'Easy', hint: '20 s · ×1 pts' },
  { value: 'medium', label: 'Medium', hint: '15 s · ×1.5 pts' },
  { value: 'hard', label: 'Hard', hint: '12 s · ×2 pts' },
  { value: 'mixed', label: 'Mixed', hint: 'All difficulties' },
];

const COUNTS: PracticeQuestionCount[] = [5, 10, 15, 20];

interface SettingsPanelProps {
  onStart: (config: PracticeConfig) => void;
}

function SettingsPanel({ onStart }: SettingsPanelProps) {
  const [difficulty, setDifficulty] = useState<PracticeDifficulty>('mixed');
  const [questionCount, setQuestionCount] = useState<PracticeQuestionCount>(10);

  const handleStart = () => {
    onStart({ mode: 'historical_evolution', difficulty, questionCount });
  };

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
        <h1 className="mt-1 text-2xl font-extrabold text-gray-900">Historical Evolution Battles</h1>
        <p className="mt-2 text-sm text-gray-500">
          How well do you know the origins of everyday English words?
        </p>
      </div>

      {/* Difficulty */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Difficulty
        </p>
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

      {/* Question count */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Questions
        </p>
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
        onClick={handleStart}
        className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
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
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        Historical Evolution Battles
      </p>
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="text-3xl font-extrabold text-brand-600"
      >
        Get Ready!
      </motion.p>
      <p className="text-sm text-gray-400">Select the correct etymology for each word</p>
    </motion.div>
  );
}

// ─── Main game ────────────────────────────────────────────────────────────────

export function HistoricalEvolutionGame() {
  const practice = usePractice();
  // Track whether advanceQuestion has already been called for this feedback phase
  // to prevent double-firing from both the "Next" button and the countdown bar.
  const advancedRef = useRef(false);

  useEffect(() => {
    advancedRef.current = false;
  }, [practice.currentIndex, practice.phase]);

  const safeAdvance = () => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    practice.advanceQuestion();
  };

  const isLastQuestion =
    practice.currentIndex === practice.totalQuestions - 1;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <AnimatePresence mode="wait">
        {practice.phase === 'settings' && (
          <SettingsPanel key="settings" onStart={practice.startSession} />
        )}

        {practice.phase === 'intro' && (
          <IntroPanel key="intro" onDone={practice.startQuestion} />
        )}

        {(practice.phase === 'question' || practice.phase === 'feedback') && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PracticeHUD
              score={practice.score}
              streak={practice.streak}
              correctCount={practice.correctCount}
              currentIndex={practice.currentIndex}
              totalQuestions={practice.totalQuestions}
              timeRemaining={practice.timeRemaining}
              timeLimit={practice.timeLimit}
              phase={practice.phase}
            />

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <AnimatePresence mode="wait">
                {practice.phase === 'question' && practice.currentQuestion && (
                  <QuestionCard
                    key={`q-${practice.currentIndex}`}
                    question={practice.currentQuestion}
                    onAnswer={practice.submitAnswer}
                  />
                )}

                {practice.phase === 'feedback' && practice.lastResult && (
                  <ResultFeedback
                    key={`f-${practice.currentIndex}`}
                    result={practice.lastResult}
                    isLast={isLastQuestion}
                    onNext={safeAdvance}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {practice.phase === 'complete' && (
          <div key="complete" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <PracticeComplete
              stats={practice.stats}
              onPlayAgain={practice.resetSession}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
