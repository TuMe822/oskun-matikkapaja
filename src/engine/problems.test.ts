import { describe, expect, it } from 'vitest'
import { problemKey, problemsFor } from './problems'

describe('problemsFor', () => {
  it('builds 1 × 7 … 10 × 7 for the 7 times table', () => {
    const problems = problemsFor([7])
    expect(problems).toHaveLength(10)
    expect(problems[0]).toEqual({ a: 1, b: 7, answer: 7 })
    expect(problems[9]).toEqual({ a: 10, b: 7, answer: 70 })
  })

  it('combines several tables without duplicates', () => {
    const problems = problemsFor([2, 3, 2])
    expect(problems).toHaveLength(20)
    expect(new Set(problems.map(problemKey)).size).toBe(20)
  })

  it('rejects an empty list and tables outside 1–10', () => {
    expect(() => problemsFor([])).toThrow(RangeError)
    expect(() => problemsFor([0])).toThrow(RangeError)
    expect(() => problemsFor([11])).toThrow(RangeError)
    expect(() => problemsFor([2.5])).toThrow(RangeError)
  })
})
