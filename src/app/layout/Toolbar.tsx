/**
 * Toolbar — top glass bar: logo (mobile), search trigger, theme toggle, user menu.
 * Translucent glass material. No hard border — content fades under it.
 * Cmd/Ctrl+K triggers command palette. Keyboard accessible.
 */
import { Search, Sun, Moon, ChevronDown, LogOut, RefreshCw } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useThemeStore } from '@/lib/useTheme'
import { cn } from '@/lib/cn'
import { Avatar } from '@/components/ui/Avatar'
import { IconButton } from '@/components/ui/IconButton'

interface ToolbarProps {
  userName: string
  userAvatar?: string
  role: 'student' | 'faculty'
  onSignOut: () => void
  onResetDemo: () => void
}

export function Toolbar({ userName, userAvatar, role, onSignOut, onResetDemo }: ToolbarProps) {
  const { theme, toggleTheme } = useThemeStore()

  const triggerCommandPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }),
    )
  }

  return (
    <header
      className={cn('fixed top-0 left-0 right-0 z-40 glass-toolbar flex items-center gap-2 px-4')}
      style={{ height: 'var(--toolbar-height)' }}
      role="banner"
    >
      {/* Mobile logo — hidden on desktop */}
      <div className="flex items-center gap-2 md:hidden">
        <div
          className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <span className="text-white font-bold text-sm" aria-hidden="true">C</span>
        </div>
        <span
          className="font-semibold"
          style={{ fontSize: 'var(--size-headline)', color: 'var(--ink)' }}
        >
          CollabPortal
        </span>
      </div>

      {/* Search trigger */}
      <button
        onClick={triggerCommandPalette}
        className={cn(
          'hidden md:flex flex-1 max-w-sm items-center gap-2.5',
          'h-9 px-3 rounded-[var(--radius-control)]',
          'border transition-colors duration-100 cursor-text',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
        )}
        style={{
          backgroundColor: 'var(--fill-quaternary)',
          borderColor: 'var(--hairline)',
          color: 'var(--ink-secondary)',
          outlineColor: 'var(--accent)',
        }}
        aria-label="Search (Cmd+K)"
        aria-keyshortcuts="Meta+k Control+k"
      >
        <Search size={15} strokeWidth={1.5} aria-hidden="true" />
        <span className="flex-1 text-left" style={{ fontSize: 'var(--size-body)' }}>
          Search…
        </span>
        <kbd
          className="font-mono px-1.5 py-0.5 rounded-[var(--radius-chip)]"
          style={{ fontSize: 'var(--size-caption)', backgroundColor: 'var(--fill-quaternary)' }}
        >
          ⌘K
        </kbd>
      </button>

      <div className="flex-1 md:flex-none" />

      {/* Theme toggle */}
      <IconButton
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        onClick={toggleTheme}
        variant="ghost"
        size="md"
      >
        {theme === 'light' ? (
          <Moon size={17} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Sun size={17} strokeWidth={1.5} aria-hidden="true" />
        )}
      </IconButton>

      {/* User menu */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-control)]',
              'font-medium cursor-pointer transition-colors duration-100',
              'active:scale-[0.97] transition-transform',
              'focus-visible:outline-2 focus-visible:outline-offset-2 min-h-[44px]',
            )}
            style={{
              fontSize: 'var(--size-body)',
              color: 'var(--ink)',
              outlineColor: 'var(--accent)',
            }}
            aria-label="User menu"
            aria-haspopup="menu"
          >
            <Avatar name={userName} src={userAvatar} size="xs" />
            <span
              className="hidden sm:block max-w-[120px] truncate"
              style={{ fontSize: 'var(--size-caption)' }}
            >
              {userName}
            </span>
            <ChevronDown
              size={13}
              strokeWidth={2}
              aria-hidden="true"
              style={{ color: 'var(--ink-secondary)' }}
            />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className="z-50 min-w-[200px] rounded-[var(--radius-card)] p-1 glass-popover origin-top-right"
            style={{ boxShadow: 'var(--shadow-sheet)' }}
          >
            {/* User info header */}
            <div
              className="px-3 py-2 mb-1"
              style={{ borderBottom: '1px solid var(--hairline)' }}
            >
              <p
                className="font-semibold truncate"
                style={{ fontSize: 'var(--size-body)', color: 'var(--ink)' }}
              >
                {userName}
              </p>
              <p
                className="capitalize"
                style={{ fontSize: 'var(--size-caption)', color: 'var(--ink-secondary)' }}
              >
                {role}
              </p>
            </div>

            <DropdownMenu.Item
              onSelect={onResetDemo}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-control)]',
                'cursor-pointer select-none outline-none transition-colors duration-100',
                'data-[highlighted]:bg-[var(--fill-quaternary)]',
              )}
              style={{ fontSize: 'var(--size-body)', color: 'var(--ink)' }}
            >
              <RefreshCw
                size={15}
                strokeWidth={1.5}
                aria-hidden="true"
                style={{ color: 'var(--ink-secondary)' }}
              />
              Reset demo data
            </DropdownMenu.Item>

            <DropdownMenu.Separator
              className="my-1"
              style={{ height: '1px', backgroundColor: 'var(--hairline)' }}
            />

            <DropdownMenu.Item
              onSelect={onSignOut}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-control)]',
                'cursor-pointer select-none outline-none transition-colors duration-100',
                'data-[highlighted]:bg-[rgba(255,69,58,0.1)]',
              )}
              style={{ fontSize: 'var(--size-body)', color: 'var(--priority-high)' }}
            >
              <LogOut size={15} strokeWidth={1.5} aria-hidden="true" />
              Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  )
}
