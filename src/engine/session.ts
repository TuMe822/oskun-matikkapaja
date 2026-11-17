import { parseAnswer } from './answer'
import { MAX_HINTS, pointsFor, summarize } from './scoring'
import type { Attempt, Picker, Problem } from './types'

export interface SessionOptions {
  picker: Picker
  /** Number of problems; leave out for an open-ended session (speed mode) */
  length?: number
  /** Tries per problem; with 2 a wrong first answer gets a retry */
  maxTries?: number
  /** Clock, injectable for tests */
  now?: () => number
}

export interface AnswerResult {
  attempt: Attempt
  points: number
  /** Wrong answer with a try left: the same problem stays */
  retry: boolean
  finished: boolean
}

// Plain object outside React: methods are called from event handlers,
// so StrictMode's double render cannot advance the session twice.
export function createSession({ picker, length, maxTries = 1, now = Date.now }: SessionOptions) {
  if (length !== undefined && (!Number.isInteger(length) || length < 1)) {
    throw new RangeError(`Session length must be a positive integer, got ${length}`)
  }
  if (!Number.isInteger(maxTries) || maxTries < 1) {
    throw new RangeError(`maxTries must be a positive integer, got ${maxTries}`)
  }

  const attempts: Attempt[] = []
  let current: Problem = picker.next(attempts)
  let shownAt = now()
  let hints = 0
  let tries = 0
  let solvedCount = 0
  let finished = false

  return {
    get current(): Problem {
      return current
    },
    get attempts(): readonly Attempt[] {
      return attempts
    },
    get hintsUsed(): number {
      return hints
    },
    get finished(): boolean {
      return finished
    },
    /** Problems done (solved or revealed) */
    get completed(): number {
      return solvedCount
    },

    /** Counts a hint for the current problem; returns the hint level 1–3 */
    requestHint(): number {
      if (!finished) hints = Math.min(hints + 1, MAX_HINTS)
      return hints
    },

    /** Returns null for input that is not a number: nothing is recorded */
    submit(input: string): AnswerResult | null {
      if (finished) throw new Error('Session is finished')
      const given = parseAnswer(input)
      if (given === null) return null

      const answeredAt = now()
      tries += 1
      const correct = given === current.answer
      const final = correct || tries >= maxTries
      const attempt: Attempt = {
        problem: current,
        given,
        correct,
        hintsUsed: hints,
        tryNumber: tries,
        final,
        timeMs: answeredAt - shownAt,
        answeredAt,
      }
      attempts.push(attempt)

      if (!final) {
        // Retry: same problem, hints kept, time measured from this answer
        shownAt = answeredAt
      } else {
        solvedCount += 1
        if (length !== undefined && solvedCount >= length) {
          finished = true
        } else {
          current = picker.next(attempts)
          shownAt = now()
          hints = 0
          tries = 0
        }
      }
      return { attempt, points: final ? pointsFor(attempt) : 0, retry: !final, finished }
    },

    /** Ends an open-ended session, or one the player quits */
    finish(): void {
      finished = true
    },

    summary() {
      return summarize(attempts)
    },
  }
}

export type Session = ReturnType<typeof createSession>
