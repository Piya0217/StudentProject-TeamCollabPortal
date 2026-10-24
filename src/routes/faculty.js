/**
 * Faculty routes
 * --------------
 * GET /api/faculty/projects
 *   Returns all projects with task progress stats and the latest review
 *   for each project. Intended for the faculty dashboard.
 *
 * Query param: facultyId (optional) — if supplied, filters reviews to only
 *              those written by that faculty member.
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

/**
 * GET /api/faculty/projects
 * Returns: [
 *   {
 *     id, title, description, owner_id, owner_name, status, created_at,
 *     total_tasks, done_tasks, in_progress_tasks, todo_tasks,
 *     latest_review: { id, faculty_id, faculty_name, comment, review_status, created_at } | null
 *   }
 * ]
 */
router.get('/projects', async (req, res) => {
  try {
    // 1. All projects with owner name
    const projectsResult = await query(`
      SELECT p.id, p.title, p.description, p.owner_id, p.status, p.created_at,
             u.name AS owner_name
        FROM projects p
        JOIN users u ON u.id = p.owner_id
    ORDER BY p.created_at DESC
    `);

    if (projectsResult.rows.length === 0) {
      return res.json({ projects: [] });
    }

    const projectIds = projectsResult.rows.map(p => p.id);

    // 2. Task counts grouped by project
    const taskStats = await query(`
      SELECT project_id,
             COUNT(*) FILTER (WHERE status = 'done')        AS done_tasks,
             COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_tasks,
             COUNT(*) FILTER (WHERE status = 'todo')        AS todo_tasks,
             COUNT(*)                                        AS total_tasks
        FROM tasks
       WHERE project_id = ANY($1)
    GROUP BY project_id
    `, [projectIds]);

    const statsMap = {};
    for (const row of taskStats.rows) {
      statsMap[row.project_id] = {
        total_tasks:        parseInt(row.total_tasks, 10),
        done_tasks:         parseInt(row.done_tasks, 10),
        in_progress_tasks:  parseInt(row.in_progress_tasks, 10),
        todo_tasks:         parseInt(row.todo_tasks, 10),
      };
    }

    // 3. Latest review per project (with faculty name)
    const reviewsResult = await query(`
      SELECT DISTINCT ON (r.project_id)
             r.id, r.project_id, r.faculty_id, r.comment, r.review_status, r.created_at,
             u.name AS faculty_name
        FROM reviews r
        JOIN users u ON u.id = r.faculty_id
       WHERE r.project_id = ANY($1)
    ORDER BY r.project_id, r.created_at DESC
    `, [projectIds]);

    const reviewMap = {};
    for (const row of reviewsResult.rows) {
      reviewMap[row.project_id] = row;
    }

    // 4. Assemble response
    const projects = projectsResult.rows.map(p => ({
      ...p,
      ...(statsMap[p.id] || {
        total_tasks: 0, done_tasks: 0, in_progress_tasks: 0, todo_tasks: 0
      }),
      latest_review: reviewMap[p.id] || null,
    }));

    return res.json({ projects });
  } catch (err) {
    console.error('[GET /faculty/projects]', err.message);
    return res.status(500).json({ error: 'Failed to fetch faculty dashboard data.' });
  }
});

module.exports = router;
