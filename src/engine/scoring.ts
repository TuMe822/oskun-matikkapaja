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

export function summarize(attempts: readonly Attempt[]): Summary {
  return attempts.reduce<Summary>(
    (sum, attempt) => ({
      total: sum.total + 1,
      correct: sum.correct + (attempt.correct ? 1 : 0),
      points: sum.points + pointsFor(attempt),
      timeMs: sum.timeMs + attempt.timeMs,
    }),
    { total: 0, correct: 0, points: 0, timeMs: 0 },
  )
}
