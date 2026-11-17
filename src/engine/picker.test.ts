import { describe, expect, it } from 'vitest'
import { createBagPicker } from './picker'
import { createProblem, problemKey, problemsFor } from './problems'
import { seededRandom } from './random'

const draw = (count: number, pool = problemsFor([7]), seed = 1) => {
  const picker = createBagPicker(pool, seededRandom(seed))
  return Array.from({ length: count }, () => problemKey(picker.next([])))
}

describe('createBagPicker', () => {
  it('uses every problem once before repeating any', () => {
    expect(new Set(draw(10)).size).toBe(10)
    const twenty = draw(20)
    expect(new Set(twenty.slice(10)).size).toBe(10)
  })

  it('never gives the same problem twice in a row', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const keys = draw(60, problemsFor([2]).slice(0, 3), seed)
      keys.forEach((key, i) => i > 0 && expect(key).not.toBe(keys[i - 1]))
    }
  })

  it('gives the same order for the same seed', () => {
    expect(draw(10, undefined, 42)).toEqual(draw(10, undefined, 42))
    expect(draw(10, undefined, 42)).not.toEqual(draw(10, undefined, 43))
  })

  it('repeats a single problem when the pool has only one', () => {
    expect(draw(3, [createProblem(3, 7)])).toEqual(['3x7', '3x7', '3x7'])
  })

  it('rejects an empty pool', () => {
    expect(() => createBagPicker([])).toThrow(RangeError)
  })
})
