import { validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import { dbReady } from '../config/db.js';
import { sendContactNotification } from '../utils/mailer.js';

/**
 * POST /api/contact
 * Persists a contact / join enquiry and (optionally) emails a notification.
 */
export async function createContact(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Please correct the highlighted fields.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  const { name, email, mobile = '', message, kind = 'contact' } = req.body;

  const payload = {
    name,
    email,
    mobile,
    message,
    kind: kind === 'join' ? 'join' : 'contact',
    meta: {
      ip: req.ip,
      userAgent: req.get('user-agent') || '',
      source: 'website',
    },
  };

  try {
    let saved = null;

    if (dbReady()) {
      saved = await Contact.create(payload);
    } else {
      // No DB available — build an in-memory doc so email/notification still works.
      saved = { ...payload, createdAt: new Date() };
      console.warn('[contact] DB not connected — submission not persisted:', email);
    }

    // Fire-and-forget email; never block the user response on mail failures.
    sendContactNotification(saved).catch((err) =>
      console.error('[contact] mail error:', err.message)
    );

    return res.status(201).json({
      success: true,
      message:
        payload.kind === 'join'
          ? "Thank you! We've received your details and will be in touch soon."
          : "Thank you for reaching out — we'll get back to you shortly.",
    });
  } catch (err) {
    console.error('[contact] create error:', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong on our end. Please try again in a moment.',
    });
  }
}
