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
              src="https://pelicanai.org/primary-logo.png"
              width="160"
              height="40"
              alt="Pelican AI"
              style={logo}
            />
            <Text style={tagline}>Reclaim Your Time with Confidence</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Welcome to the Beta Program!</Heading>

            <Text style={paragraph}>Hi {name},</Text>

            <Text style={paragraph}>
              I know you're managing a lot right now. Between lesson planning, 
              differentiating for diverse learners, analyzing data, and everything 
              else that fills your evenings and weekends, finding time for one more 
              thing feels impossible.
            </Text>

            <Text style={paragraph}>
              That's exactly why Pelican AI exists. <strong>I'm committed to helping 
              you save 3-5 hours per week on planning and prep tasks</strong> so you can 
              focus on what matters most: teaching Louisiana students.
            </Text>

            {/* Immediate Action Box */}
            <Section style={actionBox}>
              <Heading style={h2}>🎯 Try This Right Now (Seriously, Right Now)</Heading>
              <Text style={paragraph}>
                Before you attend any training or read lengthy documentation, you can 
                use Pelican AI today. Here's how:
              </Text>
              <Text style={listItem}>
                <strong>1. Click this link</strong> → <Link href="https://docs.google.com/document/d/your-framework-link-here/edit" style={ctaLink}>
                  Lesson Objective Unpacker & Success Criteria Builder
                </Link>
              </Text>
              <Text style={listItem}>
                <strong>2. Copy the sample prompt</strong> (it's ready to use)
              </Text>
              <Text style={listItem}>
                <strong>3. Paste it into ANY AI tool</strong> you have access to (MagicSchool AI, Gemini, ChatGPT, etc.)
              </Text>
              <Text style={listItem}>
                <strong>4. Unpack a lesson objective and create student-friendly success criteria in 3 minutes</strong> instead of 10-15 minutes
              </Text>
              <Text style={paragraph}>
                <strong>That's it.</strong> You'll save 7-12 minutes on your very first try—and you do this for EVERY lesson you plan.
              </Text>
            </Section>

            {/* What's Next Section */}
            <Section style={infoBox}>
              <Heading style={h2}>What Happens Next?</Heading>
              <Text style={listItem}>
                • <strong>Within 24-48 hours:</strong> We'll review your application and send platform access credentials
              </Text>
              <Text style={listItem}>
                • <strong>Upon approval:</strong> Access to the Lesson Objective Unpacker framework, beta community, and time tracking
              </Text>
              <Text style={listItem}>
                • <strong>Weeks 1-2:</strong> Master the Lesson Objective Unpacker with multiple lessons
              </Text>
              <Text style={listItem}>
                • <strong>Weeks 3-4:</strong> Share your biggest pain points through weekly check-ins—this drives what we build next
              </Text>
              <Text style={listItem}>
                • <strong>Weeks 5-12:</strong> We co-create NEW frameworks based on YOUR needs, you test prototypes, and we refine together
              </Text>
              <Text style={listItem}>
                • <strong>Ongoing:</strong> Weekly feedback surveys, office hours support, and collaborative framework development
              </Text>
            </Section>

            {/* Beta Welcome Kit */}
            <Section style={highlightBox}>
              <Heading style={h2}>📚 Your Beta Welcome Kit</Heading>
              <Text style={paragraph}>
                Everything you need to succeed in the beta program:
              </Text>
              <Text style={listItem}>
                ✓ <strong>Quick Start Guide</strong> - Understand Pelican AI in 5 minutes
              </Text>
              <Text style={listItem}>
                ✓ <strong>All Available Frameworks</strong> - Direct links and usage instructions
              </Text>
              <Text style={listItem}>
                ✓ <strong>Office Hours Schedule</strong> - Get live support from our team
              </Text>
              <Text style={listItem}>
                ✓ <strong>Feedback Forms</strong> - Help us build what Louisiana educators need
              </Text>
              <Text style={paragraph}>
                <Link href="https://docs.google.com/document/d/your-welcome-kit-link-here/edit" style={ctaLink}>
                  <strong>→ Access Your Beta Welcome Kit</strong>
                </Link>
              </Text>
            </Section>

            {/* Time Commitment */}
            <Text style={paragraph}>
              <strong>Your Time Commitment:</strong> About 1 hour per week for 8-12 weeks—
              try frameworks (~15 min), provide feedback (~5 min), and optionally join 
              office hours. In return, you'll save 3-5 hours per week.
            </Text>

            <Text style={paragraph}>
              Thank you for helping us build AI guidance that truly serves Louisiana 
              educators. Your feedback will directly shape what we create next.
            </Text>

            <Text style={paragraph}>
              Questions? Just reply to this email.
            </Text>

            <Text style={paragraph}>
              Best regards,
              <br />
              The Pelican AI Team
              <br />
              <em>Built by Louisiana educators, for Louisiana educators</em>
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
  display: "block",
  objectFit: "contain" as const,
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

const actionBox = {
  backgroundColor: "#fef3c7",
  border: "2px solid #f59e0b",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  borderLeft: "4px solid #f59e0b",
};

const ctaLink = {
  color: "#0ea5e9",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "16px",
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

