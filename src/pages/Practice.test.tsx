import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { I18nProvider } from '../i18n/I18nProvider'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <I18nProvider>
        <App />
      </I18nProvider>
    </MemoryRouter>,
  )
}

const EQUATION = /^(\d+) × (\d+) =$/

// The problem order is random, so read the current problem from the screen
const currentAnswer = () => {
  const [, a, b] = screen.getByText(EQUATION).textContent!.match(EQUATION)!
  return Number(a) * Number(b)
}

const answer = (value: number) => {
  for (const digit of String(value)) fireEvent.click(screen.getByRole('button', { name: digit }))
  fireEvent.click(screen.getByRole('button', { name: 'OK' }))
}

const waitForNext = () => act(() => vi.advanceTimersByTime(1000))

describe('Practice', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('praises a correct answer and moves on', () => {
    renderAt('/play?mode=practice&table=7&count=10')
    expect(screen.getByText('1 / 10')).toBeInTheDocument()
    answer(currentAnswer())
    expect(screen.getByText(/Oikein!|Hienoa!|Mahtavaa!|Juuri niin!/)).toBeInTheDocument()
    waitForNext()
    expect(screen.getByText('2 / 10')).toBeInTheDocument()
  })

  it('gives another try with a hint after a wrong answer', () => {
    renderAt('/play?mode=practice&table=7&count=10')
    const correct = currentAnswer()
    answer(correct + 1)
    expect(screen.getByText('Melkein! Kokeile uudelleen.')).toBeInTheDocument()
    expect(screen.getByText(/tarkoittaa/)).toBeInTheDocument()
    expect(currentAnswer()).toBe(correct)
    expect(screen.getByText('1 / 10')).toBeInTheDocument()
  })

  it('shows the right answer after a second wrong answer', () => {
    renderAt('/play?mode=practice&table=7&count=10')
    const correct = currentAnswer()
    answer(correct + 1)
    answer(correct + 2)
    expect(screen.getByText(`Oikea vastaus on ${correct}. Harjoitellaan tätä vielä.`)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Jatka' }))
    expect(screen.getByText('2 / 10')).toBeInTheDocument()
  })

  it('gives up to three hints', () => {
    renderAt('/play?mode=practice&table=7&count=10')
    fireEvent.click(screen.getByRole('button', { name: 'Vihje' }))
    expect(screen.getByText(/tarkoittaa/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Seuraava vihje' }))
    expect(screen.getByText(/Muistatko/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Seuraava vihje' }))
    expect(screen.getByText(/kerrallaan|aina/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Seuraava vihje' })).toBeDisabled()
  })

  it('accepts answers from the keyboard', () => {
    renderAt('/play?mode=practice&table=7&count=10')
    for (const key of String(currentAnswer())) fireEvent.keyDown(window, { key })
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(screen.getByText(/Oikein!|Hienoa!|Mahtavaa!|Juuri niin!/)).toBeInTheDocument()
  })

  it('shows the results after the last problem', () => {
    renderAt('/play?mode=practice&table=2&count=10')
    for (let i = 0; i < 10; i++) {
      answer(currentAnswer())
      waitForNext()
    }
    expect(screen.getByRole('heading', { level: 1, name: 'Hienoa työtä!' })).toBeInTheDocument()
    expect(screen.getByText(/10 \/ 10 oikein/)).toBeInTheDocument()
    expect(screen.getByText(/100 pistettä/)).toBeInTheDocument()
  })

  it('starts a fresh round from the results', () => {
    renderAt('/play?mode=practice&table=2&count=10')
    for (let i = 0; i < 10; i++) {
      answer(currentAnswer())
      waitForNext()
    }
    fireEvent.click(screen.getByRole('button', { name: 'Harjoittele uudestaan' }))
    expect(screen.getByText('1 / 10')).toBeInTheDocument()
  })

  it('keeps the placeholder for modes that get their own view later', () => {
    renderAt('/play?mode=learn&table=3')
    expect(screen.getByText('3:n kertotaulu')).toBeInTheDocument()
  })
})
