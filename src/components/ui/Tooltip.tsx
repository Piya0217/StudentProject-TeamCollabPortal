/**
 * Tooltip — Radix UI tooltip with design-rule compliant animation.
 * 125ms ease-out, scale(0.96)→scale(1), origin at trigger.
 * Hover-only (no tooltip on touch devices).
 */
import * as RadixTooltip from '@radix-ui/react-tooltip'
import { cn } from '@/lib/cn'

export interface TooltipProps {
  /** Tooltip text content */
  content: string
  /** The element that triggers the tooltip */
  children: React.ReactNode
  /** Placement relative to trigger */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /** Delay before showing (ms) */
  delayDuration?: number
  className?: string
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delayDuration = 400,
  className,
}: TooltipProps) {
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          className={cn(
            'z-50 px-2.5 py-1.5 rounded-chip',
            'bg-[var(--surface-raised)] shadow-sheet border border-[var(--hairline)]',
            'text-[length:var(--size-caption)] text-[var(--ink)] font-medium',
            'select-none pointer-events-none',
            'will-change-[transform,opacity]',
            className,
          )}
          style={{
            animationDuration: '125ms',
            animationTimingFunction: 'cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          {content}
          <RadixTooltip.Arrow className="fill-[var(--surface-raised)]" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}

/** Provider to be mounted once at app root */
export const TooltipProvider = RadixTooltip.Provider
