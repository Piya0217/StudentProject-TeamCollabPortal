/**
 * Database/API Contract — Proposed schema agreed for integration
 * ---------------------------------------------------------------
 * This file is NOT executed at runtime. It exists purely as a reference
 * for the database teammate and the frontend team.
 *
 * TABLE: users
 *   id          SERIAL PRIMARY KEY
 *   name        VARCHAR(255) NOT NULL
 *   email       VARCHAR(255) UNIQUE NOT NULL
 *   password    VARCHAR(255) NOT NULL          -- bcrypt hash (prototype: plain-text seed)
 *   role        VARCHAR(20) NOT NULL CHECK (role IN ('student','faculty'))
 *   skills      TEXT[]                         -- array of skill strings, may be NULL
 *   created_at  TIMESTAMPTZ DEFAULT NOW()
 *
 * TABLE: projects
 *   id           SERIAL PRIMARY KEY
 *   title        VARCHAR(255) NOT NULL
 *   description  TEXT
 *   owner_id     INT REFERENCES users(id) ON DELETE SET NULL
 *   status       VARCHAR(30) DEFAULT 'active'  -- 'active' | 'completed' | 'archived'
 *   created_at   TIMESTAMPTZ DEFAULT NOW()
 *
 * TABLE: project_members
 *   project_id   INT REFERENCES projects(id) ON DELETE CASCADE
 *   user_id      INT REFERENCES users(id) ON DELETE CASCADE
 *   team_role    VARCHAR(100)                  -- e.g. 'lead', 'developer', 'designer'
 *   PRIMARY KEY (project_id, user_id)
 *
 * TABLE: tasks
 *   id           SERIAL PRIMARY KEY
 *   project_id   INT REFERENCES projects(id) ON DELETE CASCADE
 *   title        VARCHAR(255) NOT NULL
 *   description  TEXT
 *   assignee_id  INT REFERENCES users(id) ON DELETE SET NULL
 *   deadline     DATE
 *   priority     VARCHAR(20) DEFAULT 'medium'  -- 'low' | 'medium' | 'high'
 *   status       VARCHAR(30) DEFAULT 'todo'    -- 'todo' | 'in_progress' | 'done'
 *   created_at   TIMESTAMPTZ DEFAULT NOW()
 *
 * TABLE: reviews
 *   id             SERIAL PRIMARY KEY
 *   project_id     INT REFERENCES projects(id) ON DELETE CASCADE
 *   faculty_id     INT REFERENCES users(id) ON DELETE SET NULL
 *   comment        TEXT
 *   review_status  VARCHAR(30) DEFAULT 'pending'  -- 'pending' | 'approved' | 'needs_revision'
 *   created_at     TIMESTAMPTZ DEFAULT NOW()
 *
 * ---------------------------------------------------------------
 * INTEGRATION NOTES
 * - If the database teammate uses different column names or types, update
 *   the SQL in src/routes/*.js to match; no other files need changing.
 * - The `skills` column is TEXT[] in PostgreSQL; the API accepts / returns
 *   a JSON array of strings.
 * - `password` is stored as plain text in seed data ONLY. Real integration
 *   must use bcrypt hashes.
 * ---------------------------------------------------------------
 */

// This module exports nothing. Import it only to verify the contract is loaded.
module.exports = {};
