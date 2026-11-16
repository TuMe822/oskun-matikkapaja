import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Tyhjennetään DOM jokaisen testin jälkeen, etteivät testit vaikuta toisiinsa.
afterEach(() => {
  cleanup()
})
