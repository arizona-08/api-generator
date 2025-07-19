import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme } from '../useTheme'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Mock matchMedia
const matchMediaMock = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
})

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
        }
      },
      writable: true
    })
  })

  it('should initialize with dark theme by default when no localStorage value', () => {
    localStorageMock.getItem.mockReturnValue(null)
    matchMediaMock.mockReturnValue({ matches: true })
    
    const { theme, isDark } = useTheme()
    
    expect(theme.value).toBe('dark')
    expect(isDark.value).toBe(true)
  })

  it('should initialize with saved theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('light')
    
    const { theme, isDark } = useTheme()
    
    expect(theme.value).toBe('light')
    expect(isDark.value).toBe(false)
  })

  it('should toggle theme correctly', () => {
    localStorageMock.getItem.mockReturnValue('dark')
    
    const { theme, isDark, toggleTheme } = useTheme()
    
    expect(theme.value).toBe('dark')
    expect(isDark.value).toBe(true)
    
    toggleTheme()
    
    expect(theme.value).toBe('light')
    expect(isDark.value).toBe(false)
  })

  it('should set specific theme correctly', () => {
    const { theme, isDark, setTheme } = useTheme()
    
    setTheme('light')
    
    expect(theme.value).toBe('light')
    expect(isDark.value).toBe(false)
    
    setTheme('dark')
    
    expect(theme.value).toBe('dark')
    expect(isDark.value).toBe(true)
  })
})
