export interface Problem {
  /** Multiplier: the 3 in "3 × 7" */
  a: number
  /** Times table: the 7 in "3 × 7" */
  b: number
  answer: number
}

export interface Attempt {
  problem: Problem
  /** Parsed answer */
  given: number
  correct: boolean
  hintsUsed: number
  /** 1 for the first try, 2 for a retry */
  tryNumber: number
  /** Last try for this problem: the problem is either solved or revealed */
  final: boolean
  /** Time from showing the problem (or the previous try) to answering */
  timeMs: number
  /** Epoch ms; needed later for learning tracking and spaced repetition */
  answeredAt: number
}

/** Returns a number in [0, 1), like Math.random */
export type Random = () => number

/**
 * Chooses the next problem. The basic picker ignores the history;
 * adaptive practice will implement the same interface and use it.
 */
export interface Picker {
  next(history: readonly Attempt[]): Problem
}
