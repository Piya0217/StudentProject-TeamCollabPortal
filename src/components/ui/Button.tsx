/**
 * Button — primary, secondary, plain variants.
 * :active scale(0.97) per motion rules.
 * Strict 44px touch target. No arrows appended to labels.
 */
import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'plain' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant
  /** Size variant */
  size?: ButtonSize
  /** Show loading spinner and disable interaction */
  loading?: boolean
  /** Full width */
  fullWidth?: boolean
  /** Icon to render before label */
  iconStart?: React.ReactNode
  /** Icon to render after label */
  iconEnd?: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white hover:opacity-90 active:scale-[0.97] shadow-control ' +
    'dark:bg-accent dark:text-white',
  secondary:
    'bg-fill-tertiary text-ink hover:bg-fill-quaternary active:scale-[0.97] ' +
    'border border-hairline shadow-control',
  plain:
    'bg-transparent text-accent hover:bg-accent-subtle active:scale-[0.97] ' +
    'dark:text-accent',
  destructive:
    'bg-priority-high text-white hover:opacity-90 active:scale-[0.97] shadow-control',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-caption gap-1.5 rounded-control',
  md: 'h-10 px-4 text-body gap-2 rounded-control min-h-[44px]',
  lg: 'h-12 px-6 text-headline gap-2 rounded-control min-h-[44px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      iconStart,
      iconEnd,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled ?? loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          'inline-flex items-center justify-center select-none',
          'font-semibold whitespace-nowrap',
          'transition-[transform,opacity,background-color] duration-[var(--duration-press)]',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className,
        )}
        {...props}
      >
        {loading ? (
          <LoadingSpinner size={size} />
        ) : (
          <>
            {iconStart && <span className="shrink-0">{iconStart}</span>}
            {children}
            {iconEnd && <span className="shrink-0">{iconEnd}</span>}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'

/** Inline loading spinner — CSS only, no layout shift */
function LoadingSpinner({ size }: { size: ButtonSize }) {
  const spinnerSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  return (
    <svg
      className={cn(spinnerSize, 'animate-spin')}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
