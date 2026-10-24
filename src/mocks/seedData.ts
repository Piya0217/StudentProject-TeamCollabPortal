/**
 * mocks/seedData.ts
 * Realistic Indian university seed data.
 * 4 students, 1 faculty, 4 projects (on-track / at-risk / overdue / awaiting-review),
 * 3 milestones each, 28 tasks, comments, files, links, activity.
 *
 * Seeded so every screen is fully populated on first load.
 */
import type {
  User,
  Project,
  TeamMember,
  Invite,
  Task,
  Milestone,
  Comment,
  FileAsset,
  Link,
  Activity,
} from '@/lib/schemas'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function iso(date: Date): string {
  return date.toISOString()
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return iso(d)
}

function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return iso(d)
}

function dateOnly(isoStr: string): string {
  return isoStr.slice(0, 10)
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export const USERS: User[] = [
  {
    id: 'u-faculty-1',
    role: 'faculty',
    name: 'Dr. Priya Venkataraman',
    email: 'priya.venkataraman@iitm.ac.in',
    bio: 'Associate Professor, Dept. of Computer Science and Engineering. Research interests: IoT systems, distributed computing.',
    skills: [],
    interests: ['IoT', 'Distributed Systems', 'Edge Computing'],
    available: false,
    department: 'Computer Science and Engineering',
    university: 'IIT Madras',
    createdAt: daysAgo(180),
  },
  {
    id: 'u-student-1',
    role: 'student',
    name: 'Siddharth Rao',
    email: 'siddharth.rao@iitm.ac.in',
    bio: '3rd year B.Tech CSE. Passionate about full-stack development and open source. Looking for teammates for interesting projects.',
    skills: [
      { name: 'React', proficiency: 'advanced' },
      { name: 'TypeScript', proficiency: 'intermediate' },
      { name: 'Node.js', proficiency: 'intermediate' },
      { name: 'PostgreSQL', proficiency: 'beginner' },
    ],
    interests: ['Web Development', 'Open Source', 'System Design'],
    available: true,
    university: 'IIT Madras',
    course: 'B.Tech Computer Science and Engineering',
    graduationYear: 2026,
    createdAt: daysAgo(120),
  },
  {
    id: 'u-student-2',
    role: 'student',
    name: 'Ananya Krishnamurthy',
    email: 'ananya.k@iitm.ac.in',
    bio: 'Final year M.Tech, specialising in embedded systems. Arduino and Raspberry Pi enthusiast. Co-founder of the college robotics club.',
    skills: [
      { name: 'Embedded C', proficiency: 'expert' },
      { name: 'Arduino', proficiency: 'expert' },
      { name: 'Python', proficiency: 'advanced' },
      { name: 'MQTT', proficiency: 'intermediate' },
    ],
    interests: ['IoT', 'Robotics', 'Edge Computing'],
    available: false,
    university: 'IIT Madras',
    course: 'M.Tech Embedded Systems',
    graduationYear: 2025,
    createdAt: daysAgo(200),
  },
  {
    id: 'u-student-3',
    role: 'student',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@iitm.ac.in',
    bio: 'Data science & ML enthusiast. Interned at Flipkart last summer working on recommendation systems. Currently exploring LLM fine-tuning.',
    skills: [
      { name: 'Python', proficiency: 'expert' },
      { name: 'scikit-learn', proficiency: 'advanced' },
      { name: 'PyTorch', proficiency: 'intermediate' },
      { name: 'SQL', proficiency: 'advanced' },
    ],
    interests: ['Machine Learning', 'Data Engineering', 'NLP'],
    available: true,
    university: 'IIT Madras',
    course: 'B.Tech Computer Science and Engineering',
    graduationYear: 2026,
    createdAt: daysAgo(150),
  },
  {
    id: 'u-student-4',
    role: 'student',
    name: 'Divya Nair',
    email: 'divya.nair@iitm.ac.in',
    bio: 'UI/UX focused developer with a love for clean design systems. Currently building accessible components for a college DSA learning platform.',
    skills: [
      { name: 'React', proficiency: 'advanced' },
      { name: 'Figma', proficiency: 'expert' },
      { name: 'CSS', proficiency: 'expert' },
      { name: 'JavaScript', proficiency: 'advanced' },
    ],
    interests: ['Design Systems', 'Accessibility', 'Front-end Performance'],
    available: true,
    university: 'IIT Madras',
    course: 'B.Tech Information Technology',
    graduationYear: 2026,
    createdAt: daysAgo(130),
  },
]

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: 'p-1',
    title: 'IoT Campus Environment Monitor',
    description:
      'A distributed sensor network across the IIT Madras campus to monitor temperature, humidity, CO₂ levels, and noise. Real-time dashboard with anomaly alerts.',
    domain: 'IoT / Embedded Systems',
    facultyId: 'u-faculty-1',
    health: 'on-track',
    progress: 68,
    deadline: dateOnly(daysFromNow(42)),
    createdBy: 'u-student-2',
    createdAt: daysAgo(60),
    updatedAt: daysAgo(1),
  },
  {
    id: 'p-2',
    title: 'Campus Placement Analytics Dashboard',
    description:
      'An analytics platform aggregating placement data from the past 5 years. Interactive visualisations for students to benchmark salary expectations and identify skill gaps.',
    domain: 'Data Science / Web',
    facultyId: 'u-faculty-1',
    health: 'at-risk',
    progress: 41,
    deadline: dateOnly(daysFromNow(14)),
    createdBy: 'u-student-3',
    createdAt: daysAgo(50),
    updatedAt: daysAgo(2),
  },
  {
    id: 'p-3',
    title: 'Smart Attendance System with Face Recognition',
    description:
      'An offline-first attendance marking system using lightweight face recognition models running on-device. Syncs with the university ERP when connected.',
    domain: 'Computer Vision / Mobile',
    facultyId: 'u-faculty-1',
    health: 'overdue',
    progress: 22,
    deadline: dateOnly(daysAgo(5)),
    createdBy: 'u-student-1',
    createdAt: daysAgo(90),
    updatedAt: daysAgo(6),
  },
  {
    id: 'p-4',
    title: 'Peer Code Review Platform',
    description:
      'A GitHub-integrated platform for structured peer code review with rubric-based feedback, gamified points, and faculty oversight.',
    domain: 'Education Technology',
    facultyId: 'u-faculty-1',
    health: 'on-track',
    progress: 85,
    deadline: dateOnly(daysFromNow(7)),
    createdBy: 'u-student-1',
    createdAt: daysAgo(75),
    updatedAt: daysAgo(0),
  },
]

