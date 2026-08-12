'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Button, Input } from '@/components/ui';
import { CHOICE_BASED_MODES } from '@/lib/constants/game';
import type { Match } from '@/types';

interface AnswerPanelProps {
  match: Match;
  onSubmit: (answer: string) => void;
}

// Branches on mode: forgery/historical_evolution are multiple-choice
// (Round.options), city_country/script_blitz are free-text — same split the
// single-player engines already use (src/lib/practice/*Engine.ts).
export function AnswerPanel({ match, onSubmit }: AnswerPanelProps) {
  const [text, setText] = useState('');
  const [answered, setAnswered] = useState(false);
  const round = match.currentRound;

  // Reset per round rather than relying on lastAnswerResult's timing, so the
  // panel unlocks the instant a new round starts, not when the 2s feedback
  // auto-clear fires.
  useEffect(() => {
    setText('');
    setAnswered(false);
  }, [round?.id]);

  if (!round || match.phase !== 'active') return null;

  const submit = (answer: string) => {
    if (answered || !answer.trim()) return;
    setAnswered(true);
    onSubmit(answer);
  };

  if (CHOICE_BASED_MODES.includes(round.mode)) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(round.options ?? []).map((option) => (
          <Button
            key={option}
            variant="secondary"
            disabled={answered}
            onClick={() => submit(option)}
            className="text-left"
          >
            {option}
          </Button>
        ))}
      </div>
    );
  }

  const handleTextSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(text);
  };

  return (
    <form onSubmit={handleTextSubmit} className="flex gap-3">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your answer…"
        disabled={answered}
        autoFocus
        className="flex-1"
      />
      <Button type="submit" disabled={answered || !text.trim()}>
        Submit
      </Button>
    </form>
  );
}
