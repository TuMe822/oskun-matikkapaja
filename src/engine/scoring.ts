import type { Attempt } from './types'

export const MAX_HINTS = 3

// Points for a correct answer by hints used: 0, 1, 2, 3
const POINTS = [10, 7, 5, 3]

export function pointsFor(attempt: Pick<Attempt, 'correct' | 'hintsUsed'>): number {
  if (!attempt.correct) return 0
  return POINTS[Math.min(attempt.hintsUsed, MAX_HINTS)] ?? 0
}

export interface Summary {
  total: number
  correct: number
  points: number
  timeMs: number
}

// Counts problems, not tries: a retry that ends correct is one correct problem
export function summarize(attempts: readonly Attempt[]): Summary {
  return attempts.reduce<Summary>(
    (sum, attempt) => ({
      total: sum.total + (attempt.final ? 1 : 0),
      correct: sum.correct + (attempt.final && attempt.correct ? 1 : 0),
      points: sum.points + (attempt.final ? pointsFor(attempt) : 0),
      timeMs: sum.timeMs + attempt.timeMs,
    }),
    { total: 0, correct: 0, points: 0, timeMs: 0 },
  )
}
