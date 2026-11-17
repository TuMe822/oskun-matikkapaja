export const MODE_IDS = ['learn', 'practice', 'mixed', 'challenge', 'speed', 'tricky', 'daily', 'mastery'] as const

export type ModeId = (typeof MODE_IDS)[number]

export interface ModeConfig {
  table: boolean
  option: 'count' | 'time' | null
}

export const MODES: Record<ModeId, ModeConfig> = {
  learn: { table: true, option: null },
  practice: { table: true, option: 'count' },
  mixed: { table: false, option: 'count' },
  challenge: { table: false, option: 'count' },
  speed: { table: false, option: 'time' },
  tricky: { table: false, option: null },
  daily: { table: false, option: null },
  mastery: { table: true, option: null },
}

export const TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const
export const COUNTS = [10, 20] as const
export const TIMES = [30, 60, 120] as const

export function isModeId(value: string | null): value is ModeId {
  return value !== null && (MODE_IDS as readonly string[]).includes(value)
}
