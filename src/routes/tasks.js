/**
 * Task routes
 * -----------
 * PATCH /api/tasks/:id — update task fields (most commonly: status)
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

/**
 * PATCH /api/tasks/:id
 * Body (all fields optional):
 *   { title, description, assignee_id, deadline, priority, status }
 *
 * Only the provided fields are updated (partial update).
 * status must be one of: 'todo' | 'in_progress' | 'done'
 */
router.patch('/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  if (isNaN(taskId)) return res.status(400).json({ error: 'Invalid task id.' });

  const allowedFields = {
    title:       'text',
    description: 'text',
    assignee_id: 'int',
    deadline:    'date',
    priority:    'enum:low,medium,high',
    status:      'enum:todo,in_progress,done',
  };

  const updates = [];
  const values  = [];

  for (const [field, kind] of Object.entries(allowedFields)) {
    if (!(field in req.body)) continue;

    let value = req.body[field];

    if (kind.startsWith('enum:')) {
      const allowed = kind.replace('enum:', '').split(',');
      if (!allowed.includes(value)) {
        return res.status(400).json({
          error: `Invalid value for ${field}. Allowed: ${allowed.join(', ')}.`,
        });
      }
    }

    if (kind === 'int') {
      value = value === null ? null : parseInt(value, 10);
      if (value !== null && isNaN(value)) {
        return res.status(400).json({ error: `${field} must be an integer.` });
      }
    }

    values.push(value);
    updates.push(`${field} = $${values.length}`);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update.' });
  }

  values.push(taskId);
  const sql = `
    UPDATE tasks
       SET ${updates.join(', ')}
     WHERE id = $${values.length}
    RETURNING *`;

  try {
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    return res.json({ task: result.rows[0] });
  } catch (err) {
    console.error('[PATCH /tasks/:id]', err.message);
    return res.status(500).json({ error: 'Failed to update task.' });
  }
});

module.exports = router;
