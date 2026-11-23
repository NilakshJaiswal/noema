import nodemailer from 'nodemailer';

let transporter = null;

/**
 * Lazily create a nodemailer transport from env. If MAIL_HOST is not configured
 * we return null and callers simply skip sending (submissions are still stored).
 */
function getTransporter() {
  if (transporter !== null) return transporter;
  if (!process.env.MAIL_HOST) {
    transporter = false; // sentinel: intentionally disabled
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: String(process.env.MAIL_SECURE) === 'true',
    auth:
      process.env.MAIL_USER && process.env.MAIL_PASS
        ? { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
        : undefined,
  });

  return transporter;
}

export async function sendContactNotification(doc) {
  const tx = getTransporter();
  if (!tx) return { sent: false, reason: 'mail-disabled' };

  const label = doc.kind === 'join' ? 'Join / Collaboration enquiry' : 'Contact enquiry';
  const to = process.env.MAIL_TO || 'info@noematechnology.com';
  const from = process.env.MAIL_FROM || 'Noema Website <no-reply@noematechnology.com>';

  const text = [
    `New ${label} from the Noema website`,
    '',
    `Name:    ${doc.name}`,
    `Email:   ${doc.email}`,
    `Mobile:  ${doc.mobile || '—'}`,
    '',
    'Message:',
    doc.message,
    '',
    `Received: ${new Date(doc.createdAt || Date.now()).toISOString()}`,
  ].join('\n');

  await tx.sendMail({
    from,
    to,
    replyTo: doc.email,
    subject: `[Noema] ${label} — ${doc.name}`,
    text,
  });

  return { sent: true };
}
