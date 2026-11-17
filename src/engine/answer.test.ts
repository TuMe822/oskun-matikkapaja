import { describe, expect, it } from 'vitest'
import { parseAnswer } from './answer'

describe('parseAnswer', () => {
  it('accepts whole numbers, ignoring spaces and leading zeros', () => {
    expect(parseAnswer('56')).toBe(56)
    expect(parseAnswer(' 56 ')).toBe(56)
    expect(parseAnswer('056')).toBe(56)
    expect(parseAnswer('0')).toBe(0)
    expect(parseAnswer('100')).toBe(100)
  })

  it('rejects anything that is not a whole number 0–999', () => {
    for (const input of ['', '  ', 'abc', '5.6', '-5', '1000', '5 6', '1e2']) {
      expect(parseAnswer(input)).toBeNull()
    }
  })
})
