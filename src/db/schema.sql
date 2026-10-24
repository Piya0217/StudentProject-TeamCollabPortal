-- =============================================================
-- Schema for Student Project & Team Collaboration Portal
-- Local dev / prototype only.
-- Run once against your local PostgreSQL instance:
--   psql -U postgres -d collabportal_dev -f src/db/schema.sql
-- =============================================================

-- Drop tables in dependency order (safe for re-runs)
DROP TABLE IF EXISTS reviews       CASCADE;
DROP TABLE IF EXISTS tasks         CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects      CASCADE;
DROP TABLE IF EXISTS users         CASCADE;

-- -------------------------
-- users
-- -------------------------
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(20)  NOT NULL CHECK (role IN ('student', 'faculty')),
  skills     TEXT[],
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- -------------------------
-- projects
-- -------------------------
CREATE TABLE projects (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id    INT  REFERENCES users(id) ON DELETE SET NULL,
  status      VARCHAR(30)  DEFAULT 'active'
                           CHECK (status IN ('active', 'completed', 'archived')),
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- -------------------------
-- project_members
-- -------------------------
CREATE TABLE project_members (
  project_id INT REFERENCES projects(id) ON DELETE CASCADE,
  user_id    INT REFERENCES users(id)    ON DELETE CASCADE,
  team_role  VARCHAR(100),
  PRIMARY KEY (project_id, user_id)
);

-- -------------------------
-- tasks
-- -------------------------
CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  project_id  INT  REFERENCES projects(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id INT  REFERENCES users(id) ON DELETE SET NULL,
  deadline    DATE,
  priority    VARCHAR(20)  DEFAULT 'medium'
                           CHECK (priority IN ('low', 'medium', 'high')),
  status      VARCHAR(30)  DEFAULT 'todo'
                           CHECK (status IN ('todo', 'in_progress', 'done')),
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- -------------------------
-- reviews
-- -------------------------
CREATE TABLE reviews (
  id             SERIAL PRIMARY KEY,
  project_id     INT  REFERENCES projects(id) ON DELETE CASCADE,
  faculty_id     INT  REFERENCES users(id)    ON DELETE SET NULL,
  comment        TEXT,
  review_status  VARCHAR(30)  DEFAULT 'pending'
                              CHECK (review_status IN ('pending', 'approved', 'needs_revision')),
  created_at     TIMESTAMPTZ  DEFAULT NOW()
);
