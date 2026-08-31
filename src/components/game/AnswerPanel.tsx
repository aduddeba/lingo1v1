'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Button, Input } from '@/components/ui';
import { CHOICE_BASED_MODES } from '@/lib/constants/game';
import type { AnswerResult, Match } from '@/types';

interface AnswerPanelProps {
  match: Match;
  lastAnswerResult: AnswerResult | null;
  onSubmit: (answer: string) => void;
  onSurrender: () => void;
}

export function AnswerPanel({ match, lastAnswerResult, onSubmit, onSurrender }: AnswerPanelProps) {
  const [text, setText] = useState('');
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const round = match.currentRound;

  useEffect(() => {
    setText('');
    setAnswered(false);
    setSelectedAnswer(null);
  }, [round?.id]);

  if (!round || match.phase !== 'active') return null;

  const submit = (answer: string) => {
    if (answered || !answer.trim()) return;
    setAnswered(true);
    setSelectedAnswer(answer);
    onSubmit(answer);
  };

  const feedbackClass =
    answered && lastAnswerResult
      ? lastAnswerResult.correct
        ? 'border-2 border-green-500 bg-green-50 text-green-800 focus:border-green-500 focus:ring-green-500 disabled:opacity-100'
        : 'border-2 border-red-500 bg-red-50 text-red-800 focus:border-red-500 focus:ring-red-500 disabled:opacity-100'
      : '';

  const surrenderButton = (
    <Button variant="danger" onClick={onSurrender} className="mx-auto mt-8 w-36">
      Surrender
    </Button>
  );

  if (CHOICE_BASED_MODES.includes(round.mode)) {
    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(round.options ?? []).map((option) => (
            <Button
              key={option}
              variant="secondary"
              disabled={answered}
              onClick={() => submit(option)}
              className={option === selectedAnswer ? `text-left ${feedbackClass}` : 'text-left'}
            >
              {option}
            </Button>
          ))}
        </div>
        {surrenderButton}
      </div>
    );
  }

  const handleTextSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(text);
  };

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleTextSubmit} className="flex gap-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your answer..."
          disabled={answered}
          autoFocus
          className={`flex-1 ${feedbackClass}`}
        />
        <Button type="submit" disabled={answered || !text.trim()}>
          Submit
        </Button>
      </form>
      {surrenderButton}
    </div>
  );
}


