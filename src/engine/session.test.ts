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

  it('rejects a length that is not a positive integer', () => {
    expect(() => createSession({ picker: fixedPicker, length: 0 })).toThrow(RangeError)
    expect(() => createSession({ picker: fixedPicker, length: 1.5 })).toThrow(RangeError)
  })
})
