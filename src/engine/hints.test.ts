import { describe, expect, it } from 'vitest'
import { hintFor } from './hints'
import { createProblem } from './problems'

describe('hintFor', () => {
  it('gives no hint before one is asked', () => {
    expect(hintFor(createProblem(3, 7), 0)).toBeNull()
  })

  it('shows multiplication as repeated addition first', () => {
    expect(hintFor(createProblem(3, 7), 1)).toEqual({ level: 1, kind: 'repeat', terms: [7, 7, 7] })
  })

  it('then points to the previous fact', () => {
    expect(hintFor(createProblem(8, 7), 2)).toEqual({ level: 2, kind: 'neighbour', a: 7, product: 49, adjust: 'add' })
  })

  it('uses the next fact for 1 × b, which has no previous one', () => {
    expect(hintFor(createProblem(1, 7), 2)).toEqual({ level: 2, kind: 'neighbour', a: 2, product: 14, adjust: 'subtract' })
  })

  it('finally counts in steps up to the answer', () => {
    expect(hintFor(createProblem(4, 7), 3)).toEqual({ level: 3, kind: 'count', steps: [7, 14, 21] })
    expect(hintFor(createProblem(1, 7), 3)).toEqual({ level: 3, kind: 'count', steps: [] })
  })
})
