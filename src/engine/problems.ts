import type { Problem } from './types'

export const MIN_TABLE = 1
export const MAX_TABLE = 10
export const MAX_FACTOR = 10

export function createProblem(a: number, b: number): Problem {
  return { a, b, answer: a * b }
}

export function problemKey(problem: Pick<Problem, 'a' | 'b'>): string {
  return `${problem.a}x${problem.b}`
}

/** All problems of the given tables, e.g. 7 → 1 × 7 … 10 × 7 */
export function problemsFor(tables: readonly number[]): Problem[] {
  const unique = [...new Set(tables)]
  if (unique.length === 0) throw new RangeError('At least one table is required')
  for (const table of unique) {
    if (!Number.isInteger(table) || table < MIN_TABLE || table > MAX_TABLE) {
      throw new RangeError(`Table must be an integer ${MIN_TABLE}–${MAX_TABLE}, got ${table}`)
    }
  }
  return unique.flatMap((table) =>
    Array.from({ length: MAX_FACTOR }, (_, i) => createProblem(i + 1, table)),
  )
}
