import { create } from 'zustand'
import type { Project, Role, Task, TaskStatus } from '../types'
import { mockApi } from '../services/api'

interface PortalState {
  role: Role
  signedIn: boolean
  theme: 'light' | 'dark'
  projects: Project[]
  tasks: Task[]
  activeProjectId: string
  setRole: (role: Role) => void
  signIn: () => void
  signOut: () => void
  toggleTheme: () => void
  setActiveProject: (id: string) => void
  updateTaskStatus: (id: string, status: TaskStatus) => void
  addProject: (project: Project) => void
  addTask: (task: Task) => void
  reviewMilestone: (projectId: string, outcome: 'approved' | 'changes') => void
  resetDemo: () => void
}
const initialTheme = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
export const usePortalStore = create<PortalState>((set) => ({
  role: 'Student', signedIn: false, theme: initialTheme, projects: [], tasks: [], activeProjectId: 'p1',
  setRole: role => set({ role }),
  signIn: () => set({ signedIn: true }),
  signOut: () => set({ signedIn: false }),
  toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setActiveProject: id => set({ activeProjectId: id }),
  updateTaskStatus: (id, status) => set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, status } : t) })),
  addProject: project => set(s => ({ projects: [project, ...s.projects], activeProjectId: project.id })),
  addTask: task => set(s => ({ tasks: [task, ...s.tasks] })),
  reviewMilestone: (projectId, outcome) => set(s => ({
    projects: s.projects.map(p => p.id !== projectId ? p : {
      ...p,
      health: outcome === 'approved' ? 'On track' : 'At risk',
      lastActivity: 'Just now',
      milestones: p.milestones.map(m => m.title === p.nextMilestone ? { ...m, status: outcome === 'approved' ? 'Complete' : 'Upcoming' } : m)
    })
  })),
  resetDemo: () => { void mockApi.reset(); set({ projects: [], tasks: [], signedIn: false, role: 'Student', activeProjectId: 'p1' }) }
}))