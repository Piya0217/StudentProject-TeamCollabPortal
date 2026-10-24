/**
 * EmptyState — action-oriented empty state.
 * Always invites an action. Never says "nothing here".
 */
import { cn } from '@/lib/cn'
import { Button } from './Button'

export interface EmptyStateProps {
  /** Lucide icon */
  icon: React.ReactNode
  /** Primary heading — sentence case, active */
  title: string
  /** Supporting description */
  description?: string
  /** CTA button label — says exactly what happens */
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'py-16 px-6 gap-4',
        className,
      )}
      role="status"
    >
      <div className="text-ink-secondary opacity-40" aria-hidden="true">
        {icon}
      </div>
      <div className="space-y-1.5 max-w-xs">
        <p className="text-headline text-ink">{title}</p>
        {description && <p className="text-body text-ink-secondary">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
