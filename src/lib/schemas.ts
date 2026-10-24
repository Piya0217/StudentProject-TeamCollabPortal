/**
 * lib/schemas.ts
 * Canonical Zod schemas for every entity in the system.
 * TypeScript types are inferred from schemas — single source of truth.
 * Shared between the service layer, forms (react-hook-form + zodResolver), and stores.
 *
 * Rule: no `any`. All enums are z.enum for exhaustive switching.
 */
import { z } from 'zod'

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES & ENUMS
// ─────────────────────────────────────────────────────────────────────────────

/** ISO-8601 date string (stored as string for JSON-safety) */
export const ISODateString = z.string().datetime({ offset: true })

/** Proficiency level for a skill */
export const ProficiencySchema = z.enum(['beginner', 'intermediate', 'advanced', 'expert'])
export type Proficiency = z.infer<typeof ProficiencySchema>

/** Task status — maps to StatusBadge in UI */
export const TaskStatusSchema = z.enum(['todo', 'in-progress', 'in-review', 'done'])
export type TaskStatus = z.infer<typeof TaskStatusSchema>

/** Task priority — maps to PriorityBadge in UI */
export const TaskPrioritySchema = z.enum(['high', 'medium', 'low'])
export type TaskPriority = z.infer<typeof TaskPrioritySchema>

/** Project health — maps to HealthBadge in UI */
export const ProjectHealthSchema = z.enum(['on-track', 'at-risk', 'overdue'])
export type ProjectHealth = z.infer<typeof ProjectHealthSchema>

/** Milestone review status */
export const MilestoneStatusSchema = z.enum([
  'pending',       // not yet submitted by team
  'submitted',     // team submitted, awaiting faculty review
  'approved',      // faculty approved
  'changes-requested', // faculty requested revisions
])
export type MilestoneStatus = z.infer<typeof MilestoneStatusSchema>

/** User role */
export const UserRoleSchema = z.enum(['student', 'faculty'])
export type UserRole = z.infer<typeof UserRoleSchema>

/** Team member role within a project */
export const TeamMemberRoleSchema = z.enum(['lead', 'member', 'observer'])
export type TeamMemberRole = z.infer<typeof TeamMemberRoleSchema>

/** Invite state for the Teams screen */
export const InviteStatusSchema = z.enum(['invited', 'joined', 'declined'])
export type InviteStatus = z.infer<typeof InviteStatusSchema>

/** Activity event type for the activity feed */
export const ActivityEventSchema = z.enum([
  'task-created',
  'task-status-changed',
  'task-assigned',
  'comment-added',
  'file-uploaded',
  'link-added',
  'milestone-submitted',
  'milestone-approved',
  'milestone-changes-requested',
  'member-joined',
  'member-invited',
  'project-created',
])
export type ActivityEvent = z.infer<typeof ActivityEventSchema>

// ─────────────────────────────────────────────────────────────────────────────
// SKILL & INTEREST
// ─────────────────────────────────────────────────────────────────────────────

export const SkillSchema = z.object({
  /** Skill label e.g. "React", "Machine Learning" */
  name: z.string().min(1).max(60),
  proficiency: ProficiencySchema,
})
export type Skill = z.infer<typeof SkillSchema>

// ─────────────────────────────────────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────────────────────────────────────

export const UserSchema = z.object({
  id: z.string().min(1),
  role: UserRoleSchema,
  name: z.string().min(1).max(120),
  email: z.string().email(),
  /** Optional avatar URL — if absent, Avatar component renders initials */
  avatarUrl: z.string().url().optional(),
  /** Short bio / introduction paragraph */
  bio: z.string().max(500).optional(),
  /** Skills with proficiency levels — students only */
  skills: z.array(SkillSchema).default([]),
  /** Interest tags — plain strings */
  interests: z.array(z.string().min(1).max(40)).default([]),
  /** Whether the student is available for new project invites */
  available: z.boolean().default(true),
  /** Student-specific: university, course, graduation year */
  university: z.string().max(120).optional(),
  course: z.string().max(120).optional(),
  graduationYear: z.number().int().min(2020).max(2035).optional(),
  /** Faculty-specific: department */
  department: z.string().max(120).optional(),
  createdAt: ISODateString,
})
export type User = z.infer<typeof UserSchema>

