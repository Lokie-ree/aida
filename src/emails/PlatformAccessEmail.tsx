import * as React from "react";
import {
  Html,
  Body,
  Container,
  Head,
  Heading,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface PlatformAccessEmailProps {
  email: string;
  name?: string;
  temporaryPassword: string;
}

export function PlatformAccessEmail({
  email,
  name = "Educator",
  temporaryPassword,
}: PlatformAccessEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your Pelican AI Platform Access is Ready - {temporaryPassword}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Pelican AI Branding */}
          <Section style={header}>
            <Img
              src="https://pelicanai.org/icon.png"
              width="40"
              height="40"
              alt="Pelican AI"
              style={logo}
            />
            <Heading style={headerTitle}>Pelican AI</Heading>
            <Text style={tagline}>Your Platform Access is Ready!</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Welcome {name}!</Heading>

            <Text style={paragraph}>
              Your beta program application has been approved! You now have
              access to the Pelican AI platform.
            </Text>

            {/* Credentials Section */}
            <Section style={credentialsBox}>
              <Heading style={h2}>Your Login Credentials</Heading>
              <Text style={credentialLabel}>Email:</Text>
              <Text style={credentialValue}>{email}</Text>
              <Text style={credentialLabel}>Temporary Password:</Text>
              <Text style={credentialValue}>{temporaryPassword}</Text>
              <Text style={securityWarning}>
                ⚠️ Please change your password after your first login.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={ctaSection}>
              <Button style={button} href="https://pelicanai.org">
                Access Platform
              </Button>
            </Section>

            <Text style={paragraph}>
              Once you log in, you'll complete a brief onboarding to personalize
              your experience.
            </Text>

            {/* Next Steps */}
            <Section style={nextStepsBox}>
              <Heading style={h2}>Getting Started</Heading>
              <Text style={listItem}>
                1. Click the button above to access the platform
              </Text>
              <Text style={listItem}>
                2. Log in with your email and temporary password
              </Text>
              <Text style={listItem}>
                3. Change your password for security
              </Text>
              <Text style={listItem}>
                4. Complete your profile setup
              </Text>
              <Text style={listItem}>
                5. Explore our AI guidance frameworks
              </Text>
            </Section>

            <Text style={paragraph}>
              We're excited to have you as part of the Pelican AI community!
              If you have any questions, feel free to reply to this email.
            </Text>

            <Text style={paragraph}>
              Best regards,
              <br />
              The Pelican AI Team
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Pelican AI</strong> - Navigate AI with Confidence
              <br />
              Built with Louisiana educators, for Louisiana educators
            </Text>
            <Text style={footerText}>
              <Link href="https://pelicanai.org" style={link}>
                pelicanai.org
              </Link>
              {" • "}
              <Link href="mailto:hello@pelicanai.org" style={link}>
                Support
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 24px 0",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const headerTitle = {
  color: "#0ea5e9",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "16px 0 0",
  textAlign: "center" as const,
};

const tagline = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "8px 0 0",
  textAlign: "center" as const,
};

const content = {
  padding: "0 24px",
};

const h1 = {
  color: "#1e40af",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "32px 0 16px",
  textAlign: "center" as const,
};

const h2 = {
  color: "#1e40af",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const paragraph = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const credentialsBox = {
  backgroundColor: "#f8fafc",
  border: "2px solid #0ea5e9",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const credentialLabel = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "600",
  margin: "12px 0 4px",
};

const credentialValue = {
  color: "#1e40af",
  fontSize: "16px",
  fontWeight: "bold",
  fontFamily: "monospace",
  margin: "0 0 12px",
};

const securityWarning = {
  color: "#dc2626",
  fontSize: "14px",
  fontWeight: "500",
  margin: "16px 0 0",
  padding: "12px",
  backgroundColor: "#fef2f2",
  borderRadius: "6px",
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#0ea5e9",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
  margin: "0 auto",
};

const nextStepsBox = {
  backgroundColor: "#fffbeb",
  border: "1px solid #f59e0b",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const listItem = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "8px 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  padding: "32px 24px 0",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
};

const link = {
  color: "#0ea5e9",
  textDecoration: "none",
};

export default PlatformAccessEmail;

