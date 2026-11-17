import type { Problem } from './types'

export type Hint =
  /** 3 × 7 → 7 + 7 + 7 */
  | { level: 1; kind: 'repeat'; terms: number[] }
  /** A neighbouring fact: 2 × 7 = 14, add 7 (or 2 × 7 = 14, take away 7 for 1 × 7) */
  | { level: 2; kind: 'neighbour'; a: number; product: number; adjust: 'add' | 'subtract' }
  /** Count in steps of b up to (a − 1) × b; the child says the next one */
  | { level: 3; kind: 'count'; steps: number[] }

/** Hint data only: the UI turns it into words in the chosen language */
export function hintFor(problem: Problem, level: number): Hint | null {
  const { a, b } = problem
  if (level < 1) return null
  if (level === 1) return { level: 1, kind: 'repeat', terms: Array.from({ length: a }, () => b) }
  if (level === 2) {
    return a > 1
      ? { level: 2, kind: 'neighbour', a: a - 1, product: (a - 1) * b, adjust: 'add' }
      : { level: 2, kind: 'neighbour', a: 2, product: 2 * b, adjust: 'subtract' }
  }
  return { level: 3, kind: 'count', steps: Array.from({ length: a - 1 }, (_, i) => (i + 1) * b) }
}
