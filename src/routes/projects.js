/**
 * Project routes
 * --------------
 * GET  /api/projects              — list all active projects
 * POST /api/projects              — create a project
 * GET  /api/projects/:id          — project detail + members
 * POST /api/projects/:id/members  — add a member to the project
 * GET  /api/projects/:id/tasks    — list tasks for a project
 * POST /api/projects/:id/tasks    — create a task in a project
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// ---------------------------------------------------------------------------
// GET /api/projects
// Query param: userId (optional) — if supplied, lists projects the user is
//              owner of or is a member of; otherwise returns all projects.
// ---------------------------------------------------------------------------
router.get('/', async (req, res) => {
  const { userId } = req.query;

  try {
    let sql, params;

    if (userId) {
      sql = `
        SELECT DISTINCT p.id, p.title, p.description, p.owner_id,
               p.status, p.created_at,
               u.name AS owner_name
          FROM projects p
          JOIN users u ON u.id = p.owner_id
     LEFT JOIN project_members pm ON pm.project_id = p.id
         WHERE p.owner_id = $1
            OR pm.user_id = $1
      ORDER BY p.created_at DESC`;
      params = [userId];
    } else {
      sql = `
        SELECT p.id, p.title, p.description, p.owner_id,
               p.status, p.created_at,
               u.name AS owner_name
          FROM projects p
          JOIN users u ON u.id = p.owner_id
      ORDER BY p.created_at DESC`;
      params = [];
    }

    const result = await query(sql, params);
    return res.json({ projects: result.rows });
  } catch (err) {
    console.error('[GET /projects]', err.message);
    return res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/projects
// Body: { title, description, owner_id, status? }
// ---------------------------------------------------------------------------
router.post('/', async (req, res) => {
  const { title, description, owner_id, status } = req.body;

  if (!title || !owner_id) {
    return res.status(400).json({ error: 'title and owner_id are required.' });
  }

  const allowedStatuses = ['active', 'completed', 'archived'];
  const projectStatus = allowedStatuses.includes(status) ? status : 'active';

  try {
    // Validate that owner exists
    const ownerCheck = await query('SELECT id FROM users WHERE id = $1', [owner_id]);
    if (ownerCheck.rows.length === 0) {
      return res.status(400).json({ error: `No user found with id ${owner_id}.` });
    }

    const result = await query(
      `INSERT INTO projects (title, description, owner_id, status)
            VALUES ($1, $2, $3, $4)
         RETURNING *`,
      [title.trim(), description || null, owner_id, projectStatus]
    );

    const project = result.rows[0];

    // Automatically add the owner as a 'lead' member
    await query(
      `INSERT INTO project_members (project_id, user_id, team_role)
            VALUES ($1, $2, 'lead')
       ON CONFLICT DO NOTHING`,
      [project.id, owner_id]
    );

    return res.status(201).json({ project });
  } catch (err) {
    console.error('[POST /projects]', err.message);
    return res.status(500).json({ error: 'Failed to create project.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/projects/:id
// Returns project row + array of members
// ---------------------------------------------------------------------------
router.get('/:id', async (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  if (isNaN(projectId)) return res.status(400).json({ error: 'Invalid project id.' });

  try {
    const projResult = await query(
      `SELECT p.*, u.name AS owner_name
         FROM projects p
         JOIN users u ON u.id = p.owner_id
        WHERE p.id = $1`,
      [projectId]
    );

    if (projResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const memberResult = await query(
      `SELECT u.id, u.name, u.email, u.role, u.skills, pm.team_role
         FROM project_members pm
         JOIN users u ON u.id = pm.user_id
        WHERE pm.project_id = $1`,
      [projectId]
    );

    return res.json({
      project: projResult.rows[0],
      members: memberResult.rows,
    });
  } catch (err) {
    console.error('[GET /projects/:id]', err.message);
    return res.status(500).json({ error: 'Failed to fetch project.' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/projects/:id/members
// Body: { user_id, team_role? }
// ---------------------------------------------------------------------------
router.post('/:id/members', async (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  if (isNaN(projectId)) return res.status(400).json({ error: 'Invalid project id.' });

  const { user_id, team_role } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id is required.' });

  try {
    // Validate project exists
    const projCheck = await query('SELECT id FROM projects WHERE id = $1', [projectId]);
    if (projCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Validate user exists
    const userCheck = await query('SELECT id, name, email, role FROM users WHERE id = $1', [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: `User ${user_id} not found.` });
    }

    await query(
      `INSERT INTO project_members (project_id, user_id, team_role)
            VALUES ($1, $2, $3)
       ON CONFLICT (project_id, user_id) DO UPDATE
           SET team_role = EXCLUDED.team_role`,
      [projectId, user_id, team_role || 'member']
    );

    return res.status(201).json({
      message: 'Member added.',
      member: { ...userCheck.rows[0], team_role: team_role || 'member' },
    });
  } catch (err) {
    console.error('[POST /projects/:id/members]', err.message);
    return res.status(500).json({ error: 'Failed to add member.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/projects/:id/tasks
// ---------------------------------------------------------------------------
router.get('/:id/tasks', async (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  if (isNaN(projectId)) return res.status(400).json({ error: 'Invalid project id.' });

  try {
    const result = await query(
      `SELECT t.*, u.name AS assignee_name
         FROM tasks t
    LEFT JOIN users u ON u.id = t.assignee_id
        WHERE t.project_id = $1
     ORDER BY t.created_at DESC`,
      [projectId]
    );
    return res.json({ tasks: result.rows });
  } catch (err) {
    console.error('[GET /projects/:id/tasks]', err.message);
    return res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/projects/:id/tasks
// Body: { title, description?, assignee_id?, deadline?, priority?, status? }
// ---------------------------------------------------------------------------
router.post('/:id/tasks', async (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  if (isNaN(projectId)) return res.status(400).json({ error: 'Invalid project id.' });

  const { title, description, assignee_id, deadline, priority, status } = req.body;

  if (!title) return res.status(400).json({ error: 'title is required.' });

  const allowedPriorities = ['low', 'medium', 'high'];
  const allowedStatuses   = ['todo', 'in_progress', 'done'];

  const taskPriority = allowedPriorities.includes(priority) ? priority : 'medium';
  const taskStatus   = allowedStatuses.includes(status)     ? status   : 'todo';

  try {
    // Validate project
    const projCheck = await query('SELECT id FROM projects WHERE id = $1', [projectId]);
    if (projCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const result = await query(
      `INSERT INTO tasks
              (project_id, title, description, assignee_id, deadline, priority, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        projectId,
        title.trim(),
        description || null,
        assignee_id || null,
        deadline    || null,
        taskPriority,
        taskStatus,
      ]
    );

    return res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    console.error('[POST /projects/:id/tasks]', err.message);
    return res.status(500).json({ error: 'Failed to create task.' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/projects/:id/reviews
// Body: { faculty_id, comment, review_status? }
// ---------------------------------------------------------------------------
router.post('/:id/reviews', async (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  if (isNaN(projectId)) return res.status(400).json({ error: 'Invalid project id.' });

  const { faculty_id, comment, review_status } = req.body;

  if (!faculty_id || !comment) {
    return res.status(400).json({ error: 'faculty_id and comment are required.' });
  }

  const allowedStatuses = ['pending', 'approved', 'needs_revision'];
  const rvStatus = allowedStatuses.includes(review_status) ? review_status : 'pending';

  try {
    // Validate faculty user
    const facultyCheck = await query(
      `SELECT id FROM users WHERE id = $1 AND role = 'faculty'`,
      [faculty_id]
    );
    if (facultyCheck.rows.length === 0) {
      return res.status(400).json({ error: `User ${faculty_id} is not a faculty member.` });
    }

    // Validate project
    const projCheck = await query('SELECT id FROM projects WHERE id = $1', [projectId]);
    if (projCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const result = await query(
      `INSERT INTO reviews (project_id, faculty_id, comment, review_status)
            VALUES ($1, $2, $3, $4)
         RETURNING *`,
      [projectId, faculty_id, comment, rvStatus]
    );

    return res.status(201).json({ review: result.rows[0] });
  } catch (err) {
    console.error('[POST /projects/:id/reviews]', err.message);
    return res.status(500).json({ error: 'Failed to submit review.' });
  }
});

module.exports = router;
