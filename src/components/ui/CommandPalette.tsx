/**
 * Command palette — cmdk powered global search and navigation.
 * Opens on Cmd+K / Ctrl+K. No open/close animation per rules
 * (command palette = no animation, or color-only 100ms).
 */
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import * as Dialog from '@radix-ui/react-dialog'
import { Search, FolderOpen, CheckSquare, Users, FileText, Star } from 'lucide-react'
import { cn } from '@/lib/cn'

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  action: () => void
  group: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const nav = useCallback(
    (path: string) => {
      navigate(path)
      setOpen(false)
      setQuery('')
    },
    [navigate],
  )

  const commands: CommandItem[] = [
    {
      id: 'nav-dashboard',
      label: 'Go to dashboard',
      icon: <Star size={15} strokeWidth={1.5} />,
      action: () => nav('/dashboard'),
      group: 'Navigation',
    },
    {
      id: 'nav-projects-new',
      label: 'Create project',
      description: 'Start a new academic project',
      icon: <FolderOpen size={15} strokeWidth={1.5} />,
      action: () => nav('/projects/new'),
      group: 'Actions',
    },
    {
      id: 'nav-tasks',
      label: 'Go to tasks',
      icon: <CheckSquare size={15} strokeWidth={1.5} />,
      action: () => nav('/tasks'),
      group: 'Navigation',
    },
    {
      id: 'nav-teams',
      label: 'Go to teams',
      icon: <Users size={15} strokeWidth={1.5} />,
      action: () => nav('/teams'),
      group: 'Navigation',
    },
    {
      id: 'nav-files',
      label: 'Go to files',
      icon: <FileText size={15} strokeWidth={1.5} />,
      action: () => nav('/files'),
      group: 'Navigation',
    },
  ]

  const navCommands = commands.filter((c) => c.group === 'Navigation')
  const actionCommands = commands.filter((c) => c.group === 'Actions')

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery('') }}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50"
          style={{ backgroundColor: 'var(--scrim)' }}
        />
        <Dialog.Content
          className={cn(
            'fixed top-[20vh] left-1/2 -translate-x-1/2 z-50',
            'w-full max-w-[560px] mx-4',
            'rounded-[var(--radius-window)] overflow-hidden glass-sheet',
          )}
          style={{ border: '1px solid var(--hairline)' }}
          aria-label="Command palette"
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>

          <Command className="bg-transparent">
            {/* Search input */}
            <div
              className="flex items-center gap-3 px-4"
              style={{ borderBottom: '1px solid var(--hairline)' }}
            >
              <Search
                size={17}
                strokeWidth={1.5}
                aria-hidden="true"
                style={{ color: 'var(--ink-secondary)', flexShrink: 0 }}
              />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Search projects, tasks, teams…"
                className="flex-1 h-12 bg-transparent border-none outline-none"
                style={{
                  fontSize: 'var(--size-body)',
                  color: 'var(--ink)',
                }}
                aria-label="Search"
              />
              <kbd
                className="font-mono px-1.5 py-0.5 rounded-[var(--radius-chip)] shrink-0"
                style={{
                  fontSize: 'var(--size-caption)',
                  color: 'var(--ink-secondary)',
                  backgroundColor: 'var(--fill-quaternary)',
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <Command.List
              className="max-h-[360px] overflow-y-auto p-2"
              aria-label="Command results"
            >
              <Command.Empty
                className="py-10 text-center"
                style={{ fontSize: 'var(--size-body)', color: 'var(--ink-secondary)' }}
              >
                No results for &ldquo;{query}&rdquo;
              </Command.Empty>

              {navCommands.length > 0 && (
                <Command.Group>
                  <div
                    className="px-2 py-1.5 font-medium"
                    style={{
                      fontSize: 'var(--size-caption)',
                      color: 'var(--ink-secondary)',
                    }}
                  >
                    Navigation
                  </div>
                  {navCommands.map((item) => (
                    <CommandItem key={item.id} item={item} />
                  ))}
                </Command.Group>
              )}

              {actionCommands.length > 0 && (
                <Command.Group>
                  <div
                    className="px-2 py-1.5 font-medium"
                    style={{
                      fontSize: 'var(--size-caption)',
                      color: 'var(--ink-secondary)',
                    }}
                  >
                    Actions
                  </div>
                  {actionCommands.map((item) => (
                    <CommandItem key={item.id} item={item} />
                  ))}
                </Command.Group>
              )}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function CommandItem({ item }: { item: { id: string; label: string; description?: string; icon: React.ReactNode; action: () => void } }) {
  return (
    <Command.Item
      value={item.label}
      onSelect={item.action}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-control)]',
        'cursor-pointer select-none outline-none transition-colors duration-100',
        'data-[selected=true]:bg-[var(--accent-subtle)]',
      )}
      style={{ fontSize: 'var(--size-body)', color: 'var(--ink)' }}
    >
      <span aria-hidden="true" style={{ color: 'var(--ink-secondary)', flexShrink: 0 }}>
        {item.icon}
      </span>
      <div className="flex-1 min-w-0">
        <span className="font-medium">{item.label}</span>
        {item.description && (
          <span className="ml-2" style={{ fontSize: 'var(--size-caption)', color: 'var(--ink-secondary)' }}>
            {item.description}
          </span>
        )}
      </div>
    </Command.Item>
  )
}
