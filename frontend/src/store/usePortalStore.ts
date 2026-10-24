import { create } from 'zustand'
import type { PortalUser, Project, Role, Task, TaskStatus } from '../types'
import { portalApi } from '../services/api'

interface PortalState {
  role: Role
  signedIn: boolean
  theme: 'light' | 'dark'
  projects: Project[]
  tasks: Task[]
  user: PortalUser | null
  activeProjectId: string
  setRole: (role: Role) => void
  signIn: (email: string, password: string) => Promise<PortalUser>
  updateProfile: (profile: Partial<PortalUser>) => Promise<void>
  signOut: () => void
  toggleTheme: () => void
  setActiveProject: (id: string) => void
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>
  addProject: (project: Project, memberIds: string[]) => Promise<Project>
  addTask: (projectId: string, title: string) => Promise<Task>
  submitReview: (projectId: string, comment: string, approved: boolean) => Promise<void>
  resetDemo: () => void
}
export const usePortalStore = create<PortalState>((set, get) => ({
  role: 'Student', signedIn: false, theme: 'light', projects: [], tasks: [], user: null, activeProjectId: 'p1',
  setRole: role => set({ role }),
  signIn: async (email, password) => {
    const user = await portalApi.login(email, password)
    const workspace = await portalApi.getWorkspace(user)
    set({ user, role: user.role === 'faculty' ? 'Faculty' : 'Student', projects: workspace.projects, tasks: workspace.tasks, signedIn: true, activeProjectId: workspace.projects[0]?.id || '' })
    return user
  },
  updateProfile: async profile => {
    const user = get().user
    if (!user) throw new Error('Sign in before updating your profile.')
    const saved = await portalApi.updateProfile(user.id, profile)
    set({ user: saved })
  },
  signOut: () => set({ signedIn: false, user: null, projects: [], tasks: [] }),
  toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setActiveProject: id => set({ activeProjectId: id }),
  updateTaskStatus: async (id, status) => {
    const task = get().tasks.find(t => t.id === id)
    if (!task) return
    const saved = await portalApi.saveTask({ ...task, status })
    set(s => ({ tasks: s.tasks.map(t => t.id === id ? saved : t) }))
  },
  addProject: async (project, memberIds) => {
    const user = get().user
    if (!user) throw new Error('Sign in before creating a project.')
    const saved = await portalApi.createProject(project, user.id, memberIds)
    set(s => ({ projects: [saved, ...s.projects], activeProjectId: saved.id }))
    return saved
  },
  addTask: async (projectId, title) => {
    const user = get().user
    if (!user) throw new Error('Sign in before creating a task.')
    const saved = await portalApi.createTask(projectId, title, user.id)
    set(s => ({ tasks: [saved, ...s.tasks] }))
    return saved
  },
  submitReview: async (projectId, comment, approved) => {
    const user = get().user
    if (!user || user.role !== 'faculty') throw new Error('Sign in with a faculty account to submit a review.')
    await portalApi.submitReview(projectId, user.id, comment, approved)
  },
  resetDemo: () => set({ projects: [], tasks: [], signedIn: false, user: null, role: 'Student', activeProjectId: '' })
}))
