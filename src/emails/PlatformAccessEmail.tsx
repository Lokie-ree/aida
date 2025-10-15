import {
  Heading,
  Section,
  Text,
} from "@react-email/components";
import { BaseEmailTemplate, CredentialsBox, InfoBox, CTAButton, SecondaryButton, textStyles } from "./BaseEmailTemplate";

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
    <BaseEmailTemplate
      previewText={`Your Pelican AI Platform Access is Ready - ${temporaryPassword}`}
      headerTitle={`Welcome ${name}!`}
      headerSubtitle="Your Platform Access is Ready!"
    >
      <Text style={textStyles.paragraph}>
        Your beta program application has been approved! You now have
        access to the Pelican AI platform.
      </Text>

      {/* Credentials Section */}
      <CredentialsBox>
        <Heading style={textStyles.h2}>Your Login Credentials</Heading>
        <Text style={credentialLabel}>Email:</Text>
        <Text style={credentialValue}>{email}</Text>
        <Text style={credentialLabel}>Temporary Password:</Text>
        <Text style={credentialValue}>{temporaryPassword}</Text>
        <Text style={securityWarning}>
          ⚠️ Please change your password after your first login.
        </Text>
      </CredentialsBox>

      {/* CTA Button */}
      <Section style={ctaSection}>
        <CTAButton href="https://pelicanai.org">
          Access Platform
        </CTAButton>
      </Section>

      <Text style={textStyles.paragraph}>
        Once you log in, you'll complete a brief onboarding to personalize
        your experience.
      </Text>

      {/* Next Steps */}
      <InfoBox>
        <Heading style={textStyles.h2}>Getting Started</Heading>
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
      </InfoBox>

      {/* Beta Program Overview */}
      <InfoBox>
        <Heading style={textStyles.h2}>Learn More About the Beta Program</Heading>
        <Text style={textStyles.paragraph}>
          Get a comprehensive overview of what to expect during your beta journey:
        </Text>
        <SecondaryButton href="https://drive.google.com/file/d/1bUhJuvoNZURqn6Wrm6_G3UCaxvNDLN29/view?usp=sharing">
          Podcast Beta Overview
        </SecondaryButton>
      </InfoBox>

      <Text style={textStyles.paragraph}>
        We're excited to have you as part of the Pelican AI community!
        If you have any questions, feel free to reply to this email.
      </Text>

      <Text style={textStyles.paragraph}>
        Best regards,
        <br />
        The Pelican AI Team
      </Text>
    </BaseEmailTemplate>
  );
}

// Styles specific to this email template
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

const listItem = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "8px 0",
};

export default PlatformAccessEmail;

