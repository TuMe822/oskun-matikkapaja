import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('näyttää sovelluksen nimen pääotsikkona', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Oskun Matikkapaja' })).toBeInTheDocument()
  })
})
