import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { createContact } from '../controllers/contactController.js';

const router = Router();

// Throttle submissions to deter spam/abuse: 6 per 10 minutes per IP.
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many submissions from this device. Please try again later.',
  },
});

const validators = [
  body('name').trim().notEmpty().withMessage('Please enter your name.').isLength({ max: 120 }),
  body('email').trim().isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
  body('mobile')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[0-9+\-\s()]{6,20}$/)
    .withMessage('Please enter a valid phone number.'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Please add a short message.')
    .isLength({ max: 4000 })
    .withMessage('Message is too long.'),
  body('kind').optional().isIn(['contact', 'join']),
  // Honeypot: real users leave this empty; bots fill it.
  body('company').optional().isEmpty().withMessage('Spam detected.'),
];

router.post('/', contactLimiter, validators, createContact);

export default router;
