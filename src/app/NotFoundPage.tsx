/**
 * 404 Not Found page.
 * Actionable — tells you what happened and what to do.
 * Never apologetic.
 */
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 p-8 text-center">
      <div
        className="w-16 h-16 rounded-card bg-fill-quaternary flex items-center justify-center"
        aria-hidden="true"
      >
        <MapPin size={32} strokeWidth={1.5} className="text-ink-secondary" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h1 className="text-title-1 text-ink">Page not found</h1>
        <p className="text-body text-ink-secondary">
          The page you're looking for was moved, deleted, or doesn't exist.
          Check the URL or go back to the dashboard.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Go to dashboard
        </Button>
      </div>
    </div>
  )
}
