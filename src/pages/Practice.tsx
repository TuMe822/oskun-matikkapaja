import { useEffect, useEffectEvent, useReducer, useState } from 'react'
import { Link } from 'react-router'
import { Icon } from '../components/Icon'
import { Keypad } from '../components/Keypad'
import { Osku } from '../components/Osku'
import { hintText } from '../components/hintText'
import { createBagPicker, createSession, hintFor, MAX_HINTS, problemsFor, type Problem } from '../engine'
import { useI18n } from '../i18n/context'
import { format } from '../i18n/format'
import type { PracticePlan } from '../modes'
import './Practice.css'

const MAX_DIGITS = 3
const CORRECT_PAUSE_MS = 900

type Feedback =
  | { kind: 'none' }
  | { kind: 'retry' }
  | { kind: 'correct'; problem: Problem }
  | { kind: 'reveal'; problem: Problem }

interface Props {
  title: string
  plan: PracticePlan
  onAgain: () => void
}

export function Practice({ title, plan, onAgain }: Props) {
  const { t } = useI18n()
  // Created once; methods are called from event handlers only
  const [session] = useState(() =>
    createSession({ picker: createBagPicker(problemsFor(plan.tables)), length: plan.count, maxTries: 2 }),
  )
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<Feedback>({ kind: 'none' })

  // A correct answer stays on screen for a moment, then the next problem
  useEffect(() => {
    if (feedback.kind !== 'correct') return
    const timer = setTimeout(() => setFeedback({ kind: 'none' }), CORRECT_PAUSE_MS)
    return () => clearTimeout(timer)
  }, [feedback])

  const locked = feedback.kind === 'correct' || feedback.kind === 'reveal'

  const addDigit = (digit: string) => {
    if (!locked) setInput((current) => (current.length < MAX_DIGITS ? current + digit : current))
  }
  const erase = () => {
    if (!locked) setInput((current) => current.slice(0, -1))
  }
  const askHint = () => {
    session.requestHint()
    rerender()
  }
  const submit = () => {
    if (locked) return
    const shown = session.current
    const result = session.submit(input)
    if (!result) return
    setInput('')
    if (result.attempt.correct) {
      setFeedback({ kind: 'correct', problem: shown })
    } else if (result.retry) {
      if (session.hintsUsed === 0) session.requestHint()
      setFeedback({ kind: 'retry' })
    } else {
      setFeedback({ kind: 'reveal', problem: shown })
    }
    rerender()
  }
  const proceed = () => setFeedback({ kind: 'none' })

  // Physical keyboard works too (desktop, iPad keyboard case)
  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (/^\d$/.test(event.key)) addDigit(event.key)
    else if (event.key === 'Backspace') erase()
    else if (event.key === 'Enter') {
      event.preventDefault()
      if (feedback.kind === 'reveal') proceed()
      else submit()
    }
  })
  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKey(event)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  if (session.finished && feedback.kind === 'none') {
    const summary = session.summary()
    return (
      <main className="page results">
        <div className="hero">
          <Osku size="lg" />
          <h1>{t.play.resultsTitle}</h1>
        </div>
        <p className="bubble">
          {format(t.play.resultsScore, { correct: summary.correct, total: summary.total })} ·{' '}
          {format(t.play.resultsPoints, { n: summary.points })}
        </p>
        <div className="action-bar">
          <button type="button" className="button button--secondary" onClick={onAgain}>
            {t.play.again}
          </button>
          <Link className="button" to="/">
            {t.play.home}
          </Link>
        </div>
      </main>
    )
  }

  const problem = feedback.kind === 'correct' || feedback.kind === 'reveal' ? feedback.problem : session.current
  const hint = locked ? null : hintFor(problem, session.hintsUsed)
  const step = Math.min(session.completed + (locked ? 0 : 1), plan.count)

  let message: string
  if (feedback.kind === 'correct') message = t.play.praise[session.completed % t.play.praise.length]
  else if (feedback.kind === 'reveal') message = format(t.play.reveal, { answer: feedback.problem.answer })
  else if (feedback.kind === 'retry') message = t.play.retry
  else message = hint ? '' : t.play.ready

  return (
    <main className="page practice">
      <header className="practice-top">
        <Link className="icon-button" to="/" aria-label={t.play.quit}>
          <Icon name="close" />
        </Link>
        <h1>{title}</h1>
        <span className="progress-text">{format(t.play.progress, { n: step, total: plan.count })}</span>
      </header>

      <p className="equation">
        <span>
          {problem.a} × {problem.b} =
        </span>
        <span className={input ? 'answer-box' : 'answer-box answer-box--empty'} aria-label={t.play.answer}>
          {feedback.kind === 'correct' ? problem.answer : input || '?'}
        </span>
      </p>

      <div className="coach">
        <Osku size="sm" />
        <p className={`bubble bubble--${feedback.kind}`} aria-live="polite">
          {message && <span className="bubble__line">{message}</span>}
          {hint && <span className="bubble__line">{hintText(t, problem, hint)}</span>}
        </p>
      </div>

      {feedback.kind === 'reveal' ? (
        <button type="button" onClick={proceed}>
          {t.play.next}
        </button>
      ) : (
        <button
          type="button"
          className="button button--secondary"
          onClick={askHint}
          disabled={locked || session.hintsUsed >= MAX_HINTS}
        >
          {session.hintsUsed === 0 ? t.play.hint : t.play.nextHint}
        </button>
      )}

      <div className="push-bottom">
        <Keypad
          onDigit={addDigit}
          onErase={erase}
          onSubmit={submit}
          disabled={locked}
          labels={{ erase: t.play.erase, ok: t.play.ok }}
        />
      </div>
    </main>
  )
}
