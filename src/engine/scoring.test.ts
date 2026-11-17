import { describe, expect, it } from 'vitest'
import { createProblem } from './problems'
import { pointsFor, summarize } from './scoring'
import type { Attempt } from './types'

const attempt = (correct: boolean, hintsUsed = 0, timeMs = 1000): Attempt => ({
  problem: createProblem(3, 7),
  given: correct ? 21 : 20,
  correct,
  hintsUsed,
  tryNumber: 1,
  final: true,
  timeMs,
  answeredAt: 0,
})

describe('pointsFor', () => {
  it('gives fewer points the more hints were used', () => {
    expect([0, 1, 2, 3].map((h) => pointsFor(attempt(true, h)))).toEqual([10, 7, 5, 3])
  })

  it('gives no points for a wrong answer', () => {
    expect(pointsFor(attempt(false))).toBe(0)
  })

  it('treats more than three hints as three', () => {
    expect(pointsFor(attempt(true, 5))).toBe(3)
  })
})

describe('summarize', () => {
  it('adds up answers, points and time', () => {
    expect(summarize([attempt(true), attempt(true, 1, 2000), attempt(false, 0, 500)])).toEqual({
      total: 3,
      correct: 2,
      points: 17,
      timeMs: 3500,
    })
  })

  it('counts a retried problem once', () => {
    const firstTry = { ...attempt(false, 1, 2000), final: false }
    const retry = { ...attempt(true, 1, 1000), tryNumber: 2 }
    expect(summarize([firstTry, retry])).toEqual({ total: 1, correct: 1, points: 7, timeMs: 3000 })
  })

  it('is all zeros for no answers', () => {
    expect(summarize([])).toEqual({ total: 0, correct: 0, points: 0, timeMs: 0 })
  })
})
