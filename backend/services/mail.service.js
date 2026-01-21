const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  SMTP_TLS_REJECT_UNAUTHORIZED,
  MAIL_LOGGING
} = process.env;

/* create transporter once */
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 25),
  secure: SMTP_SECURE === 'true',
  auth: SMTP_USER
    ? { user: SMTP_USER, pass: SMTP_PASS }
    : null,
  tls: {
    rejectUnauthorized: SMTP_TLS_REJECT_UNAUTHORIZED !== 'false'
  }
});

/**
 * Send email
 */
async function sendMail({
  from = SMTP_FROM,
  to,
  cc,
  subject,
  text,
  html,
  attachments
}) {
  if (!to) {
    throw new Error('Missing recipient');
  }

  const mailOptions = {
    from,
    to,
    cc,
    subject,
    text,
    html,
    attachments
  };

  if (MAIL_LOGGING === 'true') {
    console.log('[MAIL] Sending:', mailOptions);
  }

  const info = await transporter.sendMail(mailOptions);

  if (MAIL_LOGGING === 'true') {
    console.log('[MAIL] Sent:', info.messageId);
  }

  return info;
}

module.exports = {
  sendMail
};
