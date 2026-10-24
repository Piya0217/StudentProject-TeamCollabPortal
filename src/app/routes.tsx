/**
 * App routes — lazy-loaded, error-bounded, with placeholder pages.
 * Route transitions handled by AppShell AnimatePresence.
 */
import { lazy, Suspense } from 'react'
import { createBrowserRouter, redirect } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { ErrorBoundary } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import NotFoundPage from './NotFoundPage'

// Lazy-loaded route components — route-level code splitting
const LoginPage = lazy(() => import('@/features/auth/LoginPage'))
const DashboardPage = lazy(() => import('@/features/projects/DashboardPage'))
const CreateProjectPage = lazy(() => import('@/features/projects/CreateProjectPage'))
const ProjectWorkspacePage = lazy(() => import('@/features/projects/ProjectWorkspacePage'))
const TasksPage = lazy(() => import('@/features/tasks/TasksPage'))
const TeamsPage = lazy(() => import('@/features/teams/TeamsPage'))
const ProfilePage = lazy(() => import('@/features/teams/ProfilePage'))
const FilesPage = lazy(() => import('@/features/projects/FilesPage'))
const FacultyDashboardPage = lazy(() => import('@/features/faculty/FacultyDashboardPage'))
const FacultyReviewsPage = lazy(() => import('@/features/faculty/FacultyReviewsPage'))

/** Route-level Suspense fallback — full-page skeleton */
function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-4 max-w-content mx-auto">
          <Skeleton height={34} width="40%" className="rounded-control" />
          <Skeleton height={16} width="60%" className="rounded-control" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={160} className="rounded-card" />
            ))}
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

/** Wrap each route element in an error boundary */
function RouteWrapper({ element, children }: { element?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <PageSuspense>{element ?? children}</PageSuspense>
    </ErrorBoundary>
  )
}

export const router = createBrowserRouter([
  // Login — standalone, no shell
  {
    path: '/login',
    element: (
      <RouteWrapper>
        <LoginPage />
      </RouteWrapper>
    ),
  },

  // App shell wraps all authenticated routes
  {
    path: '/',
    element: <AppShell />,
    errorElement: (
      <RouteWrapper>
        <NotFoundPage />
      </RouteWrapper>
    ),
    children: [
      // Default redirect to dashboard
      { index: true, loader: () => redirect('/dashboard') },

      { path: 'dashboard', element: <RouteWrapper element={<DashboardPage />} /> },
      { path: 'projects/new', element: <RouteWrapper element={<CreateProjectPage />} /> },
      { path: 'projects/:id', element: <RouteWrapper element={<ProjectWorkspacePage />} /> },
      { path: 'tasks', element: <RouteWrapper element={<TasksPage />} /> },
      { path: 'teams', element: <RouteWrapper element={<TeamsPage />} /> },
      { path: 'teams/:userId', element: <RouteWrapper element={<ProfilePage />} /> },
      { path: 'files', element: <RouteWrapper element={<FilesPage />} /> },
      { path: 'reviews', element: <RouteWrapper element={<FacultyReviewsPage />} /> },
      { path: 'faculty', element: <RouteWrapper element={<FacultyDashboardPage />} /> },

      // 404 catch-all
      { path: '*', element: <RouteWrapper element={<NotFoundPage />} /> },
    ],
  },
])
