/**
 * StatusBadge, PriorityBadge, HealthBadge
 * RULES: Always icon + text label. Never color alone.
 * All use Lucide icons at 1.5 strokeWidth.
 */
import {
  Circle,
  Clock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  ArrowUp,
  Minus,
  ArrowDown,
} from 'lucide-react'
import { cn } from '@/lib/cn'

// ─── Task Status ─────────────────────────────────────────────────────────────

export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done'

const statusConfig: Record<
  TaskStatus,
  { label: string; icon: React.ReactNode; colorVar: string }
> = {
  'todo': {
    label: 'To do',
    icon: <Circle size={12} strokeWidth={1.5} aria-hidden="true" />,
    colorVar: 'var(--status-todo)',
  },
  'in-progress': {
    label: 'In progress',
    icon: <Clock size={12} strokeWidth={1.5} aria-hidden="true" />,
    colorVar: 'var(--status-in-progress)',
  },
  'in-review': {
    label: 'In review',
    icon: <Eye size={12} strokeWidth={1.5} aria-hidden="true" />,
    colorVar: 'var(--status-in-review)',
  },
  'done': {
    label: 'Done',
    icon: <CheckCircle2 size={12} strokeWidth={1.5} aria-hidden="true" />,
    colorVar: 'var(--status-done)',
  },
}

export interface StatusBadgeProps {
  status: TaskStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5',
        'rounded-chip text-caption font-medium',
        'border',
        className,
      )}
      style={{
        color: cfg.colorVar,
        borderColor: `color-mix(in srgb, ${cfg.colorVar} 25%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${cfg.colorVar} 12%, transparent)`,
      }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

// ─── Task Priority ────────────────────────────────────────────────────────────

export type TaskPriority = 'high' | 'medium' | 'low'

const priorityConfig: Record<
  TaskPriority,
  { label: string; icon: React.ReactNode; colorVar: string }
> = {
  high: {
    label: 'High',
    icon: <ArrowUp size={12} strokeWidth={1.5} aria-hidden="true" />,
    colorVar: 'var(--priority-high)',
  },
  medium: {
    label: 'Medium',
    icon: <Minus size={12} strokeWidth={1.5} aria-hidden="true" />,
    colorVar: 'var(--priority-medium)',
  },
  low: {
    label: 'Low',
    icon: <ArrowDown size={12} strokeWidth={1.5} aria-hidden="true" />,
    colorVar: 'var(--priority-low)',
  },
}

export interface PriorityBadgeProps {
  priority: TaskPriority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const cfg = priorityConfig[priority]
  return (
    <span
      className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-chip text-caption font-medium border', className)}
      style={{
        color: cfg.colorVar,
        borderColor: `color-mix(in srgb, ${cfg.colorVar} 25%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${cfg.colorVar} 12%, transparent)`,
      }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

// ─── Project Health ───────────────────────────────────────────────────────────

export type ProjectHealth = 'on-track' | 'at-risk' | 'overdue'

const healthConfig: Record<
  ProjectHealth,
  { label: string; icon: React.ReactNode; colorVar: string }
> = {
  'on-track': {
    label: 'On track',
    icon: <ShieldCheck size={12} strokeWidth={1.5} aria-hidden="true" />,
    colorVar: 'var(--health-ontrack)',
  },
  'at-risk': {
    label: 'At risk',
    icon: <AlertTriangle size={12} strokeWidth={1.5} aria-hidden="true" />,
    colorVar: 'var(--health-atrisk)',
  },
  overdue: {
    label: 'Overdue',
    icon: <AlertCircle size={12} strokeWidth={1.5} aria-hidden="true" />,
    colorVar: 'var(--health-overdue)',
  },
}

export interface HealthBadgeProps {
  health: ProjectHealth
  className?: string
}

export function HealthBadge({ health, className }: HealthBadgeProps) {
  const cfg = healthConfig[health]
  return (
    <span
      className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-chip text-caption font-medium border', className)}
      style={{
        color: cfg.colorVar,
        borderColor: `color-mix(in srgb, ${cfg.colorVar} 25%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${cfg.colorVar} 12%, transparent)`,
      }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  )
}
