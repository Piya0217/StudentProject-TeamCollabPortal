/**
 * MobileTabBar — bottom tab bar for mobile (< md).
 * Translucent glass. 44px touch targets. Hidden on desktop.
 * Faculty-only Reviews tab omitted for students.
 */
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutGrid, CheckSquare, Users, FileText, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/cn'

interface TabItem {
  path: string
  label: string
  icon: React.ReactNode
  facultyOnly?: boolean
}

const tabs: TabItem[] = [
  { path: '/dashboard', label: 'Projects', icon: <LayoutGrid size={20} strokeWidth={1.5} /> },
  { path: '/tasks', label: 'Tasks', icon: <CheckSquare size={20} strokeWidth={1.5} /> },
  { path: '/teams', label: 'Teams', icon: <Users size={20} strokeWidth={1.5} /> },
  { path: '/files', label: 'Files', icon: <FileText size={20} strokeWidth={1.5} /> },
  {
    path: '/reviews',
    label: 'Reviews',
    icon: <ClipboardList size={20} strokeWidth={1.5} />,
    facultyOnly: true,
  },
]

interface MobileTabBarProps {
  role: 'student' | 'faculty'
}

export function MobileTabBar({ role }: MobileTabBarProps) {
  const location = useLocation()
  const visibleTabs = tabs.filter((t) => !t.facultyOnly || role === 'faculty')

  return (
    <nav
      className={cn(
        'md:hidden fixed bottom-0 left-0 right-0 z-40',
        'glass-surface flex items-stretch',
      )}
      style={{
        height: 'var(--mobile-tabbar-height)',
        borderTop: '1px solid var(--hairline)',
      }}
      aria-label="Mobile navigation"
    >
      {visibleTabs.map((tab) => {
        const isActive =
          tab.path === '/dashboard'
            ? location.pathname === '/dashboard' || location.pathname === '/'
            : location.pathname.startsWith(tab.path)

        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1',
              'min-h-[44px] font-medium select-none transition-colors duration-100',
            )}
            style={{
              fontSize: 'var(--size-caption)',
              color: isActive ? 'var(--accent)' : 'var(--ink-secondary)',
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            <span aria-hidden="true">{tab.icon}</span>
            <span>{tab.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
