import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { env } from "@/env";
import type { ReactElement } from "react";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  react: ReactElement;
}

/**
 * Send an email using React Email templates
 */
export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  const html = await render(react);
  const text = await render(react, { plainText: true });

  const info = await transporter.sendMail({
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
    text,
  });

  return info;
}

/**
 * Verify SMTP connection
 */
export async function verifySmtpConnection() {
  try {
    await transporter.verify();
    console.log("SMTP connection verified successfully");
    return true;
  } catch (error) {
    console.error("SMTP connection failed:", error);
    return false;
  }
}
