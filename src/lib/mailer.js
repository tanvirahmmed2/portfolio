import nodemailer from 'nodemailer';

/**
 * Dispatches an email to the recipient.
 * If SMTP keys are missing in environment variables, it logs to the console as a mock helper.
 */
export async function sendEmail({ to, subject, text, html }) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || '"Portfolio Admin" <noreply@portfolio.com>';

  if (!host || !user || !pass) {
    console.log('=================================================');
    console.log('         MOCK EMAIL DISPATCHED (DEV MODE)        ');
    console.log('=================================================');
    console.log(`From:    ${from}`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: \n${text}`);
    console.log('=================================================');
    return { mock: true, messageId: `mock-email-${Date.now()}` };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: {
      user,
      pass,
    },
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html: html || text,
  });

  return info;
}
