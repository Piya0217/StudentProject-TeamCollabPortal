/**
 * Chip — dismissible or static filter/skill tag.
 * Uses radius-chip (8px). Lucide X for dismiss.
 */
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface ChipProps {
  label: string
  /** Icon before label */
  icon?: React.ReactNode
  /** Called when X is pressed — makes chip dismissible */
  onDismiss?: () => void
  /** Visual style */
  variant?: 'default' | 'selected' | 'skill' | 'status'
  /** Custom color accent (for status/priority chips) */
  color?: string
  className?: string
}

const variantClasses: Record<string, string> = {
  default: 'bg-fill-quaternary text-ink-secondary border-hairline hover:bg-fill-tertiary',
  selected: 'bg-accent-subtle text-accent border-transparent',
  skill: 'bg-fill-quaternary text-ink border-hairline',
  status: 'border-transparent',
}

export function Chip({ label, icon, onDismiss, variant = 'default', color, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1',
        'rounded-chip border text-caption font-medium',
        'transition-colors duration-100',
        variantClasses[variant] ?? variantClasses['default'],
        className,
      )}
      style={color ? { color, borderColor: `${color}33`, backgroundColor: `${color}18` } : undefined}
    >
      {icon && <span aria-hidden="true" className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            'ml-0.5 -mr-0.5 shrink-0 rounded-full p-0.5',
            'text-current opacity-60 hover:opacity-100',
            'transition-opacity duration-100',
            'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent',
            'min-w-[20px] min-h-[20px] flex items-center justify-center',
          )}
          aria-label={`Remove ${label}`}
        >
          <X size={10} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
    </span>
  )
}
