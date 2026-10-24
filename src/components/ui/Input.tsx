/**
 * Input — text input with label, error, and optional icon adornments.
 * Labeled inputs always. Inline validation-ready.
 */
import { forwardRef, useId } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visible label (required for accessibility) */
  label: string
  /** Error message */
  error?: string
  /** Helper text below field */
  hint?: string
  /** Icon before input value */
  iconStart?: React.ReactNode
  /** Icon after input value */
  iconEnd?: React.ReactNode
  /** Hide the visible label (label still read by screen readers) */
  hideLabel?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, iconStart, iconEnd, hideLabel = false, className, id: externalId, ...props },
    ref,
  ) => {
    const generatedId = useId()
    const id = externalId ?? generatedId
    const errorId = `${id}-error`
    const hintId = `${id}-hint`

    return (
      <div className="flex flex-col gap-[var(--space-1)]">
        <label
          htmlFor={id}
          className={cn(
            'text-caption font-medium text-ink-secondary',
            hideLabel && 'sr-only',
          )}
        >
          {label}
        </label>

        <div className="relative flex items-center">
          {iconStart && (
            <span className="absolute left-3 text-ink-secondary pointer-events-none" aria-hidden="true">
              {iconStart}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              [error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined
            }
            className={cn(
              'w-full h-10 min-h-[44px] rounded-control',
              'bg-surface border border-hairline',
              'text-body text-ink placeholder:text-ink-secondary',
              'px-3 py-2 transition-[border-color,box-shadow] duration-[var(--duration-press)]',
              'focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-priority-high focus-visible:border-priority-high focus-visible:ring-priority-high/30',
              iconStart && 'pl-9',
              iconEnd && 'pr-9',
              className,
            )}
            {...props}
          />
          {iconEnd && (
            <span className="absolute right-3 text-ink-secondary pointer-events-none" aria-hidden="true">
              {iconEnd}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-caption text-priority-high">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-caption text-ink-secondary">
            {hint}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
