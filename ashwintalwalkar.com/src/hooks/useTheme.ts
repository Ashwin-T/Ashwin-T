import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

// Also read by the inline script in index.html, which applies a saved choice before first paint.
const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

const listeners = new Set<() => void>()

// A choice made with the toggle lives on <html data-theme>, which tokens.css keys off.
// With no choice made, the page follows the system setting.
function currentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme
  if (chosen === 'light' || chosen === 'dark') return chosen
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

function subscribe(onChange: () => void) {
  const system = window.matchMedia(DARK_QUERY)
  listeners.add(onChange)
  system.addEventListener('change', onChange)
  return () => {
    listeners.delete(onChange)
    system.removeEventListener('change', onChange)
  }
}

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage can be blocked (private mode). The choice then lasts for this visit only.
  }
  for (const listener of listeners) listener()
}

/** The theme on screen right now, and a function that flips it and remembers the choice. */
export function useTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore(subscribe, currentTheme, (): Theme => 'light')
  return [theme, () => setTheme(theme === 'dark' ? 'light' : 'dark')]
}
