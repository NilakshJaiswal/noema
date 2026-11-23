import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { contentLimit } from '../content/contentSchema.js';
import { publishContent, readContent } from '../content/contentStore.js';
import { validateContent } from '../content/validateContent.js';

export const publicContentRoutes = Router();
export const adminRoutes = Router();

const respond = (res, status, message) => res.status(status).json({ message });
const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';
const salt = randomBytes(16);
const passwordHash = email && password.length >= 12 ? scryptSync(password, salt, 64) : null;
const sessions = new Map();
const sessionLifetime = 8 * 60 * 60 * 1000;
const hashToken = (token) => createHash('sha256').update(token).digest('hex');

const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: 'Too many sign-in attempts. Try again in 15 minutes.' },
});

function requireAdmin(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = /^Bearer ([A-Za-z0-9_-]{43})$/.exec(authorization);
  if (match) {
    const key = hashToken(match[1]);
    const expiresAt = sessions.get(key);
    if (expiresAt > Date.now()) {
      req.adminSession = key;
      return next();
    }
    sessions.delete(key);
  }
  return respond(res, 401, 'Sign in to manage website content.');
}

function noCache(_req, res, next) {
  res.set('Cache-Control', 'no-store');
  next();
}

async function getContent(_req, res, next) {
  try {
    res.json(await readContent());
  } catch (error) {
    next(error);
  }
}

publicContentRoutes.get('/', noCache, getContent);

adminRoutes.use(noCache);
adminRoutes.post('/login', loginLimit, express.json({ limit: '4kb' }), (req, res) => {
  if (!passwordHash) return respond(res, 503, 'Admin sign-in requires ADMIN_EMAIL and ADMIN_PASSWORD in the server environment.');
  const { email: loginEmail, password: loginPassword } = req.body || {};
  if (typeof loginEmail !== 'string' || typeof loginPassword !== 'string' || loginPassword.length > 1024) {
    return respond(res, 400, 'Enter your email and password.');
  }
  const matches = timingSafeEqual(scryptSync(loginPassword, salt, 64), passwordHash);
  if (!matches || loginEmail.trim().toLowerCase() !== email) {
    return respond(res, 401, 'Email or password is incorrect.');
  }

  const now = Date.now();
  for (const [key, expiry] of sessions) {
    if (expiry <= now) sessions.delete(key);
  }
  const token = randomBytes(32).toString('base64url');
  sessions.set(hashToken(token), now + sessionLifetime);
  res.json({ token });
});

adminRoutes.use(requireAdmin);
adminRoutes.post('/logout', (req, res) => {
  sessions.delete(req.adminSession);
  res.status(204).end();
});
adminRoutes.get('/content', getContent);
adminRoutes.put('/content', express.json({ limit: contentLimit }), async (req, res, next) => {
  if (!Number.isSafeInteger(req.body?.revision) || req.body.revision < 0) {
    return respond(res, 400, 'A valid content revision is required.');
  }

  let content;
  try {
    content = validateContent(req.body.content);
  } catch (error) {
    return respond(res, 422, error.message);
  }

  try {
    const published = await publishContent(content, req.body.revision);
    if (!published) return respond(res, 409, 'Someone published a newer version. Reload published content before trying again.');
    res.json(published);
  } catch (error) {
    next(error);
  }
});