// ─────────────────────────────────────────────────────────────────────────────
// SUBTASK
// ─────────────────────────────────────────────────────────────────────────────

export const SubtaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  completed: z.boolean().default(false),
})
export type Subtask = z.infer<typeof SubtaskSchema>

// ─────────────────────────────────────────────────────────────────────────────
// COMMENT
// ─────────────────────────────────────────────────────────────────────────────

export const CommentSchema = z.object({
  id: z.string().min(1),
  authorId: z.string().min(1),
  /** The entity this comment belongs to (task or milestone) */
  entityId: z.string().min(1),
  entityType: z.enum(['task', 'milestone']),
  body: z.string().min(1).max(2000),
  createdAt: ISODateString,
  editedAt: ISODateString.optional(),
})
export type Comment = z.infer<typeof CommentSchema>

// ─────────────────────────────────────────────────────────────────────────────
// FILE ASSET
// ─────────────────────────────────────────────────────────────────────────────

export const FileAssetSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  /** Optional: task or milestone this file is attached to */
  taskId: z.string().optional(),
  milestoneId: z.string().optional(),
  name: z.string().min(1).max(255),
  /** MIME type */
  mimeType: z.string().min(1),
  /** Size in bytes */
  sizeBytes: z.number().int().nonnegative(),
  /** In mock: a data URL or placeholder path */
  url: z.string().min(1),
  uploadedBy: z.string().min(1),
  uploadedAt: ISODateString,
})
export type FileAsset = z.infer<typeof FileAssetSchema>

// ─────────────────────────────────────────────────────────────────────────────
// LINK
// ─────────────────────────────────────────────────────────────────────────────

export const LinkSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  taskId: z.string().optional(),
  milestoneId: z.string().optional(),
  title: z.string().min(1).max(200),
  url: z.string().url(),
  addedBy: z.string().min(1),
  addedAt: ISODateString,
})
export type Link = z.infer<typeof LinkSchema>

// ─────────────────────────────────────────────────────────────────────────────
// TASK
// ─────────────────────────────────────────────────────────────────────────────

export const TaskSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  milestoneId: z.string().optional(),
  title: z.string().min(1).max(300),
  description: z.string().max(3000).optional(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  /** userId of assignee */
  assigneeId: z.string().optional(),
  /** ISO date string for due date — date only portion used in UI */
  dueDate: z.string().optional(),
  subtasks: z.array(SubtaskSchema).default([]),
  /** IDs of attached files */
  fileIds: z.array(z.string()).default([]),
  /** IDs of attached links */
  linkIds: z.array(z.string()).default([]),
  createdBy: z.string().min(1),
  createdAt: ISODateString,
  updatedAt: ISODateString,
  /** Column order for kanban (lower = top) */
  order: z.number().int().nonnegative().default(0),
})
export type Task = z.infer<typeof TaskSchema>

// ─────────────────────────────────────────────────────────────────────────────
// MILESTONE
// ─────────────────────────────────────────────────────────────────────────────

export const RubricScoreSchema = z.object({
  criterion: z.string().min(1).max(100),
  score: z.number().int().min(0).max(5),
  maxScore: z.number().int().min(1).max(5).default(5),
})
export type RubricScore = z.infer<typeof RubricScoreSchema>

export const MilestoneSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  dueDate: z.string(),
  status: MilestoneStatusSchema,
  /** Display order (1-indexed) */
  order: z.number().int().min(1),
  /** IDs of submitted files */
  fileIds: z.array(z.string()).default([]),
  /** IDs of submitted links */
  linkIds: z.array(z.string()).default([]),
  /** Faculty rubric scores — populated after review */
  rubricScores: z.array(RubricScoreSchema).default([]),
  /** Faculty written feedback */
  facultyFeedback: z.string().max(3000).optional(),
  /** userId of reviewing faculty */
  reviewedBy: z.string().optional(),
  reviewedAt: ISODateString.optional(),
  submittedAt: ISODateString.optional(),
})
export type Milestone = z.infer<typeof MilestoneSchema>

