/**
 * Express application setup.
 * Kept separate from server.js so the app can be imported in tests
 * without binding to a port.
 */
const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes    = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes    = require('./routes/tasks');
const facultyRoutes = require('./routes/faculty');
const userRoutes    = require('./routes/users');

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// CORS — allow the React dev server (Vite default: 5173, CRA default: 3000)
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or same-origin requests (no Origin header)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed.`));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api/auth',     authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks',    taskRoutes);
app.use('/api/faculty',  facultyRoutes);
app.use('/api/users',    userRoutes);

// ---------------------------------------------------------------------------
// 404 catch-all
// ---------------------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[unhandled error]', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

module.exports = app;
