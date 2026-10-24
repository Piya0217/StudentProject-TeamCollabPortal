/**
 * Application entry point.
 * Imports global styles (includes tokens + Tailwind).
 * Theme is rehydrated by Zustand persist before first render.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import { App } from '@/app/App'

// Apply stored theme before first paint to prevent flash
// (Zustand persist onRehydrateStorage handles this synchronously)

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
