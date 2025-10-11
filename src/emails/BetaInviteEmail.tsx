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

interface BetaInviteEmailProps {
  recipientName: string;
  inviterName: string;
  inviterSchool: string;
  betaProgramDetails: {
    startDate: string;
    duration: string;
    benefits: string[];
  };
}

export const BetaInviteEmail = ({
  recipientName = "Educator",
  inviterName = "Sarah Johnson",
  inviterSchool = "Louisiana High School",
  betaProgramDetails = {
    startDate: "October 15, 2025",
    duration: "12 weeks",
    benefits: [
      "Weekly productivity prompts delivered via email",
      "Platform-agnostic AI guidance frameworks",
      "Louisiana standards-aligned content",
      "Community of Louisiana educators",
      "Direct input into Phase 1 MVP development"
    ]
  }
}: BetaInviteEmailProps) => {
  const previewText = `You're invited to join Pelican AI beta - Navigate AI with Confidence`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://pelicanai.org/icon.png"
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
              You're Invited to Navigate AI with Confidence
            </Heading>
            
            <Text style={text}>
              Hi {recipientName},
            </Text>
            
            <Text style={text}>
              <strong>{inviterName}</strong> from <strong>{inviterSchool}</strong> has invited you 
              to join the Pelican AI beta program. We're building Louisiana's premier resource 
              for ethical and effective AI usage in K-12 education.
            </Text>

            <Text style={text}>
              Pelican AI isn't another software platform—it's a comprehensive guidance system 
              that helps you leverage ANY AI tool you have access to (MagicSchool AI, Brisk, 
              SchoolAI, Gemini, or others) to save time, reduce burnout, and improve your 
              instructional practice.
            </Text>

            <Text style={text}>
              <strong>Our Mission:</strong> To empower Louisiana educators with practical, 
              ethical, and platform-agnostic AI guidance that reclaims your time for 
              high-impact teaching while maintaining the highest standards of academic integrity.
            </Text>

            {/* Beta Program Card */}
            <Section style={programCard}>
              <Heading style={programTitle}>Phase 1 MVP Beta Program</Heading>
              
              <div style={programInfo}>
                <div style={infoRow}>
                  <Text style={infoLabel}>Start Date:</Text>
                  <Text style={infoValue}>{betaProgramDetails.startDate}</Text>
                </div>
                <div style={infoRow}>
                  <Text style={infoLabel}>Duration:</Text>
                  <Text style={infoValue}>{betaProgramDetails.duration}</Text>
                </div>
              </div>

              <Text style={programDescription}>
                Join Louisiana educators who are reclaiming 3-5 hours per week with 
                ethical AI guidance aligned to Louisiana standards.
              </Text>

              <Text style={benefitsTitle}>What You'll Get:</Text>
              <ul style={benefitsList}>
                {betaProgramDetails.benefits.map((benefit, index) => (
                  <li key={index} style={benefitItem}>
                    <Text style={benefitText}>✓ {benefit}</Text>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Value Proposition */}
            <Section style={valueSection}>
              <Heading style={h2}>Why Pelican AI?</Heading>
              
              <div style={valueGrid}>
                <div style={valueItem}>
                  <Text style={valueIcon}>🔧</Text>
                  <Text style={valueTitle}>Platform-Agnostic</Text>
                  <Text style={valueDescription}>
                    Works with ANY AI tool you have access to - MagicSchool AI, Brisk, SchoolAI, Gemini, or others
                  </Text>
                </div>
                
                <div style={valueItem}>
                  <Text style={valueIcon}>🏫</Text>
                  <Text style={valueTitle}>Louisiana-Aligned</Text>
                  <Text style={valueDescription}>
                    Built specifically for Louisiana standards and the Louisiana Educator Rubric
                  </Text>
                </div>
                
                <div style={valueItem}>
                  <Text style={valueIcon}>🛡️</Text>
                  <Text style={valueTitle}>Ethical Guardrails</Text>
                  <Text style={valueDescription}>
                    Responsible AI use with academic integrity and data privacy built-in
                  </Text>
                </div>
                
                <div style={valueItem}>
                  <Text style={valueIcon}>⏰</Text>
                  <Text style={valueTitle}>Time-Saving</Text>
                  <Text style={valueDescription}>
                    Immediate, practical solutions for common tasks that save 3-5 hours per week
                  </Text>
                </div>
              </div>
            </Section>

            {/* Testimonial */}
            <Section style={testimonialSection}>
              <Text style={testimonialText}>
                "This isn't another tool to learn—it's guidance on using the tools I already have access to. 
                I saved 4 hours last week on lesson planning alone! The Louisiana alignment makes it perfect 
                for our standards."
              </Text>
              <Text style={testimonialAuthor}>
                — Sarah Johnson, High School English Teacher, Jefferson Parish
              </Text>
            </Section>

            {/* CTA */}
            <Section style={ctaSection}>
              <Button style={button} href="https://pelicanai.org/beta-signup">
                Join the Beta Program
              </Button>
              
              <Text style={ctaText}>
                Limited to 50 educators • Free during beta period
              </Text>
            </Section>

            <Hr style={hr} />

            {/* What's Next */}
            <Section style={nextStepsSection}>
              <Heading style={h2}>What Happens Next?</Heading>
              
              <div style={stepsList}>
                <div style={stepItem}>
                  <Text style={stepNumber}>1</Text>
                  <div style={stepContent}>
                    <Text style={stepTitle}>Sign Up</Text>
                    <Text style={stepDescription}>
                      Complete a quick 2-minute registration form
                    </Text>
                  </div>
                </div>
                
                <div style={stepItem}>
                  <Text style={stepNumber}>2</Text>
                  <div style={stepContent}>
                    <Text style={stepTitle}>Welcome Email</Text>
                    <Text style={stepDescription}>
                      Receive your welcome kit and first framework
                    </Text>
                  </div>
                </div>
                
                <div style={stepItem}>
                  <Text style={stepNumber}>3</Text>
                  <div style={stepContent}>
                    <Text style={stepTitle}>Start Saving Time</Text>
                    <Text style={stepDescription}>
                      Try your first framework and join the community
                    </Text>
                  </div>
                </div>
              </div>
            </Section>

            {/* Questions */}
            <Section style={questionsSection}>
              <Text style={text}>
                <strong>Questions?</strong> Reply to this email or join our office hours 
                (Tuesdays & Thursdays, 4:00-6:00 PM CST).
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This invitation was sent by {inviterName} from {inviterSchool}.
            </Text>
            <Text style={footerText}>
              <Link href="https://pelicanai.org/unsubscribe" style={link}>
                Unsubscribe
              </Link>
              {" • "}
              <Link href="https://pelicanai.org/privacy" style={link}>
                Privacy Policy
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

const programCard = {
  backgroundColor: "#f0f9ff",
  border: "1px solid #0ea5e9",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const programTitle = {
  color: "#1e40af",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 16px",
};

const programInfo = {
  marginBottom: "16px",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const infoLabel = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "500",
  margin: 0,
};

const infoValue = {
  color: "#374151",
  fontSize: "14px",
  fontWeight: "bold",
  margin: 0,
};

const programDescription = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 16px",
};

const benefitsTitle = {
  color: "#1e40af",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "16px 0 8px",
};

const benefitsList = {
  margin: 0,
  padding: 0,
  listStyle: "none",
};

const benefitItem = {
  marginBottom: "8px",
};

const benefitText = {
  color: "#374151",
  fontSize: "14px",
  margin: 0,
};

const valueSection = {
  margin: "32px 0",
};

const valueGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "16px",
  marginTop: "16px",
};

const valueItem = {
  textAlign: "center" as const,
  padding: "16px",
};

const valueIcon = {
  fontSize: "24px",
  margin: "0 0 8px",
};

const valueTitle = {
  color: "#1e40af",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "8px 0 4px",
};

const valueDescription = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: 0,
};

const testimonialSection = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "24px",
  margin: "32px 0",
  textAlign: "center" as const,
};

const testimonialText = {
  color: "#374151",
  fontSize: "16px",
  fontStyle: "italic",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const testimonialAuthor = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "500",
  margin: 0,
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#0ea5e9",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px 32px",
  margin: "16px auto",
};

const ctaText = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "8px 0 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const nextStepsSection = {
  margin: "32px 0",
};

const stepsList = {
  margin: "16px 0",
};

const stepItem = {
  display: "flex",
  alignItems: "flex-start",
  marginBottom: "16px",
};

const stepNumber = {
  backgroundColor: "#0ea5e9",
  color: "#ffffff",
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "bold",
  marginRight: "12px",
  flexShrink: 0,
};

const stepContent = {
  flex: 1,
};

const stepTitle = {
  color: "#1e40af",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 4px",
};

const stepDescription = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: 0,
};

const questionsSection = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "16px",
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

export default BetaInviteEmail;
