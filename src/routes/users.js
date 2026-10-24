const express = require('express');
const router = express.Router();
const { query } = require('../db');

const editableFields = new Set(['name', 'skills', 'interests', 'designation', 'experience_years']);

// Update the profile fields that the signed-in user is allowed to edit.
// Authentication/authorization is demo-level in this prototype; production
// should derive the user id from a verified session rather than the URL.
router.patch('/:id/profile', async (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ error: 'A valid user id is required.' });
  }

  const entries = Object.entries(req.body || {}).filter(([key]) => editableFields.has(key));
  if (entries.length === 0) {
    return res.status(400).json({ error: 'Provide at least one editable profile field.' });
  }

  const updates = {};
  for (const [key, value] of entries) {
    if (key === 'name') {
      if (typeof value !== 'string' || !value.trim()) return res.status(400).json({ error: 'Name cannot be empty.' });
      updates[key] = value.trim();
    } else if (key === 'skills' || key === 'interests') {
      if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
        return res.status(400).json({ error: `${key} must be an array of strings.` });
      }
      updates[key] = [...new Set(value.map(item => item.trim()).filter(Boolean))];
    } else if (key === 'designation') {
      if (value !== null && typeof value !== 'string') return res.status(400).json({ error: 'Designation must be text or null.' });
      updates[key] = typeof value === 'string' ? value.trim() || null : null;
    } else if (key === 'experience_years') {
      if (value !== null && (!Number.isInteger(value) || value < 0)) {
        return res.status(400).json({ error: 'Experience must be a non-negative whole number or null.' });
      }
      updates[key] = value;
    }
  }

  const values = Object.values(updates);
  const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
  values.push(userId);
  try {
    const result = await query(
      `UPDATE users SET ${setClause} WHERE id = $${values.length}
       RETURNING id, name, email, role, skills, interests, designation, experience_years`,
      values
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('[users/profile]', err.message);
    return res.status(500).json({ error: 'Could not save profile.' });
  }
});

module.exports = router;
