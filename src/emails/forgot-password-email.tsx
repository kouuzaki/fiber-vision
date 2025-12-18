import { Button, Heading, Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface ForgotPasswordEmailProps {
  username?: string;
  resetUrl?: string;
  baseUrl?: string;
}

export function ForgotPasswordEmail({
  username = "User",
  resetUrl = "http://localhost:3000/auth/reset-password",
  baseUrl = "http://localhost:3000",
}: ForgotPasswordEmailProps) {
  return (
    <EmailLayout
      preview="Reset your password for Fiber Vision"
      baseUrl={baseUrl}
    >
      {/* Heading */}
      <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-bold text-[#1a1a1a]">
        Reset Your Password
      </Heading>

      {/* Greeting */}
      <Text className="text-[14px] leading-[24px] text-[#333333]">
        Hi <strong>{username}</strong>,
      </Text>

      {/* Message */}
      <Text className="text-[14px] leading-[24px] text-[#333333]">
        We received a request to reset your password for your Fiber Vision
        account. Click the button below to choose a new password.
      </Text>

      {/* CTA Button - removed hover: classes */}
      <Section className="my-[32px] text-center">
        <Button
          className="rounded-lg bg-[#dc2626] px-6 py-3 text-center text-[14px] font-semibold text-white no-underline"
          href={resetUrl}
        >
          Reset Password
        </Button>
      </Section>

      {/* Fallback URL */}
      <Text className="text-[14px] leading-[24px] text-[#666666]">
        Or copy and paste this URL into your browser:
      </Text>
      <Text className="text-[12px] leading-[20px] text-[#dc2626]">
        <Link href={resetUrl} className="text-[#dc2626] no-underline">
          {resetUrl}
        </Link>
      </Text>

      {/* Security Notice */}
      <Section className="mt-[32px] rounded-lg bg-[#fef2f2] p-[16px]">
        <Text className="m-0 text-[12px] leading-[20px] text-[#991b1b]">
          ⚠️ This link will expire in 1 hour. If you didn&apos;t request a
          password reset, please ignore this email. Your password will remain
          unchanged.
        </Text>
      </Section>

      {/* Additional Security Info */}
      <Text className="mt-[24px] text-[12px] leading-[20px] text-[#64748b]">
        For your security, this password reset request was received from a web
        browser. If this wasn&apos;t you, we recommend you change your password
        immediately and enable two-factor authentication.
      </Text>
    </EmailLayout>
  );
}

ForgotPasswordEmail.PreviewProps = {
  username: "John Doe",
  resetUrl: "http://localhost:3000/auth/reset-password?token=abc123xyz",
  baseUrl: "http://localhost:3000",
} as ForgotPasswordEmailProps;

export default ForgotPasswordEmail;
