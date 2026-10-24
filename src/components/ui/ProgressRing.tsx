/**
 * ProgressRing — SVG circular progress indicator.
 * Animates strokeDashoffset on mount and value change (400ms ease-out).
 * No confetti. Transform + opacity only.
 */
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'

export interface ProgressRingProps {
  /** 0–100 */
  value: number
  /** Ring diameter in px */
  size?: number
  /** Stroke thickness in px */
  strokeWidth?: number
  /** Custom track color (defaults to hairline) */
  trackColor?: string
  /** Custom fill color (defaults to accent) */
  fillColor?: string
  /** Label rendered in center */
  label?: string
  /** aria-label for screen readers */
  'aria-label'?: string
  className?: string
}

export function ProgressRing({
  value,
  size = 48,
  strokeWidth = 3.5,
  trackColor,
  fillColor,
  label,
  'aria-label': ariaLabel,
  className,
}: ProgressRingProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clampedValue / 100) * circumference

  const progressRef = useRef<SVGCircleElement>(null)

  // Animate on mount and value change — only transform (strokeDashoffset)
  useEffect(() => {
    const el = progressRef.current
    if (!el) return
    el.style.transition = 'none'
    el.style.strokeDashoffset = String(circumference)
    // Force reflow to restart animation
    void el.getBoundingClientRect()
    el.style.transition = `stroke-dashoffset var(--duration-progress, 400ms) var(--ease-out, cubic-bezier(0.23,1,0.32,1))`
    el.style.strokeDashoffset = String(offset)
  }, [value, circumference, offset])

  return (
    <div
      className={cn('relative inline-flex items-center justify-center shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel ?? `${clampedValue}% complete`}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor ?? 'var(--hairline)'}
          strokeWidth={strokeWidth}
          opacity={0.5}
        />
        {/* Progress fill */}
        <circle
          ref={progressRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={fillColor ?? 'var(--accent)'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      {label !== undefined && (
        <span
          className="absolute text-caption font-semibold text-ink"
          aria-hidden="true"
        >
          {label}
        </span>
      )}
    </div>
  )
}
