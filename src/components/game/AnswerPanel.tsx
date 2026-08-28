'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Button, Input } from '@/components/ui';
import { CHOICE_BASED_MODES } from '@/lib/constants/game';
import type { Match } from '@/types';

interface AnswerPanelProps {
  match: Match;
  onSubmit: (answer: string) => void;
  onSurrender: () => void;
}

export function AnswerPanel({ match, onSubmit, onSurrender }: AnswerPanelProps) {
  const [text, setText] = useState('');
  const [answered, setAnswered] = useState(false);
  const round = match.currentRound;

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
              className="text-left"
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
          className="flex-1"
        />
        <Button type="submit" disabled={answered || !text.trim()}>
          Submit
        </Button>
      </form>
      {surrenderButton}
    </div>
  );
}


