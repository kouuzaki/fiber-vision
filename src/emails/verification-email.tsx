import { Button, Heading, Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/email-layout";

interface VerificationEmailProps {
  username?: string;
  verificationUrl?: string;
  baseUrl?: string;
}

export function VerificationEmail({
  username = "User",
  verificationUrl = "http://localhost:3000/auth/verify",
  baseUrl = "http://localhost:3000",
}: VerificationEmailProps) {
  return (
    <EmailLayout
      preview="Verify your email address for Fiber Vision"
      baseUrl={baseUrl}
    >
      {/* Welcome Heading */}
      <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-bold text-[#1a1a1a]">
        Verify Your Email Address
      </Heading>

      {/* Greeting */}
      <Text className="text-[14px] leading-[24px] text-[#333333]">
        Hi <strong>{username}</strong>,
      </Text>

      {/* Message */}
      <Text className="text-[14px] leading-[24px] text-[#333333]">
        Thanks for signing up for Fiber Vision! Please verify your email address
        by clicking the button below. This helps us keep your account secure.
      </Text>

      {/* CTA Button - removed hover: classes */}
      <Section className="my-[32px] text-center">
        <Button
          className="rounded-lg bg-[#2563eb] px-6 py-3 text-center text-[14px] font-semibold text-white no-underline"
          href={verificationUrl}
        >
          Verify Email Address
        </Button>
      </Section>

      {/* Fallback URL */}
      <Text className="text-[14px] leading-[24px] text-[#666666]">
        Or copy and paste this URL into your browser:
      </Text>
      <Text className="text-[12px] leading-[20px] text-[#2563eb]">
        <Link href={verificationUrl} className="text-[#2563eb] no-underline">
          {verificationUrl}
        </Link>
      </Text>

      {/* Security Notice */}
      <Section className="mt-[32px] rounded-lg bg-[#f8fafc] p-[16px]">
        <Text className="m-0 text-[12px] leading-[20px] text-[#64748b]">
          🔒 This link will expire in 24 hours. If you didn&apos;t create an
          account with Fiber Vision, please ignore this email or contact our
          support team if you have concerns.
        </Text>
      </Section>
    </EmailLayout>
  );
}

VerificationEmail.PreviewProps = {
  username: "John Doe",
  verificationUrl: "http://localhost:3000/auth/verify?token=abc123xyz",
  baseUrl: "http://localhost:3000",
} as VerificationEmailProps;

export default VerificationEmail;
