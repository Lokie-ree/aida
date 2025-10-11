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
  Hr,
} from "@react-email/components";

interface BetaWelcomeEmailProps {
  name?: string;
  school?: string;
}

export function BetaWelcomeEmail({
  name = "Educator",
  school,
}: BetaWelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Pelican AI Beta Program - Reclaim Your Time!</Preview>
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
            <Text style={tagline}>Reclaim Your Time with Confidence</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Welcome to the Beta Program!</Heading>

            <Text style={paragraph}>Hi {name},</Text>

            <Text style={paragraph}>
              Thank you for joining the Pelican AI beta program! We're excited
              to have you as part of our community of Louisiana educators who
              are reclaiming their time and teaching with confidence.
            </Text>

            {/* What's Next Section */}
            <Section style={infoBox}>
              <Heading style={h2}>What's Next?</Heading>
              <Text style={listItem}>
                • We'll review your application and notify you via email
              </Text>
              <Text style={listItem}>
                • Once approved, you'll receive platform access credentials
              </Text>
              <Text style={listItem}>
                • Start exploring our curated AI guidance frameworks
              </Text>
              <Text style={listItem}>
                • Join our community of Louisiana educators
              </Text>
            </Section>

            {/* What You'll Get Section */}
            <Section style={highlightBox}>
              <Heading style={h2}>What You'll Get</Heading>
              <Text style={listItem}>
                <strong>10+ AI Guidance Frameworks</strong> - Copy-paste prompts
                for common tasks
              </Text>
              <Text style={listItem}>
                <strong>Louisiana Standards Alignment</strong> - LER domains and
                state standards mapped
              </Text>
              <Text style={listItem}>
                <strong>Time Savings Tracking</strong> - Measure your efficiency
                gains
              </Text>
              <Text style={listItem}>
                <strong>Community Access</strong> - Share innovations with
                fellow educators
              </Text>
            </Section>

            <Text style={paragraph}>
              We'll be in touch soon with your platform access and next steps.
              In the meantime, feel free to reply to this email if you have any
              questions.
            </Text>

            <Text style={paragraph}>
              Thank you for helping us build AI tools that truly serve Louisiana
              educators!
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
              <strong>Pelican AI</strong> - Reclaim Your Time with Confidence
              <br />
              Built with Louisiana educators, for Louisiana educators
            </Text>
            <Text style={footerText}>
              <Link href="https://pelicanai.org" style={link}>
                pelicanai.org
              </Link>
              {" • "}
              <Link href="https://pelicanai.org/unsubscribe" style={link}>
                Unsubscribe
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

const infoBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const highlightBox = {
  backgroundColor: "#eff6ff",
  border: "1px solid #0ea5e9",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  borderLeft: "4px solid #0ea5e9",
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

export default BetaWelcomeEmail;

