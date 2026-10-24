# Brief
Scope: build ONLY the front end (UI, UX, interactions, motion, 3D). No backend, no real auth, no database. Everything runs on typed mock data behind a swappable service layer (one `api` interface plus a mock implementation) so teammates can plug in a real API later.

Product: students form teams, create academic projects, assign tasks with deadlines and priorities, update task status, attach documents and links, and track progress. Faculty monitor all projects from a dashboard and review milestones. Goal: more teamwork, accountability and on-time delivery.

Required clickable flow: Login -> Create project -> Form team -> Assign tasks -> Update status -> Faculty review.
Roles: Student and Faculty. The login screen has a role switch for the demo.

Stack (fixed): React 18 + Vite + TypeScript (strict), React Router, Tailwind CSS with design tokens as CSS variables, Motion (motion.dev, import from "motion/react"), three + @react-three/fiber + @react-three/drei (login hero only, lazy-loaded), Zustand, react-hook-form + zod, Radix UI primitives (dialog, popover, dropdown, tabs, tooltip), vaul (sheets, drawers), sonner (toasts), cmdk (command palette), @dnd-kit (kanban), lucide-react (1.5 stroke). Never hand-roll toasts, drawers, dropdowns or command menus.

Navigation labels: Projects, Tasks, Teams, Files, Reviews (faculty only).

Screens:
1. Login: 3D hero left, sign-in right (email, password, Student/Faculty segmented control, "Sign in"). Inline validation.
2. Student dashboard: greeting, tasks due soon, active projects with progress rings, team activity feed, upcoming milestones.
3. Create project: stepper Details -> Invite team -> Milestones -> Review. Draft autosave indicator, back always available, success moment on create.
4. Teams: searchable student directory with skill and interest chips, filter by skill and availability, invite popover showing state (Invited / Joined / Declined), team roster with roles.
5. Student profile: avatar, bio, editable skill chips with proficiency, interests, projects, contribution summary.
6. Project workspace tabs: Board (To do / In progress / In review / Done), List (sortable table), Milestones (horizontal timeline), Files and links (upload dropzone with progress, link cards), Team, Activity. Header shows progress ring, deadline, health.
7. Task drawer: title, description, assignee, priority, due date, status, subtasks, comments, attachments and links. Inline edit, optimistic updates, undo toast.
8. Faculty dashboard: summary strip (projects, at risk, overdue tasks, awaiting review), sortable and filterable projects table (health badge, progress, team, next milestone, last activity); click opens project overview with per-member contribution bars, task status breakdown, milestones.
9. Faculty review: milestone review panel with submitted work, files and links, rubric-style feedback, "Approve" and "Request changes", comment thread. Result updates the student view live in the mock store.
Every list and view has designed loading (skeleton), empty (invites an action), and error (says what happened and how to fix it, never apologizes) states.

Copy: plain verbs, active voice, sentence case. The same action keeps the same name everywhere ("Publish" produces "Published"). CTAs say exactly what happens: "Create project", "Invite teammate", "Send for review", "Save changes".

Mock data: 4 students, 1 faculty, 4 projects across health states, about 28 tasks across all statuses and priorities, 3 milestones per project, realistic Indian university names and project titles (for example an IoT campus monitor, a placement analytics tool), comments and files. Seeded so every screen is populated on first load. "Reset demo data" action in the user menu.
