# Engineering & Design Plan: Student Project and Team Collaboration Portal

**Role:** Principal Design Engineer, Apple  
**Document Status:** Architecture, Design Token System, Wireframes & Motion Specification (Step 0 of 10)  
**Governing Documents:** [docs/BRIEF.md](file:///c:/Users/Pavan%20Dore/Desktop/weekend%20hack%20frontend/StudentProject-TeamCollabPortal/docs/BRIEF.md), [docs/DESIGN_RULES.md](file:///c:/Users/Pavan%20Dore/Desktop/weekend%20hack%20frontend/StudentProject-TeamCollabPortal/docs/DESIGN_RULES.md)

---

## 1. Summary of the Token System

The design system follows the philosophy of **"quiet glass, one loud moment"**: calm, precise, spacious interfaces reminiscent of macOS and visionOS system settings combined with professional creative tools. Every visual attribute—color, typography, shape, depth, spacing, and motion—is governed by strict named tokens defined as CSS variables with first-class light and dark mode parity.

### 1.1 Color Palette & Semantic Tokens

All values strictly preserve WCAG 2.2 AA contrast standards (minimum 4.5:1 for body copy; 3:1 for large display text and UI components). Color is never used as the sole conveyor of status or meaning.

| Token | Light Mode Value | Dark Mode Value | Usage Specification |
| :--- | :--- | :--- | :--- |
| `--canvas` | `#F5F5F7` | `#000000` | Base window and background viewport canvas |
| `--surface` | `#FFFFFF` | `#1C1C1E` | Primary cards, table bodies, content panels |
| `--surface-raised` | `#FFFFFF` | `#2C2C2E` | Lifted menus, popovers, dialogs, drawers |
| `--ink` | `#1D1D1F` | `#F5F5F7` | High-contrast primary copy, headings, active icons |
| `--ink-secondary`| `#6E6E73` | `#A1A1A6` | Secondary metadata, captions, inactive icons |
| `--accent` | `#0071E3` | `#2997FF` | Primary action buttons, selection states, focus rings |
| `--hairline` | `rgba(0,0,0,0.08)`| `rgba(255,255,255,0.12)` | Structural 1px dividers, borders, table row separation |

#### Semantic Status & Priority Tokens
Status and priority indicators always bundle an accessible Lucide icon (1.5 stroke) and an explicit text label.

* **Status:**
  * To do: `--status-todo` (`#8E8E93` light & dark) + Circle icon
  * In progress: `--status-in-progress` (`#0A84FF` light & dark) + Clock/Half-circle icon
  * In review: `--status-in-review` (`#FF9F0A` light & dark) + Eye icon
  * Done: `--status-done` (`#30D158` light & dark) + Check-circle icon
* **Task Priority:**
  * High: `--priority-high` (`#FF453A`)
  * Medium: `--priority-medium` (`#FF9F0A`)
  * Low: `--priority-low` (`#8E8E93`)
* **Project Health:**
  * On track: `--health-ontrack` (`#30D158`) + Shield-check icon
  * At risk: `--health-atrisk` (`#FF9F0A`) + Alert-triangle icon
  * Overdue: `--health-overdue` (`#FF453A`) + Alert-circle icon

#### Glass & Translucency Materials
* `--glass-material`: `backdrop-filter: blur(20px) saturate(180%)`
* Light mode glass surface: `rgba(255, 255, 255, 0.72)` + top hairline highlight `rgba(255, 255, 255, 0.8)`
* Dark mode glass surface: `rgba(28, 28, 30, 0.75)` + top hairline highlight `rgba(255, 255, 255, 0.15)`
* Scroll edge treatment: Dynamic gradient mask fade on main viewport under toolbar, eliminating crude hard borders.
* Accessibility fallbacks: Under `@media (prefers-reduced-transparency: reduce)`, blur is removed and surfaces resolve to 100% opaque solid `--surface` / `--surface-raised`. Under `@media (prefers-contrast: more)`, borders elevate from subtle hairline to solid high-contrast borders.

---

### 1.2 Typography System

The typographic stack leverages native system optical sizing, targeting Apple SF Pro with Inter Variable fallback:
`font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, sans-serif; font-optical-sizing: auto;`

| Role Token | Size (rem / px) | Line Height | Tracking | Weight | Semantic HTML / Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--font-display` | `3.5rem` (56px) | 1.05 | `-0.03em` | 600 SemiBold | `h1` on 3D Login Hero only |
| `--font-title-1` | `2.125rem` (34px) | 1.12 | `-0.022em`| 700 Bold | `h1` Screen titles (Dashboard, Workspace) |
| `--font-title-2` | `1.5rem` (24px) | 1.20 | `-0.018em`| 600 SemiBold | `h2` Section titles, Drawer titles |
| `--font-headline`| `1.0625rem` (17px)| 1.30 | `-0.01em` | 600 SemiBold | `h3` Card titles, column headers, table headers |
| `--font-body` | `0.9375rem` (15px)| 1.50 | `0em` | 400 Regular | Primary content, descriptions, inputs |
| `--font-caption` | `0.75rem` (12px) | 1.40 | `+0.01em` | 500 Medium | Meta timestamps, status badges, secondary tags |

**Typographic Rules:** Strict sentence case across all navigation, buttons, titles, and labels. No uppercase eyebrow labels. No single-word colored accent gimmicks.

---

### 1.3 Shape, Depth & Elevation Tokens

Surfaces respect a strict physical hierarchy. Corner smoothing is applied progressively via `@supports (corner-shape: squircle)`.

| Token | Radius Value | Squircle Hierarchy & Target Surfaces | Shadow Layering (Light / Dark) |
| :--- | :--- | :--- | :--- |
| `--radius-chip` | `8px` | Badges, status pills, tags, filter chips | `0 1px 2px rgba(0,0,0,0.04)` / none |
| `--radius-control`| `10px` | Form inputs, buttons, segmented controls | `0 1px 2px rgba(0,0,0,0.05)` / `0 1px 2px rgba(0,0,0,0.3)` |
| `--radius-card` | `16px` | Content modules, table containers, kanban cards | `0 4px 12px rgba(0,0,0,0.04)` / `0 4px 16px rgba(0,0,0,0.4)` |
| `--radius-sheet` | `24px` | Slide-over drawers (Task drawer), bottom sheets | `0 12px 36px rgba(0,0,0,0.12)` / `0 16px 48px rgba(0,0,0,0.6)` |
| `--radius-window`| `28px` | Central modal dialogs, login container | `0 24px 64px rgba(0,0,0,0.16)` / `0 32px 80px rgba(0,0,0,0.7)` |

---

### 1.4 Spacing & Layout Tokens

Built strictly on an 8-point base grid:
* `--space-1`: `4px` (micro padding, icon gaps)
* `--space-2`: `8px` (chip padding, dense controls)
* `--space-3`: `12px` (standard input padding, list item gaps)
* `--space-4`: `16px` (card padding, gutter gaps)
* `--space-6`: `24px` (section spacing, dialog padding)
* `--space-8`: `32px` (layout module margins)
* `--space-12`: `48px` (major section separations)
* Layout constraint: `--content-max-width: 1280px; margin: 0 auto;`

---

## 2. ASCII Wireframes

### 2.1 App Shell (Responsive Desktop 1280px Viewport)

The app shell provides persistent translucent navigation with macOS-grade clarity. Content scrolls smoothly beneath the glass toolbar with an optical gradient mask fade.

```text
+---------------------------------------------------------------------------------------------------------------------------------------+
|  [Logo] CollabPortal       [Search projects, tasks, teams... ⌘K]                 [Reset demo data]  [Theme: ☼/☾]  [Role: Student (S. Rao)]|
+---------------------------------------------------------------------------------------------------------------------------------------+
|  SIDEBAR (Translucent Glass)       |  MAIN VIEWPORT (Max-width 1280px, Dynamic Scroll Fade Top)                                      |
|  --------------------------------- |  ---------------------------------------------------------------------------------------------  |
|  NAVIGATION                        |  Student dashboard                                                                              |
|  [▤ Projects]                     |  Good morning, Siddharth. You have 3 tasks due this week.                                       |
|  [✓ Tasks]                        |                                                                                                 |
|  [👥 Teams]                        |  METRICS & WORKLOAD STRIP                                                                       |
|  [📁 Files]                        |  +-------------------------------------------------------------------------------------------+  |
|  [⚖ Reviews] *(Faculty only)*      |  | Active projects: 2    | Tasks due soon: 3     | Pending reviews: 1    | Team health: Good    |  |
|                                    |  +-------------------------------------------------------------------------------------------+  |
|  ACTIVE PINNED PROJECTS            |                                                                                                 |
|  • IoT Campus Monitor              |  ACTIVE PROJECTS                                                                                |
|  • Placement Analytics Platform    |  +----------------------------------------------+ +-------------------------------------------+  |
|                                    |  | IoT Campus Air & Energy Monitor              | | Campus Placement Analytics Engine         |  |
|  --------------------------------- |  | Health: [✓ On track]     Due: Nov 14         | | Health: [▲ At risk]     Due: Nov 28       |  |
|  FOOTER STATUS                     |  | Progress: [ (72%) Ring ] 8 of 11 tasks done  | | Progress: [ (45%) Ring ] 5 of 12 tasks done|  |
|  [● API: Local Mock Active]        |  | Team: (SR) (AK) (PM) (ND)                    | | Team: (SR) (TV) (RJ)                      |  |
|  [⚙ Settings]                      |  +----------------------------------------------+ +-------------------------------------------+  |
|  [Siddharth Rao - B.Tech CSE '25]  |                                                                                                 |
|  [Sign out]                        |  RECENT ACTIVITY FEED                                UPCOMING MILESTONES                        |
|                                    |  • Priya M. uploaded `circuit_v2.pdf` (1h ago)       • Milestone 2: Hardware Sensor Assembly   |
|                                    |  • Task "MQTT Broker Setup" marked Done by Ankit    |  Due in 4 days (Nov 1)                  |
|                                    |  • Faculty Dr. Iyer requested changes on M1 (4h ago) • Milestone 1 Review: Placement Portal    |
|                                    |                                                     |  Scheduled for Nov 6                    |
+------------------------------------+-------------------------------------------------------------------------------------------------+
```

---

### 2.2 Project Workspace: Board Tab & Task Drawer (Parallel Panel)

The board tab is designed for high-density, focused interaction. Selecting a task card opens the non-modal Task Drawer sliding in from the right edge without a dimming scrim, allowing simultaneous board inspection and keyboard editing.

```text
+---------------------------------------------------------------------------------------------------------------------------------------+
|  CollabPortal > Projects > IoT Campus Air & Energy Monitor                                                                            |
|  IoT Campus Air & Energy Monitor          Health: [✓ On track]    Deadline: Nov 14, 2026    Team: (SR) (AK) (PM) (ND)   [+ Invite]      |
|  Tabs: [ [Board] | List | Milestones | Files and links | Team | Activity ]                       Progress: [ (72%) Progress Ring ]      |
+---------------------------------------------------------------------------------------------------------------------------------------+
|  KANBAN WORKSPACE                                                          |  TASK DRAWER (Slide-over, 24px Sheet Radius, No Scrim)   |
|  ------------------------------------------------------------------------- |  -----------------------------------------------------  |
|  TO DO (2)        | IN PROGRESS (3)  | IN REVIEW (1)    | DONE (5)         |  [Close ✕]                                [Undo Toast]  |
|  -----------------+------------------+------------------+----------------- |  Firmware Calibration for LoRa Transceiver              |
|  [+ New task]     |                  |                  |                  |  Status:      [ In progress ▾ ]                         |
|                   | [Sensor Mesh]    | [Milestone 1]    | [MQTT Broker]    |  Priority:    [ High ▾ ]                                |
|  [PCB Schematic]  | Calibrate radio  | Core telemetry   | Broker verified  |  Assignee:    [ Siddharth Rao ▾ ]                       |
|  Priority: Medium | Priority: High   | packet parser    | Priority: High   |  Due date:    [ Nov 02, 2026 ▾ ]                        |
|  Assignee: Priya  | Assignee: Sid    | Priority: Medium | Assignee: Ankit  |  Milestone:   [ Milestone 2: Sensor Assembly ▾ ]        |
|  Due: Nov 06      | Due: Nov 02      | Assignee: Priya  | Status: [✓ Done] |  -----------------------------------------------------  |
|  Subtasks: 1/3    | Subtasks: 4/5    | Due: Today       |                  |  DESCRIPTION                                            |
|                   | *(Selected)*     | Status: In rev.  | [BOM Sourcing]   |  Verify packet transmission frequency over 868 MHz band |
|  [Enclosure CAD]  |                  |                  | Complete casing  |  and ensure sleep-mode current remains below 15uA.      |
|  Priority: Low    | [Power Budget]   |                  | specs verified   |                                                         |
|  Assignee: Nidhi  | Calculate draw   |                  | Status: [✓ Done] |  SUBTASKS (4/5)                                         |
|  Due: Nov 10      | Priority: Medium |                  |                  |  [X] Configure SPI pins on ESP32                        |
|                   | Assignee: Ankit  |                  |                  |  [X] Test peer ping within 100m range                   |
|                   | Due: Nov 04      |                  |                  |  [ ] Measure active transmission burst power            |
|                   |                  |                  |                  |  [+ Add subtask]                                        |
|                   |                  |                  |                  |  -----------------------------------------------------  |
|                   |                  |                  |                  |  ATTACHMENTS & LINKS                                    |
|                   |                  |                  |                  |  [📄 lora_datasheet.pdf (1.2 MB)]    [🗑]               |
|                   |                  |                  |                  |  [Dropzone: Drag files or click to upload]              |
|                   |                  |                  |                  |  -----------------------------------------------------  |
|                   |                  |                  |                  |  ACTIVITY & COMMENTS                                    |
|                   |                  |                  |                  |  Priya M. (2h ago): Checked antenna impedance matching. |
|                   |                  |                  |                  |  [Write a comment...                      ] [Send]      |
+---------------------------------------------------------------------------------------------------------------------------------------+
```

---

### 2.3 Faculty Dashboard & Review Viewport

The faculty dashboard unifies institutional supervision across all enrolled student teams. Selecting a project awaiting review opens the structured milestone evaluation panel.

```text
+---------------------------------------------------------------------------------------------------------------------------------------+
|  CollabPortal > Faculty Evaluation Portal                                                          Dr. Arisudan Iyer (Dept. of CSE)   |
|  Academic Year: 2026-27 | Capstone Batch A                                                         [Export Summary]  [Sign out]       |
+---------------------------------------------------------------------------------------------------------------------------------------+
|  FACULTY SUMMARY STRIP                                                                                                                |
|  +---------------------------------------------------------------------------------------------------------------------------------+  |
|  | Supervised projects: 4  | Projects at risk: 1    | Overdue student tasks: 2  | Milestones awaiting review: 2                      |  |
|  +---------------------------------------------------------------------------------------------------------------------------------+  |
|                                                                                                                                       |
|  FILTER & SEARCH CONTROLS                                                                                                             |
|  [ Search by project name, student, or keyword...            ]   Filter: [ All Health ▾ ]  Sort: [ Milestone Deadline ▾ ]             |
|                                                                                                                                       |
|  PROJECT SUPERVISION TABLE                                                                                                            |
|  +---------------------------------------------------------------------------------------------------------------------------------+  |
|  | Project & Domain       | Health      | Progress | Team Lead & Roster    | Next Milestone           | Last Activity | Action     |  |
|  |------------------------+-------------+----------+-----------------------+--------------------------+---------------+------------|  |
|  | IoT Campus Air Monitor | [✓ On track]| 72% [==] | Siddharth Rao + 3 mem | M2: Hardware Assembly    | 42m ago       | [Review]   |  |
|  | Embedded IoT Systems   |             |          | (SR) (AK) (PM) (ND)   | Due in 4 days            |               |            |  |
|  |------------------------+-------------+----------+-----------------------+--------------------------+---------------+------------|  |
|  | Placement Analytics    | [▲ At risk] | 45% [= ] | Tanisha Verma + 2 mem | M1: Analytics Pipeline   | 2h ago        | [Review]   |  |
|  | Data Science & ML      |             |          | (TV) (RJ) (SP)        | 2 tasks overdue          |               |            |  |
|  |------------------------+-------------+----------+-----------------------+--------------------------+---------------+------------|  |
|  | Autonomous Rover Nav   | [✓ On track]| 88% [===]| Rohan Mehta + 3 mem   | M3: Field Test Signoff   | Yesterday     | [Inspect]  |  |
|  | Robotics & Control     |             |          | (RM) (KL) (SS) (VT)   | Nov 18                   |               |            |  |
|  |------------------------+-------------+----------+-----------------------+--------------------------+---------------+------------|  |
|  | Hospital Triage EHR    | [✕ Overdue] | 30% [= ] | Ananya Sen + 3 mem    | M1: HL7 FHIR Bridge      | 3 days ago    | [Intervene]|  |
|  | Healthcare Informatics |             |          | (AS) (DP) (MC) (SK)   | Overdue by 5 days        |               |            |  |
|  +---------------------------------------------------------------------------------------------------------------------------------+  |
|                                                                                                                                       |
|  FACULTY MILESTONE REVIEW MODAL / SLIDE-IN (Triggered by [Review] on IoT Campus Air Monitor)                                         |
|  +---------------------------------------------------------------------------------------------------------------------------------+  |
|  | Review Submission: Milestone 2 — Sensor Mesh Hardware Assembly & Telemetry                                    [Close ✕]         |  |
|  | Submitted by: Siddharth Rao (Team Lead) on Oct 23, 2026   | Deliverables: 2 Files, 1 Repository Link                             |  |
|  |                                                                                                                                 |  |
|  | SUBMITTED ARTIFACTS                                        RUBRIC-STYLE EVALUATION                                              |  |
|  | • [📄 schematic_schematics_revB.pdf (4.1 MB)]               1. Technical Rigor & Architecture:       [ 4 / 5 Exceeds ]           |  |
|  | • [📄 sensor_calibration_data.csv (840 KB)]                 2. Code Quality & Version Control:       [ 5 / 5 Mastery ]           |  |
|  | • [🔗 GitHub Repo: github.com/uni-iot/mesh-core]            3. Milestone Schedule & Delivery:        [ 4 / 5 On time ]           |  |
|  |                                                                                                                                 |  |
|  | FACULTY FEEDBACK & REMARKS                                                                                                      |  |
|  | [ Excellent noise isolation on the analog sensor front-end. Ensure calibration constants are documented in README. ]            |  |
|  |                                                                                                                                 |  |
|  | DECISION ACTIONS:                                                                                                               |  |
|  | [ Request changes ]                                                      [ Approve milestone ]                                  |  |
|  +---------------------------------------------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------------------------------------------+
```

---

## 3. Motion System & Animation Specification Table

Every interactive transition is gated by **frequency** and **purpose**. If an interaction fails the necessity gate, it ships with zero animation. Animated properties are strictly restricted to `transform` (using full matrix/transform strings) and `opacity`. Layout-triggering properties (`width`, `height`, `margin`, `top`, `padding`) are forbidden from animations.

### 3.1 Timing Curves & Spring Physics
* `--ease-out`: `cubic-bezier(0.23, 1, 0.32, 1)` (Precision settle for entering elements and feedback)
* `--ease-in-out`: `cubic-bezier(0.77, 0, 0.175, 1)` (Cross-fades and dual-direction transitions)
* `--ease-drawer`: `cubic-bezier(0.32, 0.72, 0, 1)` (Fluid sheet motion mirroring physical inertia)
* Spring Physics Default: Critically damped (`bounce: 0`, `duration: 0.4s`); bounce `0.2` permitted exclusively on flick gestures.

### 3.2 Motion Specification Matrix

| Surface | Frequency Tier | Purpose | Tool | Curve | Duration |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Interactive Control Press** (Button, Segmented Control) | High (Multiple/min) | Tactile physical feedback on pointer-down | CSS `:active` | `--ease-out` | `100ms` (scale: `0.97`) |
| **Interactive Row / Card Hover** | High (Multiple/min) | Visual affordance without distraction | CSS `@media (hover: hover)` | Linear / `--ease-out` | `100ms` (background color shift only) |
| **Tooltip Reveal** | Medium (On hover pause) | Contextual information hint | Radix UI + CSS | `--ease-out` | `125ms` (opacity 0 → 1, scale `0.96` → `1`) |
| **Popover & Dropdown Menu** | Medium (Several/session) | Contextual action menu emergence | Radix + CSS / Motion | `--ease-out` (origin at trigger) | `160ms` enter, `120ms` exit |
| **Command Palette (cmdk)** | Medium (Frequent shortcut) | Rapid global search & jumping | cmdk + CSS | Instant / `--ease-out` | `140ms` (opacity + scale `0.98` → `1`) |
| **Sidebar Navigation Selection** | High (Page changes) | Active indicator relocation | Motion layoutId | Critically damped spring | `240ms` |
| **Route View Transition** | Medium (Navigation) | Orientation preservation without disorientation | Motion `<AnimatePresence>` | `--ease-in-out` | `200ms` (opacity cross-fade only) |
| **Task Drawer (Vaul slide-over)** | Medium (High task inspects) | Parallel context inspection without scrim | Vaul + Motion | `--ease-drawer` | `320ms` enter, `240ms` exit |
| **Modal Dialog (Review, Create)** | Low (Deliberate flows) | Focused modal decision tree | Radix Dialog + Motion | `--ease-out` (centered) | `240ms` enter (scale `0.96` → `1`), `160ms` exit |
| **Toast Notifications (Sonner)** | Medium (Action confirmations) | Non-blocking action feedback & undo | Sonner (CSS transitions) | `--ease-out` | `220ms` enter, `160ms` exit |
| **Kanban Drag & Drop** | Medium (Task triage) | Direct physical manipulation of task state | `@dnd-kit` | Critically damped spring | Instant pickup; `200ms` snap-to-column |
| **Task Marked "Done" Check** | High (Task completion) | Gratifying micro-validation without confetti | SVG Stroke Animation + CSS | `--ease-out` | `200ms` stroke draw + single `400ms` subtle ring pulse |
| **Progress Ring / Bar Value Update** | Medium (Data change) | Visual confirmation of team momentum | SVG strokeDashoffset / CSS | `--ease-out` | `400ms` (on mount and value change only) |
| **Milestone Approved / Project Created** | Rare (Low frequency) | Celebratory milestone validation | Motion `animate` | Soft scale-and-settle spring | `480ms` (gentle settle + toast, no particle confetti) |
| **Login 3D Interactive Hero** | Single moment (Login only) | Single visual crescendo ("one loud moment") | Three.js / R3F (lazy-loaded) | GPU-bound rAF loop | Continuous subtle physics, capped at 60fps/2 DPR |
| **Theme Switch (Light ↔ Dark)** | Low (User preference) | Seamless ambient adaptation | CSS transition on canvas/surface | `--ease-in-out` | `300ms` (zero brightness flash) |
| **Reduced Motion Mode (`prefers-reduced-motion`)** | System override | Accessibility comfort for vestibular safety | Global CSS / Motion override | Linear / `--ease-in-out` | `150ms` (all slides/springs convert to opacity cross-fades) |

---

## 4. Frontend Architecture & Directory Layout

The application code is organized strictly around domain features, robust typed contracts, and swappable service abstraction.

```text
src/
├── app/
│   ├── App.tsx                     # Top-level shell with providers (Theme, Toast, Router)
│   ├── routes.tsx                  # Lazy-loaded route definitions with Error Boundaries
│   └── layout/
│       ├── AppShell.tsx            # Translucent desktop/mobile shell, gradient mask header
│       ├── Sidebar.tsx             # Translucent sidebar navigation & role switcher
│       └── Toolbar.tsx             # Command palette trigger, demo reset, theme toggle
├── features/
│   ├── auth/                       # Login screen, 3D Canvas Hero (R3F), role toggle
│   │   ├── components/             # ThreeHeroCanvas.tsx, LoginForm.tsx, PosterFallback.tsx
│   │   └── authStore.ts            # Current user & active role Zustand store
│   ├── projects/                   # Project workspace, creation stepper, project overview
│   │   ├── components/             # CreateProjectStepper.tsx, ProgressRing.tsx, ProjectHeader.tsx
│   │   └── projectStore.ts         # Project state & optimistic store
│   ├── tasks/                      # Kanban board, List table, Task Drawer (Vaul)
│   │   ├── components/             # KanbanBoard.tsx, KanbanColumn.tsx, TaskCard.tsx, TaskDrawer.tsx
│   │   └── taskStore.ts            # Task mutation, optimistic updates, undo buffer
│   ├── teams/                      # Student directory, skill filters, invite popover
│   │   └── components/             # StudentDirectory.tsx, SkillChips.tsx, InvitePopover.tsx
│   └── faculty/                    # Evaluation dashboard, summary strip, review panel
│       └── components/             # FacultyDashboard.tsx, ProjectTable.tsx, MilestoneReviewModal.tsx
├── components/ui/                  # Atomic primitives built on Radix, Lucide & Vaul
│   ├── Button.tsx                  # Accessible button with scale(0.97) pointer-down
│   ├── Badge.tsx                   # Status & priority badges with mandatory icons
│   ├── Dialog.tsx                  # Radix Dialog wrapper
│   ├── Popover.tsx                 # Radix Popover wrapper
│   ├── SegmentedControl.tsx        # Apple-style sliding pill segmented control
│   ├── Skeleton.tsx                # Designed shimmer loading state
│   ├── EmptyState.tsx              # Action-oriented empty state container
│   └── ErrorState.tsx              # Direct, actionable error boundary component
├── services/                       # Swappable API contracts and mock implementation
│   ├── api.ts                      # Strict TypeScript interface for all backend calls
│   └── mockApi.ts                  # In-memory implementation with simulated latency & seed data
├── mocks/                          # Comprehensive realistic Indian university seed dataset
│   ├── seedData.ts                 # 4 students, 1 faculty, 4 projects, 28 tasks, milestones
│   └── mockStorage.ts              # LocalStorage persistence with "Reset demo data" capability
├── lib/                            # Shared utilities (motion helpers, classnames, formatters)
└── styles/
    ├── tokens.css                  # All CSS variables, translucent materials, and squircle rules
    └── globals.css                 # Tailwind directives, base resets, focus-visible styling
```

---

## 5. Anti-Generic SaaS Audit & Revisions

Before finalizing this blueprint, every screen, pattern, and token was evaluated against common SaaS clichés and generic startup templates. The following deliberate revisions were made to uphold Apple design engineering standards:

### 5.1 Elimination of Generic SaaS Color Schemes
* **Generic Cliché:** Trendy cream/off-white background paired with warm terracotta, or brutalist black paired with neon acid green.
* **Apple Revision:** Eliminated completely. The palette is anchored to authentic Apple system neutral grays (`#F5F5F7` light / `#000000` deep OLED dark) with an authentic monochromatic ink hierarchy (`#1D1D1F` down to `#6E6E73`). The solitary vibrant color is Apple System Accent Blue (`#0071E3` light / `#2997FF` dark), reserved exclusively for primary interactive affordances, active selections, and visible focus rings.

### 5.2 Elimination of "Card Salad" & Modular Bloat
* **Generic Cliché:** Chopping every dashboard into a cluster of identical rounded cards with 1px border lines and heavy drop shadows, resulting in visual clutter.
* **Apple Revision:** Replaced disconnected card clusters with cohesive, structured surfaces. Metric summaries on both the Student and Faculty dashboards are unified into a single horizontal glass strip with subtle 1px hairline dividers (`rgba(0,0,0,0.08)` / `rgba(255,255,255,0.12)`). Information grouping relies on disciplined typographic scale, generous negative space, and semantic alignment rather than endless nested containers.

### 5.3 Elimination of Uppercase Eyebrow Labels
* **Generic Cliché:** Tiny uppercase letter-spaced tags above titles (e.g., `PROJECT OVERVIEW`, `SYSTEM HEALTH`, `TASKS DUE`).
* **Apple Revision:** Strictly prohibited. Headings use natural, human-readable sentence case (`Project overview`, `System health`, `Tasks due soon`) with size-specific optical tracking (`-0.022em` on titles down to `+0.01em` on captions). Hierarchy is communicated cleanly through font size and weight, avoiding visual noise.

### 5.4 Elimination of Button Arrows & Decorative Copy
* **Generic Cliché:** Appending trailing arrows to action buttons (e.g., `Create project →`, `Sign in →`, `Learn more →`).
* **Apple Revision:** All interactive buttons use concise, unambiguous active verbs without arrows: `Create project`, `Invite teammate`, `Send for review`, `Save changes`.

### 5.5 Elimination of Superfluous Motion & Confetti Explosions
* **Generic Cliché:** Full-screen celebratory confetti bursts or bouncing badges whenever an ordinary task is checked off.
* **Apple Revision:** Banned confetti. Normal task completion is rewarded with an elegant, rapid 200ms SVG checkmark draw followed by a single subtle pulse of the status ring. Celebratory scale-and-settle animation is reserved exclusively for two rare, high-value milestones: initial project creation and faculty milestone approval.

### 5.6 Non-Modal Parallel Task Drawer vs. Full Screen Scrim
* **Generic Cliché:** Trapping task editing inside an intrusive modal dialog with a heavy black dimming background that hides the board.
* **Apple Revision:** Specified a smooth side sheet using Vaul (`24px` sheet radius) that slides over the right edge without a dimming scrim. Users can reference the board and adjacent tasks in parallel while editing task details, maintaining continuous mental context.

### 5.7 Optical Squircle Geometry vs. Standard Uniform Radii
* **Generic Cliché:** Uniform `border-radius: 8px` applied indiscriminately across all elements regardless of scale.
* **Apple Revision:** Implemented a hierarchically scaled radius system (`chip: 8px`, `control: 10px`, `card: 16px`, `sheet: 24px`, `window: 28px`) combined with `@supports (corner-shape: squircle)` progressive enhancement for continuous curvature matching iOS and macOS hardware ergonomics.

---

*End of Engineering & Design Plan.*
