'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import type { ForgeryQuestion } from '@/types/practice';

const LABELS = ['A', 'B'];
const KEY_TO_INDEX: Record<string, number> = {
  a: 0, b: 1, '1': 0, '2': 1,
};

interface ForgeryQuestionCardProps {
  question: ForgeryQuestion;
  onAnswer: (answer: string) => void;
}

export function ForgeryQuestionCard({ question, onAnswer }: ForgeryQuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedRef = useRef<string | null>(null);

  const handleSelect = (option: string) => {
    if (selectedRef.current !== null) return;
    selectedRef.current = option;
    setSelected(option);
    onAnswer(option);
  };

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
      {/* Language header */}
      <div className="mb-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {question.script}
        </p>
        <p className="mt-0.5 text-xl font-extrabold text-gray-900">{question.language}</p>
        <p className="mt-1 text-sm text-gray-500">Which sample is real?</p>
      </div>

      {/* Two text options */}
      <div className="flex flex-col gap-3">
        {question.options.map((text, i) => {
          const label = LABELS[i] ?? String.fromCharCode(65 + i);
          const isSelected = selected === text;

          return (
            <motion.button
              key={i}
              whileHover={selected === null ? { scale: 1.01 } : {}}
              whileTap={selected === null ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(text)}
              disabled={selected !== null}
              className={cn(
                'flex items-start gap-3 rounded-xl border-2 px-4 py-4 text-left transition-colors',
                selected === null && 'cursor-pointer hover:border-brand-400 hover:bg-brand-50',
                isSelected ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white',
                selected !== null && !isSelected && 'cursor-default opacity-40'
              )}
            >
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-500">
                {label}
              </span>
              <span className="text-base leading-relaxed text-gray-800">{text}</span>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-gray-300">Press A · B to select</p>
    </motion.div>
  );
}
