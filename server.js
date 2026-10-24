/**
 * Server entry point.
 * Starts the Express server and verifies the database connection.
 */
require('dotenv').config();
const app  = require('./src/app');
const { pool } = require('./src/db');

const PORT = parseInt(process.env.PORT || '4000', 10);

async function start() {
  // Verify DB connectivity before accepting traffic
  try {
    await pool.query('SELECT 1');
    console.log('[db] PostgreSQL connected successfully.');
  } catch (err) {
    console.error('[db] Cannot connect to PostgreSQL:', err.message);
    console.error('     Check your .env file and ensure the database is running.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   Environment:  ${process.env.NODE_ENV || 'development'}\n`);
  });
}

start();
