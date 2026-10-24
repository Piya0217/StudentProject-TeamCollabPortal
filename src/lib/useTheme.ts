/**
 * useTheme — persisted light/dark mode with 300ms cross-fade.
 * Manages the 'dark' class on <html> and localStorage persistence.
 * No brightness flash: only color transitions, no brightness/opacity layer.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/** Apply the theme class to <html> and block flash transition on initial mount */
function applyTheme(theme: Theme, animated: boolean = true) {
  const root = document.documentElement
  if (!animated) root.classList.add('no-transition')
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  if (!animated) {
    // Force reflow then re-enable transitions
    void root.offsetWidth
    root.classList.remove('no-transition')
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme, true)
      },
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: next })
        applyTheme(next, true)
      },
    }),
    {
      name: 'collab-portal-theme',
      onRehydrateStorage: () => (state) => {
        // Apply persisted theme immediately without animation on startup
        if (state?.theme) applyTheme(state.theme, false)
      },
    },
  ),
)