// ─── TEAM MEMBERS ─────────────────────────────────────────────────────────────

export const TEAM_MEMBERS: TeamMember[] = [
  // Project 1: IoT Monitor
  { userId: 'u-student-2', projectId: 'p-1', role: 'lead', joinedAt: daysAgo(60), tasksCompleted: 8, tasksAssigned: 10 },
  { userId: 'u-student-1', projectId: 'p-1', role: 'member', joinedAt: daysAgo(58), tasksCompleted: 4, tasksAssigned: 6 },
  { userId: 'u-student-4', projectId: 'p-1', role: 'member', joinedAt: daysAgo(55), tasksCompleted: 3, tasksAssigned: 5 },

  // Project 2: Placement Analytics
  { userId: 'u-student-3', projectId: 'p-2', role: 'lead', joinedAt: daysAgo(50), tasksCompleted: 3, tasksAssigned: 8 },
  { userId: 'u-student-1', projectId: 'p-2', role: 'member', joinedAt: daysAgo(48), tasksCompleted: 2, tasksAssigned: 6 },

  // Project 3: Attendance System
  { userId: 'u-student-1', projectId: 'p-3', role: 'lead', joinedAt: daysAgo(90), tasksCompleted: 1, tasksAssigned: 6 },
  { userId: 'u-student-3', projectId: 'p-3', role: 'member', joinedAt: daysAgo(85), tasksCompleted: 1, tasksAssigned: 4 },

  // Project 4: Peer Review Platform
  { userId: 'u-student-1', projectId: 'p-4', role: 'lead', joinedAt: daysAgo(75), tasksCompleted: 10, tasksAssigned: 11 },
  { userId: 'u-student-4', projectId: 'p-4', role: 'member', joinedAt: daysAgo(73), tasksCompleted: 7, tasksAssigned: 8 },
  { userId: 'u-student-2', projectId: 'p-4', role: 'observer', joinedAt: daysAgo(70), tasksCompleted: 0, tasksAssigned: 0 },
]

// ─── INVITES ──────────────────────────────────────────────────────────────────

export const INVITES: Invite[] = [
  { id: 'inv-1', projectId: 'p-2', invitedUserId: 'u-student-4', invitedBy: 'u-student-3', status: 'invited', sentAt: daysAgo(3) },
  { id: 'inv-2', projectId: 'p-3', invitedUserId: 'u-student-2', invitedBy: 'u-student-1', status: 'declined', sentAt: daysAgo(20), respondedAt: daysAgo(19) },
  { id: 'inv-3', projectId: 'p-1', invitedUserId: 'u-student-3', invitedBy: 'u-student-2', status: 'declined', sentAt: daysAgo(40), respondedAt: daysAgo(39) },
]

