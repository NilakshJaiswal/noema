import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDB, dbReady } from './config/db.js';
import contactRoutes from './routes/contactRoutes.js';
import { adminRoutes, publicContentRoutes } from './routes/contentRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Behind a proxy (Nginx/hosting) so express-rate-limit & req.ip work correctly.
app.set('trust proxy', 1);

// ── Security & parsing ──────────────────────────────────
app.use(helmet());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── CORS ────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Allow same-origin / server-to-server (no Origin header) and whitelisted origins.
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT'],
  })
);

// ── Health check ────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', db: dbReady() ? 'connected' : 'disconnected', time: new Date().toISOString() });
});

// ── Routes ──────────────────────────────────────────────
app.use('/api/content', publicContentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', express.json({ limit: '100kb' }), express.urlencoded({ extended: true, limit: '100kb' }), contactRoutes);

// ── 404 + error handlers ────────────────────────────────
app.use('/api', (_req, res) => res.status(404).json({ success: false, message: 'Not found' }));

app.use((err, _req, res, _next) => {
  if (err?.message?.includes('CORS')) {
    return res.status(403).json({ success: false, message: 'Request blocked by CORS policy.' });
  }
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ message: 'This request is too large. Use smaller images or image URLs.' });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'The request contains invalid JSON.' });
  }
  console.error('[error]', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Boot ────────────────────────────────────────────────
connectDB(process.env.MONGODB_URI).finally(() => {
  app.listen(PORT, () => {
    console.log(`[server] Noema API listening on http://localhost:${PORT}`);
    console.log(`[server] Allowed origins: ${allowedOrigins.join(', ')}`);
  });
});
