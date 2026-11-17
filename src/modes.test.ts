import { describe, expect, it } from 'vitest'
import { practicePlan, TABLES } from './modes'

const params = (query: string) => new URLSearchParams(query)

describe('practicePlan', () => {
  it('uses the chosen table and count', () => {
    expect(practicePlan('practice', params('table=7&count=20'))).toEqual({ tables: [7], count: 20 })
  })

  it('falls back to safe values for missing or invalid parameters', () => {
    expect(practicePlan('practice', params('table=99&count=5'))).toEqual({ tables: [...TABLES], count: 10 })
  })

  it('uses all tables in modes without a table choice', () => {
    expect(practicePlan('mixed', params('table=7&count=10'))).toEqual({ tables: [...TABLES], count: 10 })
  })

  it('leaves modes with their own view to later', () => {
    expect(practicePlan('learn', params('table=7'))).toBeNull()
    expect(practicePlan('speed', params('time=60'))).toBeNull()
    expect(practicePlan('mastery', params('table=7'))).toBeNull()
  })
})