// ─── MILESTONES ───────────────────────────────────────────────────────────────

export const MILESTONES: Milestone[] = [
  // P1 — IoT Monitor
  {
    id: 'ms-1-1', projectId: 'p-1', title: 'Hardware prototype & sensor calibration', order: 1,
    description: 'Assemble sensor nodes, calibrate readings against lab instruments, and validate MQTT telemetry.',
    dueDate: dateOnly(daysAgo(20)), status: 'approved',
    fileIds: ['file-1', 'file-2'], linkIds: ['link-1'],
    rubricScores: [
      { criterion: 'Sensor accuracy', score: 4, maxScore: 5 },
      { criterion: 'Documentation quality', score: 5, maxScore: 5 },
    ],
    facultyFeedback: 'Excellent calibration work. The drift correction algorithm is well-documented.',
    reviewedBy: 'u-faculty-1', reviewedAt: daysAgo(18), submittedAt: daysAgo(21),
  },
  {
    id: 'ms-1-2', projectId: 'p-1', title: 'Real-time dashboard backend', order: 2,
    description: 'WebSocket server, InfluxDB time-series storage, and REST API for the dashboard frontend.',
    dueDate: dateOnly(daysFromNow(5)), status: 'submitted',
    fileIds: ['file-3'], linkIds: ['link-2'],
    rubricScores: [], facultyFeedback: undefined,
    reviewedBy: undefined, reviewedAt: undefined, submittedAt: daysAgo(2),
  },
  {
    id: 'ms-1-3', projectId: 'p-1', title: 'Dashboard UI & anomaly alerts', order: 3,
    description: 'React dashboard with live charts, map overlay, and push-notification anomaly alerts.',
    dueDate: dateOnly(daysFromNow(28)), status: 'pending',
    fileIds: [], linkIds: [],
    rubricScores: [],
  },

  // P2 — Placement Analytics
  {
    id: 'ms-2-1', projectId: 'p-2', title: 'Data collection & cleaning pipeline', order: 1,
    description: 'Scrape and clean 5 years of placement records. Normalise company names and roles.',
    dueDate: dateOnly(daysAgo(15)), status: 'approved',
    fileIds: ['file-4'], linkIds: ['link-3'],
    rubricScores: [
      { criterion: 'Data completeness', score: 3, maxScore: 5 },
      { criterion: 'Pipeline reliability', score: 4, maxScore: 5 },
    ],
    facultyFeedback: 'Good start. Some edge cases in company name normalisation need addressing.',
    reviewedBy: 'u-faculty-1', reviewedAt: daysAgo(12), submittedAt: daysAgo(16),
  },
  {
    id: 'ms-2-2', projectId: 'p-2', title: 'Core visualisation components', order: 2,
    description: 'Interactive salary histogram, skill-gap radar, and YoY trend lines.',
    dueDate: dateOnly(daysAgo(2)), status: 'changes-requested',
    fileIds: [], linkIds: ['link-4'],
    rubricScores: [
      { criterion: 'Visual clarity', score: 2, maxScore: 5 },
      { criterion: 'Interactivity', score: 3, maxScore: 5 },
    ],
    facultyFeedback: 'The radar chart labels are too small at mobile widths. The histogram bins need a legend. Please revise.',
    reviewedBy: 'u-faculty-1', reviewedAt: daysAgo(1), submittedAt: daysAgo(3),
  },
  {
    id: 'ms-2-3', projectId: 'p-2', title: 'Student self-assessment module', order: 3,
    description: 'Students input their skills and get personalised gap analysis vs successful placements.',
    dueDate: dateOnly(daysFromNow(12)), status: 'pending',
    fileIds: [], linkIds: [],
    rubricScores: [],
  },

  // P3 — Attendance System (overdue)
  {
    id: 'ms-3-1', projectId: 'p-3', title: 'Face detection model integration', order: 1,
    description: 'Integrate MediaPipe Face Detection, benchmark accuracy on lab dataset.',
    dueDate: dateOnly(daysAgo(40)), status: 'approved',
    fileIds: ['file-5'], linkIds: [],
    rubricScores: [{ criterion: 'Model accuracy', score: 3, maxScore: 5 }],
    facultyFeedback: 'Accuracy is marginal. Consider improving lighting normalisation before the next milestone.',
    reviewedBy: 'u-faculty-1', reviewedAt: daysAgo(35), submittedAt: daysAgo(41),
  },
  {
    id: 'ms-3-2', projectId: 'p-3', title: 'Offline-first mobile app', order: 2,
    description: 'React Native app with local SQLite, offline attendance marking, and sync queue.',
    dueDate: dateOnly(daysAgo(10)), status: 'pending',
    fileIds: [], linkIds: [],
    rubricScores: [],
  },
  {
    id: 'ms-3-3', projectId: 'p-3', title: 'ERP sync and reporting', order: 3,
    description: 'Background sync worker, ERP API integration, and printable attendance reports.',
    dueDate: dateOnly(daysAgo(1)), status: 'pending',
    fileIds: [], linkIds: [],
    rubricScores: [],
  },

  // P4 — Peer Review Platform
  {
    id: 'ms-4-1', projectId: 'p-4', title: 'GitHub OAuth & repo linking', order: 1,
    description: 'GitHub App integration, webhook handling for PR events, repo selection UI.',
    dueDate: dateOnly(daysAgo(30)), status: 'approved',
    fileIds: ['file-6'], linkIds: ['link-5'],
    rubricScores: [
      { criterion: 'Security implementation', score: 5, maxScore: 5 },
      { criterion: 'Documentation', score: 4, maxScore: 5 },
    ],
    facultyFeedback: 'Excellent work. Token refresh handling is robust.',
    reviewedBy: 'u-faculty-1', reviewedAt: daysAgo(27), submittedAt: daysAgo(31),
  },
  {
    id: 'ms-4-2', projectId: 'p-4', title: 'Review rubric engine', order: 2,
    description: 'Configurable rubric builder, auto-assignment of reviewers, anonymous mode.',
    dueDate: dateOnly(daysAgo(7)), status: 'approved',
    fileIds: ['file-7'], linkIds: [],
    rubricScores: [
      { criterion: 'Rubric flexibility', score: 5, maxScore: 5 },
      { criterion: 'UI completeness', score: 4, maxScore: 5 },
    ],
    facultyFeedback: 'Rubric builder is very well-thought-out. Anonymous mode works correctly.',
    reviewedBy: 'u-faculty-1', reviewedAt: daysAgo(5), submittedAt: daysAgo(8),
  },
  {
    id: 'ms-4-3', projectId: 'p-4', title: 'Gamification & leaderboard', order: 3,
    description: 'Point system for reviews given/received, semester leaderboard, badge unlocks.',
    dueDate: dateOnly(daysFromNow(5)), status: 'submitted',
    fileIds: ['file-8'], linkIds: ['link-6'],
    rubricScores: [], submittedAt: daysAgo(1),
  },
]

