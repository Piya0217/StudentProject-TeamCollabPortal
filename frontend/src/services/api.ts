import { students } from '../mocks/seed'
import type { Health, PortalUser, Project, Task, TaskStatus } from '../types'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api').replace(/\/$/, '')
type DbProject = { id: number; title: string; description: string | null; owner_id: number; faculty_id?: number | null; status: string; progress_percent?: number; created_at?: string; owner_name?: string; done_tasks?: number; total_tasks?: number; latest_review?: { comment: string; review_status: string } | null }
type DbTask = { id: number; project_id: number; title: string; description?: string | null; assignee_id?: number | null; assignee_name?: string | null; deadline?: string | null; priority: string; status: string }
type ApiProjectDetail = { project: DbProject; members: { id: number; name: string }[] }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(API_BASE + path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new Error('Can’t reach the backend. Start the API at http://localhost:4000, then try again.')
  }
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'The server could not complete this request.')
  return body as T
}

const fromTaskStatus = (status: string): TaskStatus => ({
  todo: 'To do', in_progress: 'In progress', done: 'Done',
} as Record<string, TaskStatus>)[status] || 'To do'
const toTaskStatus = (status: TaskStatus) => status === 'Done' ? 'done' : status === 'To do' ? 'todo' : 'in_progress'
const displayDate = (date?: string | null) => date ? new Date(date + (date.length === 10 ? 'T12:00:00' : '')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'
const fromTask = (row: DbTask): Task => ({
  id: String(row.id), title: row.title, projectId: String(row.project_id), assigneeId: row.assignee_id == null ? null : Number(row.assignee_id),
  assignee: row.assignee_name || 'Unassigned', status: fromTaskStatus(row.status),
  priority: row.priority.charAt(0).toUpperCase() + row.priority.slice(1) as Task['priority'],
  due: displayDate(row.deadline), description: row.description || '', comments: [],
})
const fromProject = (row: DbProject, members: string[], tasks: Task[]): Project => {
  const total = tasks.length || Number(row.total_tasks || 0)
  const done = tasks.length ? tasks.filter((task) => task.status === 'Done').length : Number(row.done_tasks || 0)
  const status: Health = row.status === 'on_hold' ? 'At risk' : 'On track'
  return {
    id: String(row.id), title: row.title, summary: row.description || 'A collaborative student project.',
    health: status, progress: tasks.length ? Math.round(done / total * 100) : Number(row.progress_percent ?? (total ? Math.round(done / total * 100) : 0)),
    due: tasks.map((task) => task.due).filter((date) => date !== 'Not set').sort().at(-1) || 'Not set',
    team: members.length ? members : [row.owner_name || 'Project lead'],
    nextMilestone: 'Project milestone', lastActivity: 'Live from project database',
    milestones: [], facultyId: row.faculty_id,
  }
}

export const portalApi = {
  async login(email: string, password: string) {
    const result = await request<{ user: PortalUser }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    })
    return { ...result.user, id: Number(result.user.id), skills: result.user.skills || [], interests: result.user.interests || [] }
  },

  async updateProfile(userId: number, profile: Partial<PortalUser>) {
    const result = await request<{ user: PortalUser }>('/users/' + userId + '/profile', {
      method: 'PATCH', body: JSON.stringify(profile),
    })
    return { ...result.user, id: Number(result.user.id), skills: result.user.skills || [], interests: result.user.interests || [] }
  },

  async getWorkspace(user: PortalUser) {
    const path = user.role === 'faculty'
      ? '/faculty/projects?facultyId=' + encodeURIComponent(String(user.id))
      : '/projects?userId=' + encodeURIComponent(String(user.id))
    const result = await request<{ projects: DbProject[] }>(path)
    const details = await Promise.all(result.projects.map(async (row) => {
      const detail = await request<ApiProjectDetail>('/projects/' + row.id)
      const taskResult = await request<{ tasks: DbTask[] }>('/projects/' + row.id + '/tasks')
      return { row: { ...row, ...detail.project }, members: detail.members.map((m) => m.name), tasks: taskResult.tasks.map(fromTask) }
    }))
    return {
      projects: details.map((d) => fromProject(d.row, d.members, d.tasks)),
      tasks: details.flatMap((d) => d.tasks),
    }
  },

  async createProject(project: Project, ownerId: number, memberIds: string[]) {
    const result = await request<{ project: DbProject }>('/projects', {
      method: 'POST',
      body: JSON.stringify({ title: project.title, description: project.summary, owner_id: ownerId, faculty_id: project.facultyId ?? 3, status: 'active' }),
    })
    for (const memberId of memberIds) {
      if (Number(memberId) === ownerId) continue
      await request('/projects/' + result.project.id + '/members', {
        method: 'POST', body: JSON.stringify({ user_id: Number(memberId), team_role: 'member' }),
      })
    }
    const detail = await request<ApiProjectDetail>('/projects/' + result.project.id)
    return fromProject(detail.project, detail.members.map((m) => m.name), [])
  },

  async createTask(projectId: string, title: string, userId: number) {
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 7)
    const result = await request<{ task: DbTask }>('/projects/' + projectId + '/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, assignee_id: userId, deadline: deadline.toISOString().slice(0, 10), priority: 'medium', status: 'todo' }),
    })
    return fromTask(result.task)
  },

  async saveTask(task: Task) {
    const result = await request<{ task: DbTask }>('/tasks/' + task.id, {
      method: 'PATCH', body: JSON.stringify({ status: toTaskStatus(task.status) }),
    })
    return { ...fromTask(result.task), assignee: task.assignee }
  },

  async submitReview(projectId: string, facultyId: number, comment: string, approved: boolean) {
    return request('/projects/' + projectId + '/reviews', {
      method: 'POST',
      body: JSON.stringify({ faculty_id: facultyId, comment, review_status: approved ? 'approved' : 'needs_changes' }),
    })
  },

  students,
}
