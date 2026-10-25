import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    if (process.env.GMAIL_USER) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
    } else {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }
  }
  return transporter;
}

export async function sendPasswordResetEmail({ toEmail, firstName, resetToken }) {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
  const t = getTransporter();

  console.log(`\n======================================================`);
  console.log(`[PASSWORD RESET EMAIL REQUEST]`);
  console.log(`To: ${toEmail}`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log(`Token expires in: 1 hour`);
  console.log(`======================================================\n`);

  if (!t) {
    // If SMTP credentials not provided in .env yet, return the test link for seamless dev testing
    return {
      delivered: false,
      mode: 'simulated',
      resetUrl,
      message: 'SMTP not configured in backend/.env. Reset link generated and logged to console for testing.',
    };
  }

  const fromEmail = process.env.SMTP_FROM || 'noreply@oretna.ai';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #f7f5f0; margin: 0; padding: 40px 20px; color: #1e1e1e; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e2ddd5; border-radius: 8px; padding: 40px 32px; }
          .logo { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 24px; color: #1e1e1e; }
          h1 { font-family: Georgia, serif; font-size: 26px; font-weight: 400; line-height: 1.2; margin-top: 0; margin-bottom: 16px; }
          p { font-size: 14px; line-height: 1.6; color: #555558; margin-bottom: 20px; }
          .button { display: inline-block; background-color: #242426; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-size: 13px; font-weight: 500; margin: 12px 0 24px; }
          .link-box { word-break: break-all; font-size: 11px; color: #88888b; background: #f9f9f9; padding: 12px; border-radius: 6px; }
          .footer { margin-top: 32px; border-top: 1px solid #f0ece6; padding-top: 16px; font-size: 11px; color: #99999c; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Oretna.ai</div>
          <h1>Reset your password</h1>
          <p>Hello${firstName ? ' ' + firstName : ''},</p>
          <p>We received a request to reset the password for your Oretna account. Click the button below to choose a new password:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button" target="_blank">Reset Password</a>
          </div>
          <p>This password reset link will expire in <strong>1 hour</strong>.</p>
          <p style="font-size: 12px; color: #88888b;">If button doesn't work, copy and paste this link in your browser:</p>
          <div class="link-box">${resetUrl}</div>
          <div class="footer">
            If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </div>
        </div>
      </body>
    </html>
  `;

  await t.sendMail({
    from: `"Oretna" <${fromEmail}>`,
    to: toEmail,
    subject: 'Reset your Oretna password',
    text: `Reset your Oretna password: ${resetUrl} (Expires in 1 hour)`,
    html,
  });

  return { delivered: true, mode: 'smtp' };
}
