/**
 * Sidebar — 248px translucent glass sidebar, collapsible to 72px icon rail.
 * Active indicator uses Motion layoutId spring.
 * Faculty-only "Reviews" nav item hidden for student role.
 * Mobile: hidden (bottom tab bar takes over).
 */
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  LayoutGrid,
  CheckSquare,
  Users,
  FileText,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Circle,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Avatar } from '@/components/ui/Avatar'
import { Tooltip } from '@/components/ui/Tooltip'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
  facultyOnly?: boolean
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Projects', icon: <LayoutGrid size={18} strokeWidth={1.5} /> },
  { path: '/tasks', label: 'Tasks', icon: <CheckSquare size={18} strokeWidth={1.5} /> },
  { path: '/teams', label: 'Teams', icon: <Users size={18} strokeWidth={1.5} /> },
  { path: '/files', label: 'Files', icon: <FileText size={18} strokeWidth={1.5} /> },
  {
    path: '/reviews',
    label: 'Reviews',
    icon: <ClipboardList size={18} strokeWidth={1.5} />,
    facultyOnly: true,
  },
]

interface SidebarProps {
  /** Current user's role */
  role: 'student' | 'faculty'
  /** Current user's display name */
  userName: string
  /** Current user's avatar src */
  userAvatar?: string
}

export function Sidebar({ role, userName, userAvatar }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const visibleItems = navItems.filter((item) => !item.facultyOnly || role === 'faculty')
  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-[248px]'

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col shrink-0',
        'fixed top-0 left-0 bottom-0 z-30',
        'glass-sidebar',
        sidebarWidth,
        'transition-[width] duration-[240ms]',
      )}
      style={{ transitionTimingFunction: 'var(--ease-out)' }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 shrink-0',
          'h-[var(--toolbar-height)] border-b border-[var(--hairline)]',
          collapsed && 'justify-center px-0',
        )}
      >
        <div
          className="w-7 h-7 rounded-[8px] bg-[var(--accent)] flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="text-[length:var(--size-headline)] font-semibold text-[var(--ink)] overflow-hidden whitespace-nowrap"
            >
              CollabPortal
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 py-3 px-2 overflow-y-auto" aria-label="Primary">
        {visibleItems.map((item) => {
          const isActive =
            item.path === '/dashboard'
              ? location.pathname === '/dashboard' || location.pathname === '/'
              : location.pathname.startsWith(item.path)

          const linkEl = (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-control)]',
                'text-[length:var(--size-body)] font-medium select-none',
                'transition-colors duration-100',
                isActive ? 'text-[var(--accent)]' : 'text-[var(--ink-secondary)]',
                collapsed && 'justify-center px-0 py-3',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator pill */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-[var(--radius-control)] bg-[var(--accent-subtle)]"
                  transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10 shrink-0" aria-hidden="true">
                {item.icon}
              </span>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative z-10 overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          )

          if (collapsed) {
            return (
              <Tooltip key={item.path} content={item.label} side="right" delayDuration={200}>
                <div>{linkEl}</div>
              </Tooltip>
            )
          }

          return <div key={item.path}>{linkEl}</div>
        })}
      </nav>

      {/* API status */}
      <div
        className={cn(
          'px-3 py-2 border-t border-[var(--hairline)]',
          collapsed && 'flex justify-center',
        )}
      >
        {collapsed ? (
          <Tooltip content="Mock API active" side="right">
            <div>
              <Circle
                size={8}
                className="fill-[var(--health-ontrack)] text-[var(--health-ontrack)]"
                aria-hidden="true"
              />
            </div>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-2 text-[length:var(--size-caption)] text-[var(--ink-secondary)]">
            <Circle
              size={8}
              className="fill-[var(--health-ontrack)] text-[var(--health-ontrack)]"
              aria-hidden="true"
            />
            <span>Mock API active</span>
          </div>
        )}
      </div>

      {/* User profile */}
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-3 border-t border-[var(--hairline)]',
          collapsed && 'justify-center',
        )}
      >
        <Avatar name={userName} src={userAvatar} size="sm" />
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 overflow-hidden min-w-0"
            >
              <p className="text-[length:var(--size-caption)] font-medium text-[var(--ink)] whitespace-nowrap truncate">
                {userName}
              </p>
              <p className="text-[length:var(--size-caption)] text-[var(--ink-secondary)] capitalize whitespace-nowrap">
                {role}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
        className={cn(
          'absolute -right-3 top-[calc(var(--toolbar-height)+16px)]',
          'w-6 h-6 rounded-full',
          'bg-[var(--surface)] border border-[var(--hairline)]',
          'flex items-center justify-center',
          'text-[var(--ink-secondary)] hover:text-[var(--ink)]',
          'transition-colors duration-100',
          'z-40 cursor-pointer',
        )}
        style={{ boxShadow: 'var(--shadow-control)' }}
      >
        {collapsed ? (
          <ChevronRight size={12} strokeWidth={2} aria-hidden="true" />
        ) : (
          <ChevronLeft size={12} strokeWidth={2} aria-hidden="true" />
        )}
      </button>
    </aside>
  )
}
