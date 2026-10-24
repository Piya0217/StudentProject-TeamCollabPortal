# Campus — Student Project and Team Collaboration Portal

A university collaboration prototype built with React 19, Vite, TypeScript strict mode, React Router, Tailwind CSS, Motion, Three.js / React Three Fiber, Zustand, React Hook Form, Zod, Radix UI dependencies, Vaul, Sonner, cmdk and dnd-kit.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

```bash
npm run build
npm test
```

## Connect to the backend

Start PostgreSQL and the Express API from the repository root first. Then start Vite in this folder. The frontend calls `http://localhost:4000/api` by default; set `VITE_API_BASE_URL` in a local `.env` file to use a different API address.

Seeded demo accounts from `src/db/seed_compat.sql`:

- Student: `alice@example.com` / `password123`
- Student: `bob@example.com` / `password123`
- Faculty: `carol@example.com` / `password123`

The login is checked by the API. Projects, team membership, tasks, status changes, and faculty review submissions are persisted through the backend. File uploads and the student directory remain prototype-only because the current API branch does not expose those endpoints. The backend supports task statuses `todo`, `in_progress`, and `done`; the frontend maps those to its display labels.

## Core flow

1. Sign in as Student.
2. Create a project using the four-step flow.
3. Invite mock students.
4. Open the project workspace and update task statuses.
5. Switch to Faculty by signing out and choosing the Faculty role.
6. Review a milestone and approve it or request changes.

## Structure

```text
src/
  features/auth/       Login hero and sign-in UI
  mocks/                Seed projects, students, tasks
  services/api.ts       Swappable mock API interface
  store/                Zustand state
  styles/tokens.css     Theme and motion tokens
  styles/app.css        Responsive UI and accessibility styles
  types.ts              Shared domain types
  App.tsx                Screens and navigation
```

## Replace mock service with a real API

`src/services/api.ts` is the API adapter. It maps the existing Express response shapes and database enums to the frontend domain models. Keep UI components dependent on typed domain models rather than transport response shapes.

## Design and accessibility notes

- Light and dark tokens live in `src/styles/tokens.css`.
- The 3D login hero is lazy-like isolated behind a scene component and degrades to a static poster for reduced motion / low-power devices / unavailable WebGL.
- Keyboard shortcuts: `Cmd/Ctrl + K` opens the command palette; Escape closes it.
- Motion respects `prefers-reduced-motion`; translucent navigation respects `prefers-reduced-transparency`; high contrast has stronger borders.
- Status uses icon + text + color; interactive controls have visible focus rings.
- The kanban prototype includes keyboard-accessible status selectors as an alternative to dragging.

## Prototype boundaries

Authentication is a simple demo login backed by the current API; it is not session/JWT based. File uploads, email invitations, notifications, exports, live collaboration, persistent drafts, and a database-backed student directory need additional API/storage work. Project deadlines and milestones are shown in the UI, but the current database/API schema does not persist those fields.
