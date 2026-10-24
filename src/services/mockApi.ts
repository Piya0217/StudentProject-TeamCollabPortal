/**
 * services/mockApi.ts
 * In-memory / localStorage mock backend satisfying the Api interface.
 * Simulates realistic network latency (100-250ms) with zero dependencies.
 * Seeded with full Indian university dataset.
 */
import type {
  Api,
  LoginPayload,
  AuthResult,
  CreateProjectPayload,
  UpdateProjectPayload,
  CreateTaskPayload,
  UpdateTaskPayload,
  MoveTaskPayload,
  CreateMilestonePayload,
  SubmitMilestonePayload,
  ReviewMilestonePayload,
  UploadFilePayload,
  AddLinkPayload,
  UpdateProfilePayload,
} from './api'
import { ApiError } from './api'
import type {
  User,
  Project,
  Task,
  TeamMember,
  Invite,
  InviteStatus,
  Milestone,
  MilestoneStatus,
  Comment,
  FileAsset,
  Link,
  Activity,
} from '@/lib/schemas'
import { SEED_SNAPSHOT, type SeedSnapshot } from '@/mocks/seedData'

const STORAGE_KEY = 'collab_portal_db_v1'

interface DbState {
  users: User[]
  projects: Project[]
  teamMembers: TeamMember[]
  invites: Invite[]
  tasks: Task[]
  milestones: Milestone[]
  comments: Comment[]
  files: FileAsset[]
  links: Link[]
  activities: Activity[]
  currentUser: User | null
}

function clone<T>(val: T): T {
  if (val === undefined) return undefined as unknown as T
  return JSON.parse(JSON.stringify(val))
}

function loadInitialState(): DbState {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        return JSON.parse(raw) as DbState
      } catch {
        // fallback if corrupted
      }
    }
  }
  const snap = clone(SEED_SNAPSHOT) as SeedSnapshot
  return {
    ...snap,
    currentUser: snap.users.find((u) => u.role === 'student') ?? snap.users[0],
  }
}

class MockApiImpl implements Api {
  private state: DbState
  private latencyMs: number = 80

  constructor() {
    this.state = loadInitialState()
  }

