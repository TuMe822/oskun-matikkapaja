import type { Hint, Problem } from '../engine'
import { format } from '../i18n/format'
import type { Messages } from '../i18n/fi'

export function hintText(t: Messages, problem: Problem, hint: Hint): string {
  const { a, b } = problem
  switch (hint.kind) {
    case 'repeat':
      return format(t.hints.repeat, { a, b, sum: hint.terms.join(' + ') })
    case 'neighbour':
      return format(hint.adjust === 'add' ? t.hints.add : t.hints.subtract, { n: hint.a, b, p: hint.product })
    case 'count':
      return hint.steps.length === 0
        ? format(t.hints.one, { b })
        : format(t.hints.count, { b, steps: hint.steps.join(', ') })
  }
}
