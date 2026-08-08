const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
app.use(express.json());

// Allowed origins: local dev and Vercel production domain
const allowedOrigins = [process.env.NEXT_PUBLIC_API_URL, process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server and same-origin
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('CORS blocked: ' + origin));
  }
}));

// Basic health endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// Example protected route (reads JWT_SECRET from env)
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', now: Date.now() });
});

module.exports.handler = serverless(app);
