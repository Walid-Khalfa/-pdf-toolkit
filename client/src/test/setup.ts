import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

vi.stubGlobal(
  'matchMedia',
  vi.fn(() => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
)
