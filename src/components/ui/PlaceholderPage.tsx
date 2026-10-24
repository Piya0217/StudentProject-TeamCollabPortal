/**
 * Placeholder page component — used for all screens pending implementation.
 * Shows route name and brief description.
 */
import { cn } from '@/lib/cn'

interface PlaceholderPageProps {
  title: string
  description?: string
  className?: string
}

export function PlaceholderPage({ title, description, className }: PlaceholderPageProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8', className)}>
      <div
        className="w-12 h-12 rounded-card bg-fill-quaternary border border-hairline flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="text-headline text-ink-secondary">✦</span>
      </div>
      <div className="text-center space-y-2 max-w-sm">
        <h1 className="text-title-2 text-ink">{title}</h1>
        {description && <p className="text-body text-ink-secondary">{description}</p>}
        <p className="text-caption text-ink-secondary pt-2">
          Implementation coming in the next step.
        </p>
      </div>
    </div>
  )
}
