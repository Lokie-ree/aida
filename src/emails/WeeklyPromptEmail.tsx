import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface WeeklyPromptEmailProps {
  userName: string;
  frameworkTitle: string;
  frameworkId: string;
  samplePrompt: string;
  timeEstimate: number;
  difficultyLevel: string;
  weekNumber: number;
}

export const WeeklyPromptEmail = ({
  userName = "Educator",
  frameworkTitle = "Email Drafting for Parent Communication",
  frameworkId = "AIB-001",
  samplePrompt = "Act as a compassionate and professional [grade level] [subject] teacher...",
  timeEstimate = 10,
  difficultyLevel = "beginner",
  weekNumber = 1,
}: WeeklyPromptEmailProps) => {
  const previewText = `This week's productivity prompt: ${frameworkTitle}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://pelicanai.org/logo.png"
              width="40"
              height="40"
              alt="Pelican AI"
              style={logo}
            />
            <Heading style={headerTitle}>Pelican AI</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>
              This Week's Productivity Prompt
            </Heading>
            
            <Text style={text}>
              Hi {userName},
            </Text>
            
            <Text style={text}>
              Welcome to Week {weekNumber} of your Pelican AI journey! This week's featured framework 
              is designed to help you save time on a common teaching task.
            </Text>

            {/* Framework Card */}
            <Section style={frameworkCard}>
              <div style={frameworkHeader}>
                <Text style={frameworkIdStyle}>{frameworkId}</Text>
                <div style={frameworkBadges}>
                  <span style={badge}>{difficultyLevel}</span>
                  <span style={badge}>{timeEstimate} min</span>
                </div>
              </div>
              
              <Heading style={frameworkTitleStyle}>{frameworkTitle}</Heading>
              
              <Text style={frameworkDescription}>
                Copy the prompt below and paste it into your preferred AI platform 
                (MagicSchool AI, Brisk, SchoolAI, Gemini, etc.)
              </Text>
              
              <Section style={promptBox}>
                <Text style={promptText}>{samplePrompt}</Text>
              </Section>
              
              <Button style={button} href="https://pelicanai.org/frameworks">
                View Full Framework
              </Button>
            </Section>

            <Text style={text}>
              <strong>Pro Tip:</strong> Try this framework with a real task this week and let us know 
              how much time you saved! We'd love to hear about your experience.
            </Text>

            <Hr style={hr} />

            {/* Community Section */}
            <Section style={communitySection}>
              <Heading style={h2}>Join the Conversation</Heading>
              <Text style={text}>
                Share your innovations and learn from other Louisiana educators in our community space.
              </Text>
              <Button style={secondaryButton} href="https://pelicanai.org/community">
                Join Community
              </Button>
            </Section>

            {/* Office Hours */}
            <Section style={officeHoursSection}>
              <Heading style={h2}>Need Help?</Heading>
              <Text style={text}>
                Book a 30-minute office hours session with our team for personalized support.
              </Text>
              <Text style={text}>
                <strong>Available:</strong> Tuesdays & Thursdays, 4:00-6:00 PM CST
              </Text>
              <Button style={secondaryButton} href="https://pelicanai.org/office-hours">
                Schedule Session
              </Button>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this because you're part of the Pelican AI beta program.
            </Text>
            <Text style={footerText}>
              <Link href="https://pelicanai.org/unsubscribe" style={link}>
                Unsubscribe
              </Link>
              {" • "}
              <Link href="https://pelicanai.org/profile" style={link}>
                Update Preferences
              </Link>
            </Text>
            <Text style={footerText}>
              Pelican AI • Navigate AI with Confidence
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
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
  margin: "24px 0 12px",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const frameworkCard = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const frameworkHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const frameworkIdStyle = {
  color: "#6b7280",
  fontSize: "14px",
  fontFamily: "monospace",
  margin: 0,
};

const frameworkBadges = {
  display: "flex",
  gap: "8px",
};

const badge = {
  backgroundColor: "#e5e7eb",
  color: "#374151",
  fontSize: "12px",
  fontWeight: "500",
  padding: "4px 8px",
  borderRadius: "4px",
};

const frameworkTitleStyle = {
  color: "#1e40af",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const frameworkDescription = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 16px",
};

const promptBox = {
  backgroundColor: "#ffffff",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  padding: "16px",
  margin: "16px 0",
};

const promptText = {
  color: "#374151",
  fontSize: "14px",
  fontFamily: "monospace",
  lineHeight: "20px",
  margin: 0,
  whiteSpace: "pre-wrap" as const,
};

const button = {
  backgroundColor: "#0ea5e9",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "16px 0",
};

const secondaryButton = {
  backgroundColor: "#ffffff",
  border: "1px solid #0ea5e9",
  borderRadius: "6px",
  color: "#0ea5e9",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "16px 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const communitySection = {
  margin: "32px 0",
};

const officeHoursSection = {
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
  textDecoration: "underline",
};

export default WeeklyPromptEmail;
