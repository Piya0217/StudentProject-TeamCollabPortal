-- =============================================================
-- Seed data for student_project_portal — LOCAL DEV ONLY
-- Adapted for the actual DB schema (password_hash, on_hold, etc.)
-- Run via psql or pgAdmin query tool:
--   psql -U postgres -d student_project_portal -f src/db/seed_compat.sql
--
-- WARNING: password_hash values are plain text here for prototype convenience.
--          Do NOT use in production. Real integration must use bcrypt.
-- =============================================================

-- Users (2 students, 1 faculty)
INSERT INTO users (name, email, password_hash, role, skills, interests, designation, experience_years) VALUES
  ('Alice Johnson',  'alice@example.com',  'password123', 'student', ARRAY['React','Node.js','PostgreSQL'], ARRAY['AI','Web Dev'], 'Student', 0),
  ('Bob Smith',      'bob@example.com',    'password123', 'student', ARRAY['Python','Machine Learning'],    ARRAY['ML','Data Science'], 'Student', 0),
  ('Dr. Carol Ray',  'carol@example.com',  'password123', 'faculty', ARRAY['Software Engineering','Agile'], ARRAY['EdTech','Agile'], 'Assistant Professor', 5)
ON CONFLICT (email) DO NOTHING;

-- Projects (progress_percent NOT NULL, on_hold replaces archived)
INSERT INTO projects (title, description, owner_id, faculty_id, status, progress_percent) VALUES
  ('AI Study Buddy',       'An AI-powered study assistant for students.', 1, 3, 'active', 40),
  ('Campus Event Tracker', 'Web app to discover and manage campus events.', 2, 3, 'active', 20)
ON CONFLICT DO NOTHING;

-- Project members (joined_at has DEFAULT now())
INSERT INTO project_members (project_id, user_id, team_role) VALUES
  (1, 1, 'lead'),
  (1, 2, 'developer'),
  (2, 2, 'lead'),
  (2, 1, 'developer')
ON CONFLICT (project_id, user_id) DO NOTHING;

-- Tasks for project 1
INSERT INTO tasks (project_id, title, description, assignee_id, deadline, priority, status) VALUES
  (1, 'Set up Express API',        'Bootstrap the backend server.',        1, '2026-11-01', 'high',   'done'),
  (1, 'Design database schema',    'Model users, projects, tasks.',        1, '2026-11-03', 'high',   'in_progress'),
  (1, 'Build quiz module',         'AI quiz generation from study notes.', 2, '2026-11-10', 'medium', 'todo');

-- Tasks for project 2
INSERT INTO tasks (project_id, title, description, assignee_id, deadline, priority, status) VALUES
  (2, 'Create event model',   'CRUD for campus events.',       2, '2026-11-05', 'high',   'in_progress'),
  (2, 'Build React frontend', 'Event listing & detail pages.', 1, '2026-11-15', 'medium', 'todo');

-- Reviews (review_status: 'reviewed' | 'needs_changes' | 'approved')
INSERT INTO reviews (project_id, faculty_id, comment, review_status) VALUES
  (1, 3, 'Good start! Please add more detail to the API documentation.', 'needs_changes'),
  (2, 3, 'Excellent progress. Approved for demo.',                        'approved');
