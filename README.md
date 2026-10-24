# Student Project & Team Collaboration Portal — Backend

A Node.js/Express REST API prototype for managing student projects, teams, tasks, and faculty reviews.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Database / API Contract](#database--api-contract)
6. [API Reference](#api-reference)
7. [Demo Flow](#demo-flow)
8. [Integration Steps](#integration-steps)
9. [Known Limitations](#known-limitations)

---

## Quick Start

```bash
# 1. Clone / enter the repo
cd StudentProject-TeamCollabPortal

# 2. Install dependencies
npm install

# 3. Copy and fill in environment variables
copy .env.example .env
# Edit .env with your local PostgreSQL credentials

# 4. Create the database (one-time)
createdb -U postgres collabportal_dev

# 5. Apply schema
psql -U postgres -d collabportal_dev -f src/db/schema.sql

# 6. Load seed data (optional — required for demo login)
psql -U postgres -d collabportal_dev -f src/db/seed.sql

# 7. Start the server
npm run dev           # development (nodemon auto-reload)
npm start             # production
```

Server runs on **http://localhost:4000** by default.  
Health check: `GET http://localhost:4000/api/health`

---

## Project Structure

```
StudentProject-TeamCollabPortal/
├── server.js              # Entry point — starts Express, checks DB
├── src/
│   ├── app.js             # Express app (middleware + routes)
│   ├── db/
│   │   ├── index.js       # pg Pool — all config from env vars
│   │   ├── schema.sql     # CREATE TABLE DDL (run once)
│   │   ├── seed.sql       # Demo seed data (local dev only)
│   │   └── schema-contract.js  # Non-executable reference: table/column names
│   └── routes/
│       ├── auth.js        # POST /api/auth/login
│       ├── projects.js    # Project, member, task, review routes
│       ├── tasks.js       # PATCH /api/tasks/:id
│       └── faculty.js     # GET  /api/faculty/projects
├── .env.example           # Template — copy to .env
├── .gitignore
└── package.json
```

---

## Environment Variables

| Variable      | Default                                    | Description                            |
|---------------|--------------------------------------------|----------------------------------------|
| `PORT`        | `4000`                                     | HTTP port                              |
| `NODE_ENV`    | `development`                              | Environment name                       |
| `DB_HOST`     | `localhost`                                | PostgreSQL host                        |
| `DB_PORT`     | `5432`                                     | PostgreSQL port                        |
| `DB_NAME`     | `collabportal_dev`                         | Database name                          |
| `DB_USER`     | `postgres`                                 | Database user                          |
| `DB_PASSWORD` | *(empty)*                                  | Database password                      |
| `CORS_ORIGIN` | `http://localhost:5173,http://localhost:3000` | Comma-separated allowed origins      |

---

## Database Setup

### Switching to the database teammate's instance

Only three things need to change — all in `.env`:
```
DB_HOST=<their host>
DB_NAME=<their database name>
DB_USER=<their user>
DB_PASSWORD=<their password>
```

No source code changes are required unless their schema uses **different column or table names** (see contract below).

---

## Database / API Contract

This is the **proposed contract** shared with the database teammate.  
Source of truth: [`src/db/schema-contract.js`](src/db/schema-contract.js) and [`src/db/schema.sql`](src/db/schema.sql).

### Tables

#### `users`
| Column      | Type           | Notes                            |
|-------------|----------------|----------------------------------|
| `id`        | SERIAL PK      |                                  |
| `name`      | VARCHAR(255)   | NOT NULL                         |
| `email`     | VARCHAR(255)   | UNIQUE NOT NULL                  |
| `password`  | VARCHAR(255)   | bcrypt hash (plain text in seed) |
| `role`      | VARCHAR(20)    | `'student'` or `'faculty'`       |
| `skills`    | TEXT[]         | Array of skill strings           |
| `created_at`| TIMESTAMPTZ    | DEFAULT NOW()                    |

#### `projects`
| Column        | Type         | Notes                                      |
|---------------|--------------|--------------------------------------------|
| `id`          | SERIAL PK    |                                            |
| `title`       | VARCHAR(255) | NOT NULL                                   |
| `description` | TEXT         |                                            |
| `owner_id`    | INT FK→users |                                            |
| `status`      | VARCHAR(30)  | `'active'` \| `'completed'` \| `'archived'` |
| `created_at`  | TIMESTAMPTZ  | DEFAULT NOW()                              |

#### `project_members`
| Column      | Type             | Notes                |
|-------------|------------------|----------------------|
| `project_id`| INT FK→projects  | PK (composite)       |
| `user_id`   | INT FK→users     | PK (composite)       |
| `team_role` | VARCHAR(100)     | e.g. `'lead'`, `'developer'` |

#### `tasks`
| Column        | Type          | Notes                                        |
|---------------|---------------|----------------------------------------------|
| `id`          | SERIAL PK     |                                              |
| `project_id`  | INT FK→projects |                                            |
| `title`       | VARCHAR(255)  | NOT NULL                                     |
| `description` | TEXT          |                                              |
| `assignee_id` | INT FK→users  | nullable                                     |
| `deadline`    | DATE          |                                              |
| `priority`    | VARCHAR(20)   | `'low'` \| `'medium'` \| `'high'`            |
| `status`      | VARCHAR(30)   | `'todo'` \| `'in_progress'` \| `'done'`      |
| `created_at`  | TIMESTAMPTZ   | DEFAULT NOW()                                |

#### `reviews`
| Column          | Type          | Notes                                              |
|-----------------|---------------|----------------------------------------------------|
| `id`            | SERIAL PK     |                                                    |
| `project_id`    | INT FK→projects |                                                  |
| `faculty_id`    | INT FK→users  | must have `role = 'faculty'`                       |
| `comment`       | TEXT          |                                                    |
| `review_status` | VARCHAR(30)   | `'pending'` \| `'approved'` \| `'needs_revision'`  |
| `created_at`    | TIMESTAMPTZ   | DEFAULT NOW()                                      |

### Assumptions / Differences to Reconcile

- `users.password` is plain text in seed data. Production must use bcrypt.
- `users.skills` is `TEXT[]` (PostgreSQL array). If the DB teammate uses a separate `user_skills` table, the auth route's SELECT needs updating.
- `projects.status` defaults to `'active'`. If the teammate uses different values, update the CHECK constraint and validation in `routes/projects.js`.

---

## API Reference

All endpoints accept and return **JSON**. Base URL: `http://localhost:4000`

---

### Auth

#### `POST /api/auth/login`

Log in a user.

**Request body**
```json
{ "email": "alice@example.com", "password": "password123" }
```

**Response 200**
```json
{
  "message": "Login successful.",
  "user": { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "student", "skills": ["React","Node.js","PostgreSQL"] }
}
```

**Errors:** `400` missing fields · `401` wrong credentials · `500` server error

---

### Projects

#### `GET /api/projects`

List all projects (or filter by user).

| Query param | Type | Description                                |
|-------------|------|--------------------------------------------|
| `userId`    | int  | Optional. Returns only projects the user owns or is a member of. |

**Response 200**
```json
{ "projects": [ { "id": 1, "title": "AI Study Buddy", "owner_name": "Alice Johnson", ... } ] }
```

---

#### `POST /api/projects`

Create a project.

**Request body**
```json
{ "title": "My New Project", "description": "What it does", "owner_id": 1, "status": "active" }
```

**Response 201**
```json
{ "project": { "id": 3, "title": "My New Project", ... } }
```

**Errors:** `400` validation · `500` server error

---

#### `GET /api/projects/:id`

Get project details + members.

**Response 200**
```json
{
  "project": { "id": 1, "title": "AI Study Buddy", "owner_name": "Alice Johnson", ... },
  "members": [ { "id": 1, "name": "Alice Johnson", "team_role": "lead", ... } ]
}
```

---

#### `POST /api/projects/:id/members`

Add a team member.

**Request body**
```json
{ "user_id": 2, "team_role": "developer" }
```

**Response 201**
```json
{ "message": "Member added.", "member": { "id": 2, "name": "Bob Smith", "team_role": "developer" } }
```

---

#### `GET /api/projects/:id/tasks`

List tasks for a project.

**Response 200**
```json
{ "tasks": [ { "id": 1, "title": "Set up Express API", "status": "done", "assignee_name": "Alice Johnson", ... } ] }
```

---

#### `POST /api/projects/:id/tasks`

Create a task.

**Request body**
```json
{
  "title": "Write unit tests",
  "description": "Cover auth and project routes",
  "assignee_id": 2,
  "deadline": "2026-11-20",
  "priority": "high",
  "status": "todo"
}
```

**Response 201**
```json
{ "task": { "id": 6, "title": "Write unit tests", ... } }
```

---

### Tasks

#### `PATCH /api/tasks/:id`

Update any subset of task fields. All fields optional.

**Request body** (example — update status only)
```json
{ "status": "in_progress" }
```

**Valid values**
- `status`: `todo` | `in_progress` | `done`
- `priority`: `low` | `medium` | `high`

**Response 200**
```json
{ "task": { "id": 1, "status": "in_progress", ... } }
```

---

### Reviews

#### `POST /api/projects/:id/reviews`

Submit a faculty review.

**Request body**
```json
{ "faculty_id": 3, "comment": "Good progress! Clean up the error handling.", "review_status": "needs_revision" }
```

**Response 201**
```json
{ "review": { "id": 3, "project_id": 1, "review_status": "needs_revision", ... } }
```

---

### Faculty Dashboard

#### `GET /api/faculty/projects`

List all projects with task progress stats and the latest review for each.

**Response 200**
```json
{
  "projects": [
    {
      "id": 1,
      "title": "AI Study Buddy",
      "owner_name": "Alice Johnson",
      "status": "active",
      "total_tasks": 3,
      "done_tasks": 1,
      "in_progress_tasks": 1,
      "todo_tasks": 1,
      "latest_review": {
        "id": 1,
        "faculty_name": "Dr. Carol Ray",
        "comment": "Good start! Please add more detail to the API documentation.",
        "review_status": "needs_revision",
        "created_at": "2026-10-24T05:00:00.000Z"
      }
    }
  ]
}
```

---

## Demo Flow

Follow these steps using any HTTP client (curl, Postman, Thunder Client):

```
1. Login
   POST /api/auth/login  { "email": "alice@example.com", "password": "password123" }
   → Save returned user.id (e.g. 1)

2. Create a project
   POST /api/projects  { "title": "Demo Project", "owner_id": 1 }
   → Save returned project.id (e.g. 3)

3. Add a teammate
   POST /api/projects/3/members  { "user_id": 2, "team_role": "developer" }

4. Create a task
   POST /api/projects/3/tasks  { "title": "Build login page", "assignee_id": 2, "priority": "high" }
   → Save returned task.id (e.g. 6)

5. Update task status
   PATCH /api/tasks/6  { "status": "in_progress" }

6. Faculty review
   POST /api/projects/3/reviews  { "faculty_id": 3, "comment": "Looking good!", "review_status": "approved" }

7. Faculty dashboard
   GET /api/faculty/projects
```

**Seeded demo users:**

| Email                | Password      | Role    |
|----------------------|---------------|---------|
| alice@example.com    | password123   | student |
| bob@example.com      | password123   | student |
| carol@example.com    | password123   | faculty |

---

## Integration Steps

When the database teammate's PostgreSQL instance is ready:

1. Update `.env` with their `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
2. Compare their `CREATE TABLE` statements against [`src/db/schema.sql`](src/db/schema.sql). Update any column or table name differences **only in the SQL strings inside `src/routes/*.js`**.
3. Remove or skip `src/db/seed.sql` — use their seeded data instead.
4. If they add password hashing, update the comparison in [`src/routes/auth.js`](src/routes/auth.js) to use `bcrypt.compare()`.
5. Verify each API endpoint against the frontend team's integration tests.

---

## Known Limitations

| # | Limitation | Planned Fix |
|---|------------|-------------|
| 1 | **No authentication middleware** — routes don't verify that the requesting user is who they say they are. The `userId` / `faculty_id` in requests is trusted. | Add JWT middleware and extract user identity from the token. |
| 2 | **Plain-text passwords** in seed data | Use `bcrypt.hash()` in seed and `bcrypt.compare()` in login. |
| 3 | **No registration endpoint** — users must be added via SQL seed. | Add `POST /api/auth/register`. |
| 4 | **No pagination** — all list endpoints return every row. | Add `LIMIT` / `OFFSET` query params. |
| 5 | **No file uploads** — project documents and attachments not supported. | Add `multer` and a `/api/projects/:id/attachments` route. |
| 6 | **CORS origin list is static** — loaded at startup from `.env`. | Fine for prototype; use a database-backed allowlist for production. |
| 7 | **Local dev DB only** — schema and seed are for local development and must not be applied to the database teammate's instance without coordination. | Coordinate via the schema contract above. |