// ─── TASKS (28 total) ─────────────────────────────────────────────────────────

export const TASKS: Task[] = [
  // ── P1 IoT Monitor (7 tasks) ──────────────────────────────────────────────
  {
    id: 't-1-1', projectId: 'p-1', milestoneId: 'ms-1-2',
    title: 'Design WebSocket message schema', description: 'Define the JSON schema for sensor telemetry messages over WebSocket.',
    status: 'done', priority: 'high',
    assigneeId: 'u-student-2', dueDate: dateOnly(daysAgo(8)),
    subtasks: [
      { id: 'st-1', title: 'Draft schema v1', completed: true },
      { id: 'st-2', title: 'Add versioning field', completed: true },
    ],
    fileIds: [], linkIds: ['link-2'],
    createdBy: 'u-student-2', createdAt: daysAgo(30), updatedAt: daysAgo(8), order: 0,
  },
  {
    id: 't-1-2', projectId: 'p-1', milestoneId: 'ms-1-2',
    title: 'Set up InfluxDB time-series storage',
    status: 'done', priority: 'high',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysAgo(5)),
    subtasks: [{ id: 'st-3', title: 'Configure retention policies', completed: true }],
    fileIds: [], linkIds: [],
    createdBy: 'u-student-2', createdAt: daysAgo(28), updatedAt: daysAgo(5), order: 1,
  },
  {
    id: 't-1-3', projectId: 'p-1', milestoneId: 'ms-1-2',
    title: 'Implement REST API for dashboard queries',
    status: 'in-review', priority: 'high',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysFromNow(3)),
    subtasks: [
      { id: 'st-4', title: 'GET /sensors endpoint', completed: true },
      { id: 'st-5', title: 'GET /anomalies endpoint', completed: false },
    ],
    fileIds: [], linkIds: [],
    createdBy: 'u-student-2', createdAt: daysAgo(20), updatedAt: daysAgo(1), order: 0,
  },
  {
    id: 't-1-4', projectId: 'p-1', milestoneId: 'ms-1-3',
    title: 'Build real-time sensor map component',
    status: 'in-progress', priority: 'medium',
    assigneeId: 'u-student-4', dueDate: dateOnly(daysFromNow(12)),
    subtasks: [],
    fileIds: [], linkIds: [],
    createdBy: 'u-student-2', createdAt: daysAgo(10), updatedAt: daysAgo(2), order: 0,
  },
  {
    id: 't-1-5', projectId: 'p-1', milestoneId: 'ms-1-3',
    title: 'Design anomaly alert email template',
    status: 'todo', priority: 'low',
    assigneeId: 'u-student-4', dueDate: dateOnly(daysFromNow(20)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-2', createdAt: daysAgo(5), updatedAt: daysAgo(5), order: 0,
  },
  {
    id: 't-1-6', projectId: 'p-1',
    title: 'Write API integration tests',
    status: 'todo', priority: 'medium',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysFromNow(15)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(3), updatedAt: daysAgo(3), order: 1,
  },
  {
    id: 't-1-7', projectId: 'p-1',
    title: 'Deploy to college server & set up CI',
    status: 'todo', priority: 'medium',
    assigneeId: 'u-student-2', dueDate: dateOnly(daysFromNow(35)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-2', createdAt: daysAgo(2), updatedAt: daysAgo(2), order: 2,
  },

  // ── P2 Placement Analytics (7 tasks) ──────────────────────────────────────
  {
    id: 't-2-1', projectId: 'p-2', milestoneId: 'ms-2-2',
    title: 'Fix radar chart label overflow at mobile',
    description: 'Labels clip below 400px viewport. Use abbreviated labels or truncation.',
    status: 'in-progress', priority: 'high',
    assigneeId: 'u-student-3', dueDate: dateOnly(daysFromNow(2)),
    subtasks: [
      { id: 'st-6', title: 'Reproduce on iPhone SE viewport', completed: true },
      { id: 'st-7', title: 'Implement abbreviated labels', completed: false },
    ],
    fileIds: [], linkIds: [],
    createdBy: 'u-student-3', createdAt: daysAgo(2), updatedAt: daysAgo(1), order: 0,
  },
  {
    id: 't-2-2', projectId: 'p-2', milestoneId: 'ms-2-2',
    title: 'Add legend to salary histogram',
    status: 'todo', priority: 'high',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysFromNow(3)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-3', createdAt: daysAgo(1), updatedAt: daysAgo(1), order: 0,
  },
  {
    id: 't-2-3', projectId: 'p-2',
    title: 'Implement skill-gap recommendations engine',
    status: 'todo', priority: 'medium',
    assigneeId: 'u-student-3', dueDate: dateOnly(daysFromNow(10)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-3', createdAt: daysAgo(5), updatedAt: daysAgo(5), order: 1,
  },
  {
    id: 't-2-4', projectId: 'p-2',
    title: 'Student profile input form',
    status: 'todo', priority: 'medium',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysFromNow(8)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-3', createdAt: daysAgo(4), updatedAt: daysAgo(4), order: 2,
  },
  {
    id: 't-2-5', projectId: 'p-2',
    title: 'Add year-over-year trend export to CSV',
    status: 'in-review', priority: 'low',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysFromNow(12)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(8), updatedAt: daysAgo(1), order: 0,
  },
  {
    id: 't-2-6', projectId: 'p-2',
    title: 'Performance optimise large dataset queries',
    status: 'todo', priority: 'high',
    assigneeId: 'u-student-3', dueDate: dateOnly(daysFromNow(7)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-3', createdAt: daysAgo(1), updatedAt: daysAgo(1), order: 3,
  },
  {
    id: 't-2-7', projectId: 'p-2',
    title: 'Write project report (section 3 — methodology)',
    status: 'in-progress', priority: 'medium',
    assigneeId: 'u-student-3', dueDate: dateOnly(daysFromNow(11)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-3', createdAt: daysAgo(3), updatedAt: daysAgo(1), order: 1,
  },

  // ── P3 Attendance System — overdue (7 tasks) ───────────────────────────────
  {
    id: 't-3-1', projectId: 'p-3', milestoneId: 'ms-3-2',
    title: 'Integrate MediaPipe face detection into React Native',
    status: 'in-progress', priority: 'high',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysAgo(8)),
    subtasks: [
      { id: 'st-8', title: 'Add native module bridge', completed: true },
      { id: 'st-9', title: 'Test on Android 12', completed: false },
      { id: 'st-10', title: 'Test on iOS 17', completed: false },
    ],
    fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(30), updatedAt: daysAgo(3), order: 0,
  },
  {
    id: 't-3-2', projectId: 'p-3', milestoneId: 'ms-3-2',
    title: 'Design offline SQLite schema',
    status: 'done', priority: 'high',
    assigneeId: 'u-student-3', dueDate: dateOnly(daysAgo(20)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(50), updatedAt: daysAgo(20), order: 1,
  },
  {
    id: 't-3-3', projectId: 'p-3', milestoneId: 'ms-3-2',
    title: 'Build attendance mark UI',
    status: 'todo', priority: 'high',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysAgo(3)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(25), updatedAt: daysAgo(25), order: 2,
  },
  {
    id: 't-3-4', projectId: 'p-3', milestoneId: 'ms-3-3',
    title: 'Implement sync queue with conflict resolution',
    status: 'todo', priority: 'high',
    assigneeId: 'u-student-3', dueDate: dateOnly(daysAgo(2)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(20), updatedAt: daysAgo(20), order: 0,
  },
  {
    id: 't-3-5', projectId: 'p-3', milestoneId: 'ms-3-3',
    title: 'Build ERP REST client',
    status: 'todo', priority: 'medium',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysAgo(1)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(15), updatedAt: daysAgo(15), order: 1,
  },
  {
    id: 't-3-6', projectId: 'p-3',
    title: 'Improve face detection accuracy with lighting normalisation',
    status: 'todo', priority: 'high',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysAgo(5)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(18), updatedAt: daysAgo(18), order: 3,
  },
  {
    id: 't-3-7', projectId: 'p-3',
    title: 'Draft project recovery plan for faculty',
    status: 'in-progress', priority: 'high',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysFromNow(1)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(1), updatedAt: daysAgo(0), order: 4,
  },

  // ── P4 Peer Review Platform (7 tasks) ─────────────────────────────────────
  {
    id: 't-4-1', projectId: 'p-4', milestoneId: 'ms-4-3',
    title: 'Design point calculation algorithm',
    status: 'done', priority: 'medium',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysAgo(10)),
    subtasks: [{ id: 'st-11', title: 'Write algorithm spec doc', completed: true }],
    fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(20), updatedAt: daysAgo(10), order: 0,
  },
  {
    id: 't-4-2', projectId: 'p-4', milestoneId: 'ms-4-3',
    title: 'Build leaderboard UI component',
    status: 'done', priority: 'medium',
    assigneeId: 'u-student-4', dueDate: dateOnly(daysAgo(5)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(15), updatedAt: daysAgo(5), order: 1,
  },
  {
    id: 't-4-3', projectId: 'p-4', milestoneId: 'ms-4-3',
    title: 'Add 8 badge types with unlock conditions',
    status: 'in-review', priority: 'low',
    assigneeId: 'u-student-4', dueDate: dateOnly(daysFromNow(3)),
    subtasks: [
      { id: 'st-12', title: 'Design badge SVGs', completed: true },
      { id: 'st-13', title: 'Implement unlock logic', completed: true },
      { id: 'st-14', title: 'Add badge reveal animation', completed: false },
    ],
    fileIds: [], linkIds: [],
    createdBy: 'u-student-4', createdAt: daysAgo(8), updatedAt: daysAgo(1), order: 0,
  },
  {
    id: 't-4-4', projectId: 'p-4',
    title: 'Accessibility audit — keyboard & screen reader',
    status: 'in-progress', priority: 'high',
    assigneeId: 'u-student-4', dueDate: dateOnly(daysFromNow(4)),
    subtasks: [
      { id: 'st-15', title: 'NVDA test on Firefox', completed: false },
      { id: 'st-16', title: 'VoiceOver test on Safari', completed: false },
    ],
    fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(5), updatedAt: daysAgo(1), order: 0,
  },
  {
    id: 't-4-5', projectId: 'p-4',
    title: 'Write end-to-end tests with Playwright',
    status: 'in-progress', priority: 'medium',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysFromNow(5)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(4), updatedAt: daysAgo(1), order: 1,
  },
  {
    id: 't-4-6', projectId: 'p-4',
    title: 'Final project report and presentation slides',
    status: 'todo', priority: 'medium',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysFromNow(6)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(2), updatedAt: daysAgo(2), order: 0,
  },
  {
    id: 't-4-7', projectId: 'p-4',
    title: 'Production deployment to Vercel',
    status: 'todo', priority: 'high',
    assigneeId: 'u-student-1', dueDate: dateOnly(daysFromNow(6)),
    subtasks: [], fileIds: [], linkIds: [],
    createdBy: 'u-student-1', createdAt: daysAgo(1), updatedAt: daysAgo(1), order: 1,
  },
]

// ─── FILES ────────────────────────────────────────────────────────────────────

export const FILES: FileAsset[] = [
  { id: 'file-1', projectId: 'p-1', milestoneId: 'ms-1-1', name: 'sensor_calibration_report.pdf', mimeType: 'application/pdf', sizeBytes: 542000, url: '/mock/files/sensor_calibration_report.pdf', uploadedBy: 'u-student-2', uploadedAt: daysAgo(21) },
  { id: 'file-2', projectId: 'p-1', milestoneId: 'ms-1-1', name: 'node_schematic_v2.png', mimeType: 'image/png', sizeBytes: 1240000, url: '/mock/files/node_schematic_v2.png', uploadedBy: 'u-student-2', uploadedAt: daysAgo(21) },
  { id: 'file-3', projectId: 'p-1', milestoneId: 'ms-1-2', name: 'api_spec_openapi.yaml', mimeType: 'application/yaml', sizeBytes: 28000, url: '/mock/files/api_spec_openapi.yaml', uploadedBy: 'u-student-1', uploadedAt: daysAgo(2) },
  { id: 'file-4', projectId: 'p-2', milestoneId: 'ms-2-1', name: 'placement_data_cleaned_2019_2024.csv', mimeType: 'text/csv', sizeBytes: 3400000, url: '/mock/files/placement_data.csv', uploadedBy: 'u-student-3', uploadedAt: daysAgo(16) },
  { id: 'file-5', projectId: 'p-3', milestoneId: 'ms-3-1', name: 'face_detection_benchmark_results.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', sizeBytes: 190000, url: '/mock/files/face_detection_benchmark.xlsx', uploadedBy: 'u-student-1', uploadedAt: daysAgo(41) },
  { id: 'file-6', projectId: 'p-4', milestoneId: 'ms-4-1', name: 'github_app_architecture.pdf', mimeType: 'application/pdf', sizeBytes: 810000, url: '/mock/files/github_app_architecture.pdf', uploadedBy: 'u-student-1', uploadedAt: daysAgo(31) },
  { id: 'file-7', projectId: 'p-4', milestoneId: 'ms-4-2', name: 'rubric_engine_demo.mp4', mimeType: 'video/mp4', sizeBytes: 28000000, url: '/mock/files/rubric_engine_demo.mp4', uploadedBy: 'u-student-4', uploadedAt: daysAgo(8) },
  { id: 'file-8', projectId: 'p-4', milestoneId: 'ms-4-3', name: 'gamification_spec.pdf', mimeType: 'application/pdf', sizeBytes: 340000, url: '/mock/files/gamification_spec.pdf', uploadedBy: 'u-student-4', uploadedAt: daysAgo(1) },
]

// ─── LINKS ────────────────────────────────────────────────────────────────────

export const LINKS: Link[] = [
  { id: 'link-1', projectId: 'p-1', milestoneId: 'ms-1-1', title: 'MQTT protocol reference', url: 'https://mqtt.org/mqtt-specification/', addedBy: 'u-student-2', addedAt: daysAgo(25) },
  { id: 'link-2', projectId: 'p-1', taskId: 't-1-1', title: 'WebSocket message schema (Notion)', url: 'https://notion.so/mock-iot-schema', addedBy: 'u-student-2', addedAt: daysAgo(28) },
  { id: 'link-3', projectId: 'p-2', milestoneId: 'ms-2-1', title: 'Placement data scraper repo', url: 'https://github.com/mock/placement-scraper', addedBy: 'u-student-3', addedAt: daysAgo(17) },
  { id: 'link-4', projectId: 'p-2', milestoneId: 'ms-2-2', title: 'Recharts radar chart docs', url: 'https://recharts.org/en-US/api/RadarChart', addedBy: 'u-student-3', addedAt: daysAgo(5) },
  { id: 'link-5', projectId: 'p-4', milestoneId: 'ms-4-1', title: 'GitHub Apps documentation', url: 'https://docs.github.com/en/apps', addedBy: 'u-student-1', addedAt: daysAgo(32) },
  { id: 'link-6', projectId: 'p-4', milestoneId: 'ms-4-3', title: 'Live demo deployment', url: 'https://peer-review-demo.vercel.app', addedBy: 'u-student-1', addedAt: daysAgo(1) },
]

// ─── COMMENTS ─────────────────────────────────────────────────────────────────

export const COMMENTS: Comment[] = [
  { id: 'cmt-1', authorId: 'u-faculty-1', entityId: 'ms-1-2', entityType: 'milestone', body: 'Looking forward to seeing the dashboard backend. Make sure to document the WebSocket reconnection strategy.', createdAt: daysAgo(3) },
  { id: 'cmt-2', authorId: 'u-student-2', entityId: 'ms-1-2', entityType: 'milestone', body: 'Will do! We\'re planning an exponential backoff with jitter. Draft doc is in the repo already.', createdAt: daysAgo(3) },
  { id: 'cmt-3', authorId: 'u-student-1', entityId: 't-1-3', entityType: 'task', body: 'GET /sensors is implemented and tested. Working on /anomalies — should be ready for review by tomorrow.', createdAt: daysAgo(2) },
  { id: 'cmt-4', authorId: 'u-student-2', entityId: 't-1-3', entityType: 'task', body: 'Great! Make sure the anomaly endpoint returns both active and resolved anomalies with a filter param.', createdAt: daysAgo(1) },
  { id: 'cmt-5', authorId: 'u-faculty-1', entityId: 'ms-2-2', entityType: 'milestone', body: 'The radar chart labels are clipping on narrow viewports. Please see the screenshots in the review.', createdAt: daysAgo(1) },
  { id: 'cmt-6', authorId: 'u-student-3', entityId: 'ms-2-2', entityType: 'milestone', body: 'Understood. We\'ll truncate and add tooltips for the full label on hover. Working on a fix now.', createdAt: daysAgo(1) },
  { id: 'cmt-7', authorId: 'u-student-1', entityId: 't-4-4', entityType: 'task', body: 'I\'ll set up the screen reader testing environment this afternoon. NVDA + Firefox is the baseline.', createdAt: daysAgo(1) },
  { id: 'cmt-8', authorId: 'u-faculty-1', entityId: 'ms-4-3', entityType: 'milestone', body: 'Reviewing the gamification milestone now. Demo video looks promising!', createdAt: daysAgo(0) },
]

// ─── ACTIVITY ─────────────────────────────────────────────────────────────────

export const ACTIVITIES: Activity[] = [
  { id: 'act-1', projectId: 'p-1', actorId: 'u-student-1', event: 'task-status-changed', summary: 'Siddharth moved "Implement REST API" to In review', entityId: 't-1-3', entityType: 'task', createdAt: daysAgo(1) },
  { id: 'act-2', projectId: 'p-1', actorId: 'u-student-2', event: 'milestone-submitted', summary: 'Ananya submitted "Real-time dashboard backend" for review', entityId: 'ms-1-2', entityType: 'milestone', createdAt: daysAgo(2) },
  { id: 'act-3', projectId: 'p-2', actorId: 'u-student-3', event: 'task-status-changed', summary: 'Rohan started "Fix radar chart label overflow"', entityId: 't-2-1', entityType: 'task', createdAt: daysAgo(1) },
  { id: 'act-4', projectId: 'p-2', actorId: 'u-faculty-1', event: 'milestone-changes-requested', summary: 'Dr. Venkataraman requested changes on "Core visualisation components"', entityId: 'ms-2-2', entityType: 'milestone', createdAt: daysAgo(1) },
  { id: 'act-5', projectId: 'p-4', actorId: 'u-student-4', event: 'task-status-changed', summary: 'Divya moved "Add 8 badge types" to In review', entityId: 't-4-3', entityType: 'task', createdAt: daysAgo(1) },
  { id: 'act-6', projectId: 'p-4', actorId: 'u-student-1', event: 'milestone-submitted', summary: 'Siddharth submitted "Gamification & leaderboard" for review', entityId: 'ms-4-3', entityType: 'milestone', createdAt: daysAgo(1) },
  { id: 'act-7', projectId: 'p-4', actorId: 'u-faculty-1', event: 'milestone-approved', summary: 'Dr. Venkataraman approved "Review rubric engine"', entityId: 'ms-4-2', entityType: 'milestone', createdAt: daysAgo(5) },
  { id: 'act-8', projectId: 'p-1', actorId: 'u-student-2', event: 'task-created', summary: 'Ananya created "Deploy to college server & set up CI"', entityId: 't-1-7', entityType: 'task', createdAt: daysAgo(2) },
  { id: 'act-9', projectId: 'p-3', actorId: 'u-student-1', event: 'task-status-changed', summary: 'Siddharth started "Draft project recovery plan"', entityId: 't-3-7', entityType: 'task', createdAt: daysAgo(0) },
]

// ─── SNAPSHOT EXPORT ─────────────────────────────────────────────────────────

/** Complete seed snapshot — used to reset demo data */
export interface SeedSnapshot {
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
}

export const SEED_SNAPSHOT: SeedSnapshot = {
  users: USERS,
  projects: PROJECTS,
  teamMembers: TEAM_MEMBERS,
  invites: INVITES,
  tasks: TASKS,
  milestones: MILESTONES,
  comments: COMMENTS,
  files: FILES,
  links: LINKS,
  activities: ACTIVITIES,
}
