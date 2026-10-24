/**
 * ErrorState — direct, actionable error display.
 * Says what happened and how to fix it. Never apologises.
 * Used as error boundary fallback and inline error state.
 */
import { AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

export interface ErrorStateProps {
  /** What went wrong — plain language, no tech jargon */
  title?: string
  /** What the user can do to fix it */
  description?: string
  /** Retry action */
  onRetry?: () => void
  /** Custom CTA label */
  retryLabel?: string
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Refresh the page or try again in a moment.',
  onRetry,
  retryLabel = 'Try again',
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'py-16 px-6 gap-4',
        className,
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="text-priority-high" aria-hidden="true">
        <AlertCircle size={40} strokeWidth={1.5} />
      </div>
      <div className="space-y-1.5 max-w-xs">
        <p className="text-headline text-ink">{title}</p>
        <p className="text-body text-ink-secondary">{description}</p>
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          onClick={onRetry}
          iconStart={<RefreshCw size={15} strokeWidth={1.5} aria-hidden="true" />}
          className="mt-2"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

/** React Error Boundary wrapper */
import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <ErrorState
          title="This section failed to load"
          description="The error has been logged. Refresh this section to continue."
          onRetry={() => this.setState({ hasError: false, error: null })}
          retryLabel="Reload section"
        />
      )
    }
    return this.props.children
  }
}
