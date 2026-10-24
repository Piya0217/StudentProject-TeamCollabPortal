/**
 * services/api.ts
 * The single `Api` interface that defines every remote operation.
 * The mock implementation in mocks/mockApi.ts satisfies this interface.
 * A real backend client would also satisfy this interface — no UI code changes needed.
 *
 * Conventions:
 * - All methods return Promise<T>
 * - Errors are thrown as ApiError
 * - Pagination is cursor-based where lists are long
 * - IDs are opaque strings throughout
 */
import type {
  User,
  Project,
  Task,
  TaskStatus,
  TaskPriority,
  TeamMember,
  Invite,
  InviteStatus,
  Milestone,
  MilestoneStatus,
  Comment,
  FileAsset,
  Link,
  Activity,
  RubricScore,
  Skill,
} from '@/lib/schemas'

// ─── Error type ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    /** HTTP-like status code */
    public readonly code: number = 500,
    /** Machine-readable error key for UI copy decisions */
    public readonly key: string = 'unknown',
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string
  password: string
  role: 'student' | 'faculty'
}

export interface AuthResult {
  user: User
  /** Token string — mock returns a fake JWT; real impl stores in httpOnly cookie */
  token: string
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface CreateProjectPayload {
  title: string
  description?: string
  domain?: string
  deadline: string
}

export interface UpdateProjectPayload {
  title?: string
  description?: string
  domain?: string
  deadline?: string
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export interface CreateTaskPayload {
  projectId: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: string
  dueDate?: string
  milestoneId?: string
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  dueDate?: string
  milestoneId?: string
  order?: number
}

export interface MoveTaskPayload {
  taskId: string
  status: TaskStatus
  /** New order index in the target column */
  order: number
}

// ─── Milestones ───────────────────────────────────────────────────────────────

export interface CreateMilestonePayload {
  projectId: string
  title: string
  description?: string
  dueDate: string
  order: number
}

export interface SubmitMilestonePayload {
  milestoneId: string
  fileIds: string[]
  linkIds: string[]
}

export interface ReviewMilestonePayload {
  milestoneId: string
  decision: 'approve' | 'request-changes'
  rubricScores: RubricScore[]
  feedback: string
}

// ─── Files & Links ────────────────────────────────────────────────────────────

export interface UploadFilePayload {
  projectId: string
  taskId?: string
  milestoneId?: string
  /** In mock: the File object; real impl would post multipart */
  file: File | { name: string; mimeType: string; sizeBytes: number; dataUrl: string }
}

export interface AddLinkPayload {
  projectId: string
  taskId?: string
  milestoneId?: string
  title: string
  url: string
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface UpdateProfilePayload {
  bio?: string
  skills?: Skill[]
  interests?: string[]
  available?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// THE API INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

export interface Api {
  // Auth
  login(payload: LoginPayload): Promise<AuthResult>
  logout(): Promise<void>
  getCurrentUser(): Promise<User>

  // Users
  listStudents(): Promise<User[]>
  getUser(userId: string): Promise<User>
  updateProfile(userId: string, payload: UpdateProfilePayload): Promise<User>

  // Projects
  listProjects(userId?: string): Promise<Project[]>
  getProject(projectId: string): Promise<Project>
  createProject(payload: CreateProjectPayload): Promise<Project>
  updateProject(projectId: string, payload: UpdateProjectPayload): Promise<Project>

  // Teams & Invites
  getTeamMembers(projectId: string): Promise<TeamMember[]>
  sendInvite(projectId: string, userId: string): Promise<Invite>
  respondToInvite(inviteId: string, status: Extract<InviteStatus, 'joined' | 'declined'>): Promise<Invite>
  listInvites(projectId: string): Promise<Invite[]>
  removeTeamMember(projectId: string, userId: string): Promise<void>

  // Tasks
  listTasks(projectId: string): Promise<Task[]>
  getTask(taskId: string): Promise<Task>
  createTask(payload: CreateTaskPayload): Promise<Task>
  updateTask(taskId: string, payload: UpdateTaskPayload): Promise<Task>
  moveTask(payload: MoveTaskPayload): Promise<Task>
  deleteTask(taskId: string): Promise<void>

  // Subtasks
  toggleSubtask(taskId: string, subtaskId: string, completed: boolean): Promise<Task>
  addSubtask(taskId: string, title: string): Promise<Task>

  // Comments
  listComments(entityId: string): Promise<Comment[]>
  addComment(entityId: string, entityType: 'task' | 'milestone', body: string): Promise<Comment>

  // Files & Links
  listFiles(projectId: string, taskId?: string): Promise<FileAsset[]>
  uploadFile(payload: UploadFilePayload): Promise<FileAsset>
  deleteFile(fileId: string): Promise<void>
  listLinks(projectId: string, taskId?: string): Promise<Link[]>
  addLink(payload: AddLinkPayload): Promise<Link>
  deleteLink(linkId: string): Promise<void>

  // Milestones
  listMilestones(projectId: string): Promise<Milestone[]>
  getMilestone(milestoneId: string): Promise<Milestone>
  createMilestone(payload: CreateMilestonePayload): Promise<Milestone>
  submitMilestone(payload: SubmitMilestonePayload): Promise<Milestone>
  updateMilestoneStatus(milestoneId: string, status: MilestoneStatus): Promise<Milestone>

  // Faculty
  listAllProjects(): Promise<Project[]>
  reviewMilestone(payload: ReviewMilestonePayload): Promise<Milestone>

  // Activity
  listActivity(projectId: string, limit?: number): Promise<Activity[]>

  // Demo utilities
  resetDemoData(): Promise<void>
}
