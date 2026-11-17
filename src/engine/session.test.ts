import { describe, expect, it } from 'vitest'
import { createProblem } from './problems'
import { createSession } from './session'
import type { Picker } from './types'

// Always 3 × 7 = 21, so answers are predictable
const fixedPicker: Picker = { next: () => createProblem(3, 7) }

// Clock that moves forward by the given steps
const clock = (...times: number[]) => {
  let i = 0
  return () => times[Math.min(i++, times.length - 1)]
}

describe('createSession', () => {
  it('finishes after the given number of answers', () => {
    const session = createSession({ picker: fixedPicker, length: 3 })
    session.submit('21')
    session.submit('20')
    const last = session.submit('21')
    expect(last?.finished).toBe(true)
    expect(session.finished).toBe(true)
    expect(session.summary()).toMatchObject({ total: 3, correct: 2, points: 20 })
  })

  it('records nothing for input that is not a number', () => {
    const session = createSession({ picker: fixedPicker, length: 3 })
    expect(session.submit('')).toBeNull()
    expect(session.submit('abc')).toBeNull()
    expect(session.attempts).toHaveLength(0)
  })

  it('counts hints per problem, up to three', () => {
    const session = createSession({ picker: fixedPicker, length: 2 })
    session.requestHint()
    session.requestHint()
    session.requestHint()
    expect(session.requestHint()).toBe(3)
    const result = session.submit('21')
    expect(result?.points).toBe(3)
    expect(session.hintsUsed).toBe(0)
  })

  it('measures the answer time from when the problem was shown', () => {
    // shown at 1000, answered at 4500
    const session = createSession({ picker: fixedPicker, length: 1, now: clock(1000, 4500) })
    expect(session.submit('21')?.attempt.timeMs).toBe(3500)
  })

  it('runs until finished when no length is given', () => {
    const session = createSession({ picker: fixedPicker })
    for (let i = 0; i < 50; i++) session.submit('21')
    expect(session.finished).toBe(false)
    session.finish()
    expect(session.finished).toBe(true)
    expect(() => session.submit('21')).toThrow()
  })

  it('passes the answer history to the picker', () => {
    const seen: number[] = []
    const picker: Picker = {
      next: (history) => {
        seen.push(history.length)
        return createProblem(2, 5)
      },
    }
    const session = createSession({ picker, length: 3 })
    session.submit('10')
    session.submit('10')
    expect(seen).toEqual([0, 1, 2])
  })

  it('rejects a length or try count that is not a positive integer', () => {
    expect(() => createSession({ picker: fixedPicker, length: 0 })).toThrow(RangeError)
    expect(() => createSession({ picker: fixedPicker, length: 1.5 })).toThrow(RangeError)
    expect(() => createSession({ picker: fixedPicker, maxTries: 0 })).toThrow(RangeError)
  })
})

describe('createSession with retries', () => {
  // Distinct problems so we can tell whether the session moved on
  const counting = (): Picker => {
    let n = 0
    return { next: () => createProblem(++n, 10) }
  }

  it('keeps the problem and the hints after a first wrong answer', () => {
    const session = createSession({ picker: counting(), length: 3, maxTries: 2 })
    session.requestHint()
    const result = session.submit('99')
    expect(result).toMatchObject({ retry: true, points: 0, finished: false })
    expect(session.current).toEqual(createProblem(1, 10))
    expect(session.hintsUsed).toBe(1)
    expect(session.completed).toBe(0)
  })

  it('moves on after the second wrong answer', () => {
    const session = createSession({ picker: counting(), length: 3, maxTries: 2 })
    session.submit('99')
    const result = session.submit('98')
    expect(result).toMatchObject({ retry: false, finished: false })
    expect(result?.attempt).toMatchObject({ tryNumber: 2, final: true, correct: false })
    expect(session.current).toEqual(createProblem(2, 10))
  })

  it('records both tries so a first-try success differs from a hinted retry', () => {
    const session = createSession({ picker: counting(), length: 2, maxTries: 2 })
    session.submit('10') // 1 × 10: right first time
    session.submit('99') // 2 × 10: wrong…
    session.requestHint() // the UI gives a hint after the first mistake
    session.submit('20') // …right on the retry
    const summary = session.attempts.map(({ tryNumber, correct, final, hintsUsed }) => ({
      tryNumber,
      correct,
      final,
      hintsUsed,
    }))
    expect(summary).toEqual([
      { tryNumber: 1, correct: true, final: true, hintsUsed: 0 },
      { tryNumber: 1, correct: false, final: false, hintsUsed: 0 },
      { tryNumber: 2, correct: true, final: true, hintsUsed: 1 },
    ])
  })
  
  it('scores a correct retry with the hints used', () => {
    const session = createSession({ picker: counting(), length: 3, maxTries: 2 })
    session.submit('99')
    session.requestHint()
    expect(session.submit('10')?.points).toBe(7)
  })

  it('counts the session length in problems, not tries', () => {
    const session = createSession({ picker: counting(), length: 2, maxTries: 2 })
    session.submit('99')
    session.submit('10')
    expect(session.finished).toBe(false)
    session.submit('20')
    expect(session.finished).toBe(true)
    expect(session.summary()).toMatchObject({ total: 2, correct: 2 })
  })

  it('times a retry from the previous answer', () => {
    const session = createSession({ picker: counting(), length: 1, maxTries: 2, now: clock(0, 3000, 5000) })
    session.submit('99')
    expect(session.submit('10')?.attempt.timeMs).toBe(2000)
  })
})