// ─────────────────────────────────────────────────────────────────────────────
// TEAM MEMBER & INVITE
// ─────────────────────────────────────────────────────────────────────────────

export const TeamMemberSchema = z.object({
  userId: z.string().min(1),
  projectId: z.string().min(1),
  role: TeamMemberRoleSchema,
  joinedAt: ISODateString,
  /** Tasks completed by this member in this project */
  tasksCompleted: z.number().int().nonnegative().default(0),
  /** Total tasks assigned to this member in this project */
  tasksAssigned: z.number().int().nonnegative().default(0),
})
export type TeamMember = z.infer<typeof TeamMemberSchema>

export const InviteSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  invitedUserId: z.string().min(1),
  invitedBy: z.string().min(1),
  status: InviteStatusSchema,
  sentAt: ISODateString,
  respondedAt: ISODateString.optional(),
})
export type Invite = z.infer<typeof InviteSchema>

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY
// ─────────────────────────────────────────────────────────────────────────────

export const ActivitySchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  actorId: z.string().min(1),
  event: ActivityEventSchema,
  /** Human-readable summary rendered in feed */
  summary: z.string().min(1).max(300),
  /** Optional reference to the entity affected */
  entityId: z.string().optional(),
  entityType: z.enum(['task', 'milestone', 'file', 'link', 'member', 'project']).optional(),
  createdAt: ISODateString,
})
export type Activity = z.infer<typeof ActivitySchema>

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT
// ─────────────────────────────────────────────────────────────────────────────

export const ProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(3000).optional(),
  domain: z.string().max(100).optional(),
  /** userId of the supervising faculty member */
  facultyId: z.string().min(1),
  health: ProjectHealthSchema,
  /** Overall completion percentage 0-100 (computed from tasks) */
  progress: z.number().int().min(0).max(100),
  /** ISO date string */
  deadline: z.string(),
  createdBy: z.string().min(1),
  createdAt: ISODateString,
  updatedAt: ISODateString,
})
export type Project = z.infer<typeof ProjectSchema>

// ─────────────────────────────────────────────────────────────────────────────
// FORM INPUT SCHEMAS (used with react-hook-form zodResolver)
// ─────────────────────────────────────────────────────────────────────────────

export const LoginFormSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: UserRoleSchema,
})
export type LoginFormValues = z.infer<typeof LoginFormSchema>

export const CreateProjectFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(3000).optional(),
  domain: z.string().max(100).optional(),
  deadline: z.string().min(1, 'Select a deadline'),
})
export type CreateProjectFormValues = z.infer<typeof CreateProjectFormSchema>

export const TaskFormSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(300),
  description: z.string().max(3000).optional(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
  milestoneId: z.string().optional(),
})
export type TaskFormValues = z.infer<typeof TaskFormSchema>

export const MilestoneFormSchema = z.object({
  title: z.string().min(1, 'Milestone title is required').max(200),
  description: z.string().max(2000).optional(),
  dueDate: z.string().min(1, 'Select a due date'),
  order: z.number().int().min(1),
})
export type MilestoneFormValues = z.infer<typeof MilestoneFormSchema>

export const FacultyReviewFormSchema = z.object({
  rubricScores: z.array(RubricScoreSchema),
  feedback: z.string().min(1, 'Provide feedback before submitting').max(3000),
  decision: z.enum(['approve', 'request-changes']),
})
export type FacultyReviewFormValues = z.infer<typeof FacultyReviewFormSchema>

export const CommentFormSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(2000),
})
export type CommentFormValues = z.infer<typeof CommentFormSchema>

export const SkillFormSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(60),
  proficiency: ProficiencySchema,
})
export type SkillFormValues = z.infer<typeof SkillFormSchema>
