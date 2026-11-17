/** Whole numbers 0–999 only; anything else is not an answer */
export function parseAnswer(input: string): number | null {
  const text = input.trim()
  if (!/^\d{1,3}$/.test(text)) return null
  return Number(text)
}
