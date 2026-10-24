/**
 * Auth routes
 * -----------
 * POST /api/auth/login
 *
 * PROTOTYPE LIMITATIONS:
 *  - No JWT / session; the client receives the full user row and must store
 *    it locally. A real implementation would use JWT + httpOnly cookies.
 *  - Password is compared as plain text against the seed data.
 *    Replace with bcrypt.compare() before any real deployment.
 *  - There is no registration endpoint; users are seeded via seed.sql.
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

/**
 * POST /api/auth/login
 * Body: { email: string, password: string }
 * Returns: { user: { id, name, email, role, skills } }
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required.' });
  }

  try {
    const result = await query(
      `SELECT id, name, email, role, skills, interests, designation, experience_years, password_hash
         FROM users
        WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Prototype: plain-text comparison. Swap for bcrypt in production.
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Never send the password back to the client.
    const { password_hash: _pw, ...safeUser } = user;

    return res.json({
      message: 'Login successful.',
      user: safeUser,
      // Prototype note: store this object client-side and pass user.id in
      // subsequent requests as the query param `userId` or request body field.
    });
  } catch (err) {
    console.error('[auth/login]', err.message);
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

module.exports = router;
