/**
 * IconButton — square button for icon-only actions.
 * Includes aria-label requirement for accessibility.
 * 44px minimum touch target.
 */
import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: screen-reader label for the icon action */
  'aria-label': string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Visual style */
  variant?: 'ghost' | 'subtle' | 'filled'
}

const sizeClasses = {
  sm: 'w-8 h-8 rounded-control',
  md: 'w-10 h-10 rounded-control min-w-[44px] min-h-[44px]',
  lg: 'w-11 h-11 rounded-control min-w-[44px] min-h-[44px]',
}

const variantClasses = {
  ghost: 'bg-transparent text-ink-secondary hover:text-ink hover:bg-fill-quaternary',
  subtle: 'bg-fill-quaternary text-ink-secondary hover:text-ink hover:bg-fill-tertiary',
  filled: 'bg-fill-tertiary text-ink shadow-control hover:bg-fill-quaternary',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = 'md', variant = 'ghost', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center shrink-0 select-none',
          'transition-[transform,background-color,color] duration-[var(--duration-press)]',
          'active:scale-[0.97]',
          sizeClasses[size],
          variantClasses[variant],
          props.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className,
        )}
        {...props}
      />
    )
  },
)

IconButton.displayName = 'IconButton'
