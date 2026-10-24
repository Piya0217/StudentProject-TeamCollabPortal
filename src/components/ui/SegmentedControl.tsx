/**
 * SegmentedControl — Apple-style sliding pill indicator.
 * Animates via Motion layoutId for smooth item transitions.
 * Keyboard: arrow keys navigate between segments.
 */
import { useId, useRef, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'

export interface SegmentedControlOption<T extends string> {
  value: T
  label: string
  /** Optional icon before label */
  icon?: React.ReactNode
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Accessible label for the group */
  'aria-label': string
  size?: 'sm' | 'md'
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  const layoutId = useId()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = options.findIndex((o) => o.value === value)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = options[(idx + 1) % options.length]
      if (next) onChange(next.value)
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = options[(idx - 1 + options.length) % options.length]
      if (prev) onChange(prev.value)
    }
  }

  const sizeClass = size === 'sm' ? 'h-8 p-0.5 text-caption' : 'h-10 p-1 text-body'
  const itemClass = size === 'sm' ? 'px-3 py-1' : 'px-4 py-1.5'

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative inline-flex items-center',
        'bg-fill-quaternary rounded-control',
        sizeClass,
        className,
      )}
    >
      <AnimatePresence initial={false}>
        {options.map((option) => {
          const isSelected = option.value === value
          return (
            <div key={option.value} className="relative flex-1 min-w-0">
              {isSelected && (
                <motion.div
                  layoutId={`seg-pill-${layoutId}`}
                  className="absolute inset-0 rounded-[8px] bg-surface shadow-control"
                  transition={{
                    type: 'spring',
                    bounce: 0,
                    duration: 0.3,
                  }}
                  aria-hidden="true"
                />
              )}
              <button
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onChange(option.value)}
                className={cn(
                  'relative z-10 w-full flex items-center justify-center gap-1.5',
                  'font-semibold select-none whitespace-nowrap transition-colors duration-100',
                  itemClass,
                  isSelected ? 'text-ink' : 'text-ink-secondary hover:text-ink',
                )}
              >
                {option.icon && <span aria-hidden="true">{option.icon}</span>}
                {option.label}
              </button>
            </div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
