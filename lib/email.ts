import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || "false") === "true";

  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendEmail(to: string, subject: string, html: string) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!from) {
    throw new Error("SMTP_FROM or SMTP_USER must be set.");
  }

  const transporter = getTransporter();
  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}

export async function sendOtpEmail(to: string, code: string, purpose: "signup" | "delete-account") {
  const subject = purpose === "signup" ? "Your JobPulse signup verification code" : "Your JobPulse account deletion code";
  const actionText = purpose === "signup" ? "complete signup" : "confirm account deletion";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111;">
      <h2 style="margin:0 0 12px;">JobPulse Security Verification</h2>
      <p>Use this one-time code to ${actionText}:</p>
      <p style="font-size:28px; font-weight:700; letter-spacing:4px; margin:16px 0;">${code}</p>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `;
  await sendEmail(to, subject, html);
}
