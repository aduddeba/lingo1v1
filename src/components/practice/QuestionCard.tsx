'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import type { PracticeQuestion, ChainStage } from '@/types/practice';

const LABELS: Record<number, string> = { 0: 'A', 1: 'B', 2: 'C', 3: 'D' };
const KEY_TO_INDEX: Record<string, number> = {
  a: 0, b: 1, c: 2, d: 3,
  '1': 0, '2': 1, '3': 2, '4': 3,
};

const ChainArrow = () => (
  <div className="flex flex-col items-center py-1">
    <div className="h-4 w-px bg-gray-300" />
    <svg width="10" height="6" viewBox="0 0 10 6" className="text-gray-400" fill="currentColor">
      <path d="M5 6L0 0h10L5 6z" />
    </svg>
  </div>
);

interface QuestionCardProps {
  question: PracticeQuestion;
  onAnswer: (answer: string) => void;
}

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedRef = useRef<string | null>(null);

  const handleSelect = (option: string) => {
    if (selectedRef.current !== null) return;
    selectedRef.current = option;
    setSelected(option);
    onAnswer(option);
  };

  // Keyboard shortcuts A–D / 1–4
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedRef.current !== null) return;
      const idx = KEY_TO_INDEX[e.key.toLowerCase()];
      if (idx === undefined) return;
      const option = question.options[idx];
      if (option) handleSelect(option);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.22 }}
    >
      {/* Prompt */}
      <p className="mb-5 text-sm font-medium leading-snug text-gray-600">
        {question.prompt}
      </p>

      {/* ── Chain ── */}
      {question.type === 'language_ancestry' ? (
        <LanguageAncestryChain chain={question.languageChain} hiddenIndex={question.hiddenIndex} />
      ) : (
        <WordFormChain chain={question.chain} hiddenIndex={question.hiddenIndex} />
      )}

      {/* ── Options ── */}
      <div className="grid grid-cols-2 gap-2">
        {question.options.map((option, i) => {
          const label = LABELS[i] ?? String.fromCharCode(65 + i);
          const isSelected = selected === option;

          return (
            <motion.button
              key={option}
              whileHover={selected === null ? { scale: 1.02 } : {}}
              whileTap={selected === null ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
              className={cn(
                'flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition-colors',
                selected === null &&
                  'cursor-pointer hover:border-brand-400 hover:bg-brand-50',
                isSelected
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-200 bg-white',
                selected !== null && !isSelected && 'cursor-default opacity-40'
              )}
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-500">
                {label}
              </span>
              <span className="font-semibold text-gray-800">{option}</span>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-gray-300">Press A · B · C · D to select</p>
    </motion.div>
  );
}

// ── Word-form chain (existing question type) ──────────────────────────────────

function WordFormChain({ chain, hiddenIndex }: { chain: ChainStage[]; hiddenIndex: number }) {
  return (
    <div className="mb-6 flex flex-col items-center gap-0">
      {chain.map((stage, i) => (
        <div key={i} className="flex w-full flex-col items-center">
          {i > 0 && <ChainArrow />}
          {i === hiddenIndex ? (
            <HiddenWordStage language={stage.language} />
          ) : (
            <VisibleWordStage stage={stage} />
          )}
        </div>
      ))}
    </div>
  );
}

function VisibleWordStage({ stage }: { stage: ChainStage }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
        {stage.language}
      </p>
      <p className="font-bold text-gray-900">{stage.form}</p>
      {stage.gloss && (
        <p className="mt-0.5 text-xs italic text-gray-400">{stage.gloss}</p>
      )}
    </div>
  );
}

function HiddenWordStage({ language }: { language: string }) {
  return (
    <motion.div
      animate={{ boxShadow: ['0 0 0 0px #0284c720', '0 0 0 4px #0284c720', '0 0 0 0px #0284c720'] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-full rounded-xl border-2 border-brand-400 bg-brand-50 px-4 py-3"
    >
      <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
        {language}
      </p>
      <motion.p
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="font-bold tracking-widest text-brand-500"
      >
        ???
      </motion.p>
      <p className="mt-0.5 text-xs text-brand-400">← predict this stage</p>
    </motion.div>
  );
}

// ── Language ancestry chain (new question type) ───────────────────────────────

function LanguageAncestryChain({ chain, hiddenIndex }: { chain: string[]; hiddenIndex: number }) {
  return (
    <div className="mb-6 flex flex-col items-center gap-0">
      {chain.map((lang, i) => (
        <div key={i} className="flex w-full flex-col items-center">
          {i > 0 && <ChainArrow />}
          {i === hiddenIndex ? (
            <HiddenLanguageStage />
          ) : (
            <VisibleLanguageStage language={lang} />
          )}
        </div>
      ))}
    </div>
  );
}

function VisibleLanguageStage({ language }: { language: string }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center">
      <p className="font-bold text-gray-900">{language}</p>
    </div>
  );
}

function HiddenLanguageStage() {
  return (
    <motion.div
      animate={{ boxShadow: ['0 0 0 0px #0284c720', '0 0 0 4px #0284c720', '0 0 0 0px #0284c720'] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-full rounded-xl border-2 border-brand-400 bg-brand-50 px-4 py-3 text-center"
    >
      <motion.p
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="text-lg font-extrabold tracking-widest text-brand-500"
      >
        ???
      </motion.p>
      <p className="mt-0.5 text-xs text-brand-400">← predict this language</p>
    </motion.div>
  );
}

