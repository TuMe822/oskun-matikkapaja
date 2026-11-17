import { problemKey } from './problems'
import { shuffle } from './random'
import type { Picker, Problem, Random } from './types'

/**
 * Shuffle bag: every problem once in random order before any repeat,
 * and never the same problem twice in a row.
 */
export function createBagPicker(pool: readonly Problem[], random: Random = Math.random): Picker {
  if (pool.length === 0) throw new RangeError('Problem pool is empty')
  let bag: Problem[] = []
  let last: Problem | undefined

  return {
    next() {
      if (bag.length === 0) {
        bag = shuffle(pool, random)
        // Next draw is from the end: keep it different from the previous one
        const end = bag.length - 1
        if (last && end > 0 && problemKey(bag[end]) === problemKey(last)) {
          ;[bag[0], bag[end]] = [bag[end], bag[0]]
        }
      }
      last = bag.pop() as Problem
      return last
    },
  }
}
