import * as React from "react";
import {
  Html,
  Body,
  Container,
  Head,
  Heading,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  userName: string;
  districtName?: string;
}

export function WelcomeEmail({
  userName = "Educator",
  districtName = "your district",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to Pelican AI - Your AI Guidance Partner
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Welcome to Pelican AI!</Heading>
            <Text style={subtitle}>
              Your AI Guidance Partner
            </Text>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>Hi {userName},</Text>

            <Text style={paragraph}>
              Welcome to Pelican AI! We're excited to help you navigate AI with confidence. 
              Our platform-agnostic guidance works with ANY AI tool you already use, 
              designed specifically for Louisiana educators.
            </Text>

            <Section style={highlightBox}>
              <Heading style={h2}>📚 Platform-Agnostic Guidance</Heading>
              <Text style={paragraph}>
                Learn to use ANY AI tool effectively—MagicSchool AI, Brisk, SchoolAI, 
                Gemini, or others. We teach principles, not platforms. Every framework 
                is designed specifically for Louisiana's educational standards.
              </Text>
            </Section>

            <Section style={featureBox}>
              <Heading style={h2}>✨ What Makes Pelican AI Different</Heading>
              <Text style={paragraph}>
                • <strong>Guided Frameworks:</strong> Copy-paste ready prompts with ethical guardrails
              </Text>
              <Text style={paragraph}>
                • <strong>Louisiana-Aligned:</strong> Built for Louisiana standards and educator rubric
              </Text>
              <Text style={paragraph}>
                • <strong>Community-Driven:</strong> Educators sharing innovations with educators
              </Text>
              <Text style={paragraph}>
                • <strong>Time-Saving:</strong> Practical solutions that reclaim valuable teaching time
              </Text>
            </Section>

            <Section style={ctaBox}>
              <Heading style={h2}>🚀 Get Started</Heading>
              <Text style={paragraph}>
                Ready to reclaim your time and deepen your practice? Join our beta program 
                to access curated AI guidance designed specifically for Louisiana educators.
              </Text>
              <Link href="https://aida-app.vercel.app" style={button}>
                Join Beta Program
              </Link>
            </Section>

            <Text style={paragraph}>
              If you have any questions or need support, don't hesitate to reach
              out. I'm here to help you succeed!
            </Text>

            <Text style={paragraph}>
              Best regards,
              <br />
              The Pelican AI Team
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Pelican AI - Navigate AI with Confidence
            </Text>
            <Text style={footerText}>
              <Link href="https://pelicanai.org" style={link}>
                Visit Pelican AI
              </Link>
              {" • "}
              <Link href="mailto:hello@pelicanai.org" style={link}>
                Contact Support
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
  padding: "32px 32px 0",
  textAlign: "center" as const,
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0 0 8px",
  lineHeight: "1.2",
};

const subtitle = {
  color: "#666666",
  fontSize: "18px",
  margin: "0 0 32px",
  lineHeight: "1.4",
};

const content = {
  padding: "0 32px",
};

const paragraph = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const h2 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 16px",
  lineHeight: "1.3",
};

const highlightBox = {
  backgroundColor: "#f0f9ff",
  border: "1px solid #0ea5e9",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const featureBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const ctaBox = {
  backgroundColor: "#fef3c7",
  border: "1px solid #f59e0b",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  margin: "16px 0",
};

const footer = {
  borderTop: "1px solid #e2e8f0",
  padding: "32px 32px 0",
  textAlign: "center" as const,
};

const footerText = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 8px",
};

const link = {
  color: "#3b82f6",
  textDecoration: "none",
};

export default WelcomeEmail;
