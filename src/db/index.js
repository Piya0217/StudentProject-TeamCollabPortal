/**
 * PostgreSQL connection pool.
 * All configuration comes from environment variables so this file can be
 * dropped in unchanged when we switch from the local dev database to the
 * database teammate's instance.
 */
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'collabportal_dev',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD ?? ''),
  // Keep idle connections alive; tune when moving to production.
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err.message);
});

/**
 * Thin wrapper so routes don't import `pool` directly.
 * Swap this out (e.g., for a transaction-aware client) without touching routes.
 */
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
