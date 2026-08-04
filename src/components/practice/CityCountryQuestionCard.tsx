'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { CityCountryQuestion } from '@/types/practice';

interface CityCountryQuestionCardProps {
  question: CityCountryQuestion;
  onAnswer: (answer: string) => void;
}

export function CityCountryQuestionCard({ question, onAnswer }: CityCountryQuestionCardProps) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (submittedRef.current || !value.trim()) return;
    submittedRef.current = true;
    setSubmitted(true);
    onAnswer(value.trim());
  };

  // Reset + focus for each new question
  useEffect(() => {
    submittedRef.current = false;
    setSubmitted(false);
    setValue('');
    inputRef.current?.focus();
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

      {/* City name */}
      <div className="mb-6 flex flex-col items-center gap-1 rounded-xl border-2 border-brand-400 bg-brand-50 px-4 py-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">City</p>
        <p className="text-3xl font-extrabold text-brand-700">{question.city}</p>
      </div>

      {/* ── Text input ── */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          disabled={submitted}
          placeholder="Type the country…"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 outline-none transition-colors focus:border-brand-400 disabled:opacity-40"
        />
        <button
          onClick={handleSubmit}
          disabled={submitted || !value.trim()}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Submit
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-gray-300">Press Enter to submit</p>
    </motion.div>
  );
}
