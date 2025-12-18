import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
  baseUrl?: string;
}

export function EmailLayout({
  preview,
  children,
  baseUrl = "http://localhost:3000",
}: EmailLayoutProps) {
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#2563eb",
                "brand-dark": "#1d4ed8",
              },
            },
          },
        }}
      >
        <Head />
        <Body className="mx-auto my-auto bg-[#f6f9fc] px-2 font-sans">
          <Preview>{preview}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-lg border border-solid border-[#eaeaea] bg-white p-[20px]">
            {/* Header with Logo */}
            <Section className="mt-[16px] text-center">
              <Img
                src={`${baseUrl}/logo.png`}
                width="48"
                height="48"
                alt="Logo"
                className="mx-auto my-0"
              />
            </Section>

            {/* Main Content */}
            {children}

            {/* Footer */}
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-center text-[12px] leading-[24px] text-[#666666]">
              © {new Date().getFullYear()} Fiber Vision. All rights reserved.
            </Text>
            <Text className="text-center text-[12px] leading-[24px] text-[#999999]">
              If you didn&apos;t request this email, you can safely ignore it.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default EmailLayout;
