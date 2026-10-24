/**
 * AppShell — main layout container.
 * Orchestrates sidebar + toolbar + main content area + mobile tab bar.
 * Route transitions: 200ms opacity cross-fade via AnimatePresence.
 * Content scrolls under glass toolbar with gradient mask fade.
 */
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Toaster } from 'sonner'
import { Sidebar } from './Sidebar'
import { Toolbar } from './Toolbar'
import { MobileTabBar } from './MobileTabBar'
import { CommandPalette } from '@/components/ui/CommandPalette'

// Mock current user — will be replaced by authStore in later steps
const MOCK_USER = {
  name: 'Siddharth Rao',
  role: 'student' as const,
  avatar: undefined as string | undefined,
}

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = () => {
    navigate('/login')
  }

  const handleResetDemo = () => {
    // Will hook into mockStorage in a later step
    window.location.reload()
  }

  return (
    <div className="min-h-dvh" style={{ backgroundColor: 'var(--canvas)' }}>
      {/* Global command palette — Cmd/Ctrl+K */}
      <CommandPalette />

      {/* Toaster — sonner, never hand-rolled */}
      <Toaster
        position="bottom-right"
        offset={80}
        toastOptions={{
          style: {
            background: 'var(--surface-raised)',
            border: '1px solid var(--hairline)',
            color: 'var(--ink)',
            fontSize: 'var(--size-body)',
            borderRadius: 'var(--radius-card)',
          },
        }}
      />

      {/* Sidebar (desktop only, 248px fixed left) */}
      <Sidebar
        role={MOCK_USER.role}
        userName={MOCK_USER.name}
        userAvatar={MOCK_USER.avatar}
      />

      {/* Top toolbar */}
      <Toolbar
        userName={MOCK_USER.name}
        userAvatar={MOCK_USER.avatar}
        role={MOCK_USER.role}
        onSignOut={handleSignOut}
        onResetDemo={handleResetDemo}
      />

      {/* Main content area — offset by sidebar on desktop */}
      <main
        id="main-content"
        className="min-h-dvh"
        style={{
          paddingTop: 'var(--toolbar-height)',
          paddingBottom: 0,
          // Mobile: add bottom padding for tab bar
        }}
        role="main"
        aria-label="Page content"
      >
        {/* Desktop sidebar offset */}
        <div
          className="min-h-full"
          style={{
            // Will be 248px expanded, reduced to 72px on rail — for now fixed
            paddingLeft: 0,
          }}
        >
          {/* Scroll-edge gradient fade */}
          <div
            className="min-h-full md:ml-[248px] pb-[var(--mobile-tabbar-height)] md:pb-0"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)',
              maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)',
            }}
          >
            {/* Route-level cross-fade — 200ms opacity only, per design rules */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.2,
                  ease: [0.77, 0, 0.175, 1],
                }}
                className="min-h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <MobileTabBar role={MOCK_USER.role} />
    </div>
  )
}
