import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import App from './App'
import { I18nProvider } from './i18n/I18nProvider'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <I18nProvider>
        <App />
      </I18nProvider>
    </MemoryRouter>,
  )
}

const heading = (name: string) => screen.getByRole('heading', { level: 1, name })

describe('Home', () => {
  it('shows the app name as the main heading', () => {
    renderAt('/')
    expect(heading('Oskun Matikkapaja')).toBeInTheDocument()
  })

  it('opens mode selection', () => {
    renderAt('/')
    fireEvent.click(screen.getByRole('link', { name: 'Valitse harjoitus' }))
    expect(heading('Mitä harjoitellaan?')).toBeInTheDocument()
  })

  it("starts today's practice with one tap", () => {
    renderAt('/')
    fireEvent.click(screen.getByRole('link', { name: 'Päivän harjoitus' }))
    expect(heading('Päivän harjoitus')).toBeInTheDocument()
  })
})

describe('Mode selection', () => {
  it('starts with defaults in one tap', () => {
    renderAt('/modes')
    fireEvent.click(screen.getByRole('button', { name: 'Aloita' }))
    expect(heading('Harjoittele')).toBeInTheDocument()
    expect(screen.getByText(/^\d+ × 1 =$/)).toBeInTheDocument()
    expect(screen.getByText('1 / 10')).toBeInTheDocument()
  })

  it('passes the chosen table and count on', () => {
    renderAt('/modes')
    fireEvent.click(screen.getByRole('button', { name: '7' }))
    fireEvent.click(screen.getByRole('button', { name: '20 laskua' }))
    fireEvent.click(screen.getByRole('button', { name: 'Aloita' }))
    expect(screen.getByText(/^\d+ × 7 =$/)).toBeInTheDocument()
    expect(screen.getByText('1 / 20')).toBeInTheDocument()
  })

  it('shows only the options the mode needs', () => {
    renderAt('/modes')
    fireEvent.click(screen.getByRole('button', { name: /^Pikahaaste/ }))
    expect(screen.queryByRole('group', { name: 'Kertotaulu' })).not.toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Aika' })).toBeInTheDocument()
  })

  it('keeps a mode selected when tapped again', () => {
    renderAt('/modes')
    const tile = screen.getByRole('button', { name: /^Sekaharjoittelu/ })
    fireEvent.click(tile)
    fireEvent.click(tile)
    expect(tile).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Play', () => {
  it('sends an unknown mode back to mode selection', () => {
    renderAt('/play?mode=nope')
    expect(heading('Mitä harjoitellaan?')).toBeInTheDocument()
  })
})