  private persist() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
      } catch {
        // quota exceeded or private mode
      }
    }
  }

  private async delay<T>(value: T): Promise<T> {
    if (this.latencyMs > 0) {
      await new Promise((r) => setTimeout(r, this.latencyMs))
    }
    return clone(value)
  }

  setLatency(ms: number) {
    this.latencyMs = ms
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  async login(payload: LoginPayload): Promise<AuthResult> {
    const match = this.state.users.find(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase() && u.role === payload.role,
    )
    const user: User = match ?? {
      id: `u-${Date.now()}`,
      role: payload.role,
      name: payload.email.split('@')[0],
      email: payload.email,
      skills: [],
      interests: [],
      available: true,
      department: 'Computer Science',
      graduationYear: 2026,
      createdAt: new Date().toISOString(),
    }
    this.state.currentUser = user
    this.persist()
    return this.delay({
      user,
      token: `mock-token-${user.id}-${Date.now()}`,
    })
  }

  async logout(): Promise<void> {
    this.state.currentUser = null
    this.persist()
    return this.delay(undefined)
  }

  async getCurrentUser(): Promise<User> {
    if (!this.state.currentUser) {
      const fallback = this.state.users[0]
      this.state.currentUser = fallback
    }
    return this.delay(this.state.currentUser)
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  async listStudents(): Promise<User[]> {
    const students = this.state.users.filter((u) => u.role === 'student')
    return this.delay(students)
  }

  async getUser(userId: string): Promise<User> {
    const u = this.state.users.find((x) => x.id === userId)
    if (!u) throw new ApiError(`User ${userId} not found`, 404, 'not_found')
    return this.delay(u)
  }

  async updateProfile(userId: string, payload: UpdateProfilePayload): Promise<User> {
    const idx = this.state.users.findIndex((x) => x.id === userId)
    if (idx === -1) throw new ApiError(`User ${userId} not found`, 404, 'not_found')
    const updated: User = {
      ...this.state.users[idx],
      ...payload,
    }
    this.state.users[idx] = updated
    if (this.state.currentUser?.id === userId) {
      this.state.currentUser = updated
    }
    this.persist()
    return this.delay(updated)
  }

  // ── Projects ──────────────────────────────────────────────────────────────

  async listProjects(userId?: string): Promise<Project[]> {
    if (!userId) return this.delay(this.state.projects)
    const memberProjectIds = new Set(
      this.state.teamMembers.filter((m) => m.userId === userId).map((m) => m.projectId),
    )
    const list = this.state.projects.filter(
      (p) => p.createdBy === userId || memberProjectIds.has(p.id),
    )
    return this.delay(list)
  }

  async getProject(projectId: string): Promise<Project> {
    const p = this.state.projects.find((x) => x.id === projectId)
    if (!p) throw new ApiError(`Project ${projectId} not found`, 404, 'not_found')
    return this.delay(p)
  }

  async createProject(payload: CreateProjectPayload): Promise<Project> {
    const user = await this.getCurrentUser()
    const id = `p-${Date.now()}`
    const faculty = this.state.users.find((u) => u.role === 'faculty')
    const newProject: Project = {
      id,
      title: payload.title,
      description: payload.description,
      domain: payload.domain ?? 'Web & Mobile',
      health: 'on-track',
      progress: 0,
      deadline: payload.deadline,
      createdBy: user.id,
      facultyId: faculty?.id ?? 'u-faculty-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.state.projects.unshift(newProject)
    this.state.teamMembers.push({
      userId: user.id,
      projectId: id,
      role: 'lead',
      joinedAt: new Date().toISOString(),
      tasksCompleted: 0,
      tasksAssigned: 0,
    })
    this.persist()
    return this.delay(newProject)
  }

  async updateProject(projectId: string, payload: UpdateProjectPayload): Promise<Project> {
    const idx = this.state.projects.findIndex((p) => p.id === projectId)
    if (idx === -1) throw new ApiError(`Project ${projectId} not found`, 404, 'not_found')
    const updated: Project = {
      ...this.state.projects[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    this.state.projects[idx] = updated
    this.persist()
    return this.delay(updated)
  }

  // ── Teams & Invites ───────────────────────────────────────────────────────

  async getTeamMembers(projectId: string): Promise<TeamMember[]> {
    const members = this.state.teamMembers.filter((m) => m.projectId === projectId)
    return this.delay(members)
  }

  async sendInvite(projectId: string, userId: string): Promise<Invite> {
    const existing = this.state.invites.find(
      (i) => i.projectId === projectId && i.invitedUserId === userId && i.status === 'invited',
    )
    if (existing) return this.delay(existing)
    const inv: Invite = {
      id: `inv-${Date.now()}`,
      projectId,
      invitedUserId: userId,
      invitedBy: this.state.currentUser?.id ?? 'system',
      status: 'invited',
      sentAt: new Date().toISOString(),
    }
    this.state.invites.push(inv)
    this.persist()
    return this.delay(inv)
  }

  async respondToInvite(
    inviteId: string,
    status: Extract<InviteStatus, 'joined' | 'declined'>,
  ): Promise<Invite> {
    const inv = this.state.invites.find((i) => i.id === inviteId)
    if (!inv) throw new ApiError(`Invite ${inviteId} not found`, 404, 'not_found')
    inv.status = status
    inv.respondedAt = new Date().toISOString()
    if (status === 'joined') {
      const alreadyMember = this.state.teamMembers.some(
        (m) => m.projectId === inv.projectId && m.userId === inv.invitedUserId,
      )
      if (!alreadyMember) {
        this.state.teamMembers.push({
          userId: inv.invitedUserId,
          projectId: inv.projectId,
          role: 'member',
          joinedAt: new Date().toISOString(),
          tasksCompleted: 0,
          tasksAssigned: 0,
        })
      }
    }
    this.persist()
    return this.delay(inv)
  }

  async listInvites(projectId: string): Promise<Invite[]> {
    const list = this.state.invites.filter((i) => i.projectId === projectId)
    return this.delay(list)
  }

  async removeTeamMember(projectId: string, userId: string): Promise<void> {
    this.state.teamMembers = this.state.teamMembers.filter(
      (m) => !(m.projectId === projectId && m.userId === userId),
    )
    this.persist()
    return this.delay(undefined)
  }

  // ── Tasks ─────────────────────────────────────────────────────────────────

  async listTasks(projectId: string): Promise<Task[]> {
    const list = this.state.tasks.filter((t) => t.projectId === projectId)
    return this.delay(list)
  }

  async getTask(taskId: string): Promise<Task> {
    const t = this.state.tasks.find((x) => x.id === taskId)
    if (!t) throw new ApiError(`Task ${taskId} not found`, 404, 'not_found')
    return this.delay(t)
  }

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const user = await this.getCurrentUser()
    const id = `t-${Date.now()}`
    const count = this.state.tasks.filter(
      (t) => t.projectId === payload.projectId && t.status === payload.status,
    ).length
    const task: Task = {
      id,
      projectId: payload.projectId,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      assigneeId: payload.assigneeId,
      dueDate: payload.dueDate,
      milestoneId: payload.milestoneId,
      createdBy: user.id,
      order: count,
      subtasks: [],
      fileIds: [],
      linkIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.state.tasks.push(task)
    this.persist()
    return this.delay(task)
  }

  async updateTask(taskId: string, payload: UpdateTaskPayload): Promise<Task> {
    const idx = this.state.tasks.findIndex((t) => t.id === taskId)
    if (idx === -1) throw new ApiError(`Task ${taskId} not found`, 404, 'not_found')
    const updated: Task = {
      ...this.state.tasks[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    this.state.tasks[idx] = updated
    this.persist()
    return this.delay(updated)
  }

  async moveTask(payload: MoveTaskPayload): Promise<Task> {
    const t = this.state.tasks.find((x) => x.id === payload.taskId)
    if (!t) throw new ApiError(`Task ${payload.taskId} not found`, 404, 'not_found')
    t.status = payload.status
    t.order = payload.order
    t.updatedAt = new Date().toISOString()
    this.persist()
    return this.delay(t)
  }

  async deleteTask(taskId: string): Promise<void> {
    this.state.tasks = this.state.tasks.filter((t) => t.id !== taskId)
    this.persist()
    return this.delay(undefined)
  }

  // ── Subtasks ──────────────────────────────────────────────────────────────

  async toggleSubtask(taskId: string, subtaskId: string, completed: boolean): Promise<Task> {
    const t = this.state.tasks.find((x) => x.id === taskId)
    if (!t) throw new ApiError(`Task ${taskId} not found`, 404, 'not_found')
    const sub = t.subtasks.find((s) => s.id === subtaskId)
    if (sub) {
      sub.completed = completed
      t.updatedAt = new Date().toISOString()
      this.persist()
    }
    return this.delay(t)
  }

  async addSubtask(taskId: string, title: string): Promise<Task> {
    const t = this.state.tasks.find((x) => x.id === taskId)
    if (!t) throw new ApiError(`Task ${taskId} not found`, 404, 'not_found')
    t.subtasks.push({
      id: `sub-${Date.now()}`,
      title,
      completed: false,
    })
    t.updatedAt = new Date().toISOString()
    this.persist()
    return this.delay(t)
  }

  // ── Comments ──────────────────────────────────────────────────────────────

  async listComments(entityId: string): Promise<Comment[]> {
    const list = this.state.comments.filter((c) => c.entityId === entityId)
    return this.delay(list)
  }

  async addComment(
    entityId: string,
    entityType: 'task' | 'milestone',
    body: string,
  ): Promise<Comment> {
    const user = await this.getCurrentUser()
    const c: Comment = {
      id: `cmt-${Date.now()}`,
      entityId,
      entityType,
      authorId: user.id,
      body,
      createdAt: new Date().toISOString(),
    }
    this.state.comments.push(c)
    this.persist()
    return this.delay(c)
  }

  // ── Files & Links ─────────────────────────────────────────────────────────

  async listFiles(projectId: string, taskId?: string): Promise<FileAsset[]> {
    const list = this.state.files.filter(
      (f) => f.projectId === projectId && (!taskId || f.taskId === taskId),
    )
    return this.delay(list)
  }

  async uploadFile(payload: UploadFilePayload): Promise<FileAsset> {
    const user = await this.getCurrentUser()
    const name = 'name' in payload.file ? payload.file.name : 'uploaded-file'
    const mimeType = 'mimeType' in payload.file ? payload.file.mimeType : 'application/pdf'
    const sizeBytes = 'sizeBytes' in payload.file ? payload.file.sizeBytes : 1024 * 150
    const f: FileAsset = {
      id: `file-${Date.now()}`,
      projectId: payload.projectId,
      taskId: payload.taskId,
      milestoneId: payload.milestoneId,
      name,
      mimeType,
      sizeBytes,
      url: '#',
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
    }
    this.state.files.push(f)
    this.persist()
    return this.delay(f)
  }

  async deleteFile(fileId: string): Promise<void> {
    this.state.files = this.state.files.filter((f) => f.id !== fileId)
    this.persist()
    return this.delay(undefined)
  }

  async listLinks(projectId: string, taskId?: string): Promise<Link[]> {
    const list = this.state.links.filter(
      (l) => l.projectId === projectId && (!taskId || l.taskId === taskId),
    )
    return this.delay(list)
  }

  async addLink(payload: AddLinkPayload): Promise<Link> {
    const user = await this.getCurrentUser()
    const l: Link = {
      id: `link-${Date.now()}`,
      projectId: payload.projectId,
      taskId: payload.taskId,
      milestoneId: payload.milestoneId,
      title: payload.title,
      url: payload.url,
      addedBy: user.id,
      addedAt: new Date().toISOString(),
    }
    this.state.links.push(l)
    this.persist()
    return this.delay(l)
  }

  async deleteLink(linkId: string): Promise<void> {
    this.state.links = this.state.links.filter((l) => l.id !== linkId)
    this.persist()
    return this.delay(undefined)
  }

  // ── Milestones ────────────────────────────────────────────────────────────

  async listMilestones(projectId: string): Promise<Milestone[]> {
    const list = this.state.milestones.filter((m) => m.projectId === projectId)
    return this.delay(list)
  }

  async getMilestone(milestoneId: string): Promise<Milestone> {
    const m = this.state.milestones.find((x) => x.id === milestoneId)
    if (!m) throw new ApiError(`Milestone ${milestoneId} not found`, 404, 'not_found')
    return this.delay(m)
  }

  async createMilestone(payload: CreateMilestonePayload): Promise<Milestone> {
    const m: Milestone = {
      id: `ms-${Date.now()}`,
      projectId: payload.projectId,
      title: payload.title,
      description: payload.description,
      dueDate: payload.dueDate,
      status: 'pending',
      order: payload.order,
      fileIds: [],
      linkIds: [],
      rubricScores: [],
    }
    this.state.milestones.push(m)
    this.persist()
    return this.delay(m)
  }

  async submitMilestone(payload: SubmitMilestonePayload): Promise<Milestone> {
    const m = this.state.milestones.find((x) => x.id === payload.milestoneId)
    if (!m) throw new ApiError(`Milestone ${payload.milestoneId} not found`, 404, 'not_found')
    m.status = 'submitted'
    m.submittedAt = new Date().toISOString()
    this.persist()
    return this.delay(m)
  }

  async updateMilestoneStatus(
    milestoneId: string,
    status: MilestoneStatus,
  ): Promise<Milestone> {
    const m = this.state.milestones.find((x) => x.id === milestoneId)
    if (!m) throw new ApiError(`Milestone ${milestoneId} not found`, 404, 'not_found')
    m.status = status
    this.persist()
    return this.delay(m)
  }

  // ── Faculty ───────────────────────────────────────────────────────────────

  async listAllProjects(): Promise<Project[]> {
    return this.delay(this.state.projects)
  }

  async reviewMilestone(payload: ReviewMilestonePayload): Promise<Milestone> {
    const m = this.state.milestones.find((x) => x.id === payload.milestoneId)
    if (!m) throw new ApiError(`Milestone ${payload.milestoneId} not found`, 404, 'not_found')
    const user = await this.getCurrentUser()
    m.status = payload.decision === 'approve' ? 'approved' : 'changes-requested'
    m.reviewedAt = new Date().toISOString()
    m.reviewedBy = user.id
    m.rubricScores = payload.rubricScores
    m.facultyFeedback = payload.feedback
    this.persist()
    return this.delay(m)
  }

  // ── Activity ──────────────────────────────────────────────────────────────

  async listActivity(projectId: string, limit: number = 20): Promise<Activity[]> {
    const list = this.state.activities
      .filter((a) => a.projectId === projectId)
      .slice(0, limit)
    return this.delay(list)
  }

  // ── Demo utilities ────────────────────────────────────────────────────────

  async resetDemoData(): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    const snap = clone(SEED_SNAPSHOT) as SeedSnapshot
    this.state = {
      ...snap,
      currentUser: snap.users.find((u) => u.role === 'student') ?? snap.users[0],
    }
    this.persist()
    return this.delay(undefined)
  }
}

export const mockApi: Api = new MockApiImpl()
