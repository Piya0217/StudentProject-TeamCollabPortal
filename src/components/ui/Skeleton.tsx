/**
 * Skeleton — shimmer loading placeholder.
 * CSS animation only. No layout shift (uses same dimensions as content).
 */
import { cn } from '@/lib/cn'

export interface SkeletonProps {
  /** Width — defaults to 100% */
  width?: string | number
  /** Height — required or use className */
  height?: string | number
  /** Shape: rectangle or circle */
  shape?: 'rect' | 'circle' | 'text'
  className?: string
  /** Number of text lines (when shape=text) */
  lines?: number
}

export function Skeleton({ width, height, shape = 'rect', className, lines = 1 }: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width ?? '100%',
    height: height,
  }

  if (shape === 'text') {
    return (
      <div className="flex flex-col gap-2" aria-hidden="true" role="presentation">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn('skeleton-shimmer rounded-chip', className)}
            style={{
              height: height ?? '14px',
              width: i === lines - 1 && lines > 1 ? '66%' : (width ?? '100%'),
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={cn(
        'skeleton-shimmer',
        shape === 'circle' ? 'rounded-full' : 'rounded-card',
        className,
      )}
      style={style}
    />
  )
}

/** Card-level skeleton for project/task cards */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('bg-surface rounded-card p-4 space-y-3', className)}
      aria-label="Loading content"
      role="status"
    >
      <div className="flex items-center gap-3">
        <Skeleton shape="circle" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton shape="text" height={14} width="60%" />
          <Skeleton shape="text" height={12} width="40%" />
        </div>
      </div>
      <Skeleton height={12} />
      <Skeleton height={12} width="75%" />
      <div className="flex gap-2 pt-1">
        <Skeleton height={22} width={64} className="rounded-chip" />
        <Skeleton height={22} width={64} className="rounded-chip" />
      </div>
    </div>
  )
}
