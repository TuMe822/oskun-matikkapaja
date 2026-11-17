// Fills {placeholders}: format('{n} laskua', { n: 10 })
export function format(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match))
}
