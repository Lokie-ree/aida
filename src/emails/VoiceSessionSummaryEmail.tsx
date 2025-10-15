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
  Button,
  Hr,
  Img
} from "@react-email/components";

interface VoiceSessionSummaryEmailProps {
  userName: string;
  interactionCount: number;
  topicsDiscussed: string[];
  spaceName?: string;
}

export function VoiceSessionSummaryEmail({
  userName = "Educator",
  interactionCount = 0,
  topicsDiscussed = [],
  spaceName,
}: VoiceSessionSummaryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your Pelican AI Voice Session Summary - {interactionCount.toString()}{" "}
        interactions
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with gradient */}
          <Section style={header}>
            <Heading style={h1}>🎤 Voice Session Summary</Heading>
            <Text style={subtitle}>Your Pelican AI conversation recap</Text>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>Hi {userName}!</Text>

            <Text style={paragraph}>
              Great session with Pelican AI! Here's a summary of your voice
              interactions:
            </Text>

            {/* Session Stats */}
            <Section style={statsBox}>
              <Text style={statsTitle}>📊 Session Stats</Text>
              <Text style={statsItem}>
                • {interactionCount} voice interactions
              </Text>
              {spaceName && (
                <Text style={statsItem}>• Workspace: {spaceName}</Text>
              )}
              <Text style={statsItem}>
                • Topics discussed: {topicsDiscussed.join(", ")}
              </Text>
            </Section>

            {/* Call to Action */}
            <Section style={ctaBox}>
              <Heading style={h2}>💡 Keep the Conversation Going</Heading>
              <Text style={paragraph}>
                Pelican AI is always ready to help with district policies,
                curriculum questions, and teaching strategies.
              </Text>
              <Button href="https://pelicanai.org" style={button}>
                Continue Your Voice Chat
              </Button>
            </Section>

            {/* Key Benefits Reminder */}
            <Section style={benefitsBox}>
              <Text style={benefitsTitle}>Why Teachers Love Pelican AI</Text>
              <Text style={benefitItem}>
                🎯 District-specific answers in under 2 seconds
              </Text>
              <Text style={benefitItem}>
                📚 Source citations for every response
              </Text>
              <Text style={benefitItem}>🎤 Hands-free voice interaction</Text>
              <Text style={benefitItem}>🔒 FERPA compliant and secure</Text>
            </Section>

            <Text style={paragraph}>
              Thanks for using Pelican AI! We're here to help reduce your
              information overload and make your teaching more efficient.
            </Text>

            <Text style={paragraph}>
              Best regards,
              <br />
              The Pelican AI Team
            </Text>
            
            <Img
              src="https://pelicanai.org/email-signature.png"
              width="200"
              height="60"
              alt="Pelican AI Email Signature"
              style={signature}
            />
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Pelican AI - Your AI Guidance Partner
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
  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  padding: "32px",
  borderRadius: "12px",
  textAlign: "center" as const,
  marginBottom: "32px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 8px",
  lineHeight: "1.2",
};

const subtitle = {
  color: "rgba(255,255,255,0.9)",
  fontSize: "16px",
  margin: "0",
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
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 12px",
  lineHeight: "1.3",
};

const statsBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const statsTitle = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const statsItem = {
  color: "#4b5563",
  fontSize: "14px",
  margin: "4px 0",
  lineHeight: "1.5",
};

const ctaBox = {
  backgroundColor: "#f0f9ff",
  border: "1px solid #0ea5e9",
  borderRadius: "8px",
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
  margin: "16px 0 0",
};

const benefitsBox = {
  backgroundColor: "#fef3c7",
  border: "1px solid #f59e0b",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const benefitsTitle = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const benefitItem = {
  color: "#4b5563",
  fontSize: "14px",
  margin: "4px 0",
  lineHeight: "1.5",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "32px 0",
};

const footer = {
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

const signature = {
  margin: "16px 0 0",
  display: "block",
  objectFit: "contain" as const,
};

export default VoiceSessionSummaryEmail;
