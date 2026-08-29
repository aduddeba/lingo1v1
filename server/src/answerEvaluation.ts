export type AnswerSpecificityLevel = 'incorrect' | 'broad' | 'specific' | 'preferred';

export interface AcceptedAnswer {
  value: string;
  specificity: Exclude<AnswerSpecificityLevel, 'incorrect'>;
}

export interface AnswerEvaluation {
  correct: boolean;
  specificityLevel: AnswerSpecificityLevel;
  specificityPoints: 0 | 1 | 2 | 3;
  matchedAnswer?: string;
}

const SPECIFICITY_POINTS: Record<AnswerSpecificityLevel, 0 | 1 | 2 | 3> = {
  incorrect: 0,
  broad: 1,
  specific: 2,
  preferred: 3,
};

export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function evaluateAnswer(
  acceptedAnswers: readonly AcceptedAnswer[],
  submittedAnswer: string
): AnswerEvaluation {
  const normalizedSubmission = normalizeAnswer(submittedAnswer);
  if (!normalizedSubmission) {
    return { correct: false, specificityLevel: 'incorrect', specificityPoints: 0 };
  }

  for (const acceptedAnswer of acceptedAnswers) {
    if (normalizeAnswer(acceptedAnswer.value) === normalizedSubmission) {
      return {
        correct: true,
        specificityLevel: acceptedAnswer.specificity,
        specificityPoints: SPECIFICITY_POINTS[acceptedAnswer.specificity],
        matchedAnswer: acceptedAnswer.value,
      };
    }
  }

  return { correct: false, specificityLevel: 'incorrect', specificityPoints: 0 };
}

export function scalePointsBySpecificity(points: number, evaluation: AnswerEvaluation): number {
  if (!evaluation.correct) return 0;
  return Math.round((points * evaluation.specificityPoints) / SPECIFICITY_POINTS.preferred);
}
