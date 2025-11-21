import {
  Heading,
  Section,
  Text,
} from "@react-email/components";
import { BaseEmailTemplate, CredentialsBox, InfoBox, CTAButton, SecondaryButton, textStyles } from "./BaseEmailTemplate";

interface PlatformAccessEmailProps {
  email: string;
  name?: string;
  magicLinkUrl?: string;
}

export function PlatformAccessEmail({
  email,
  name = "Educator",
  magicLinkUrl,
}: PlatformAccessEmailProps) {
  return (
    <BaseEmailTemplate
      previewText="You're in - Let's get started"
      headerTitle={`Welcome ${name}!`}
      headerSubtitle="Your access is ready"
    >
      <Text style={textStyles.paragraph}>
        You're in! Your platform access is ready—no application, no approval process. 
        You're one of 5 Louisiana educators building this together.
      </Text>

      {/* Magic Link CTA */}
      {magicLinkUrl && (
        <Section style={ctaSection}>
          <CTAButton href={magicLinkUrl}>
            Access Platform
          </CTAButton>
        </Section>
      )}

      {!magicLinkUrl && (
        <Section style={ctaSection}>
          <CTAButton href="https://pelicanai.org">
            Access Platform
          </CTAButton>
        </Section>
      )}

      <Text style={textStyles.paragraph}>
        Once you access the platform, you'll complete a brief onboarding to personalize
        your experience.
      </Text>

      {/* Next Steps */}
      <InfoBox>
        <Heading style={textStyles.h2}>Getting Started</Heading>
        <Text style={listItem}>
          1. Click the magic link above to access the platform
        </Text>
        <Text style={listItem}>
          2. Complete your profile setup during onboarding
        </Text>
        <Text style={listItem}>
          3. Explore our AI guidance frameworks
        </Text>
        {magicLinkUrl && (
          <Text style={listItem}>
            4. If the link expires, you can request a new one from the sign-in page
          </Text>
        )}
      </InfoBox>

      {/* Building Together */}
      <InfoBox>
        <Heading style={textStyles.h2}>We're Building This Together</Heading>
        <Text style={textStyles.paragraph}>
          <strong>We're Not Waiting for LDOE.</strong> Louisiana educators need practical 
          AI guidance NOW. That's why you're one of 5 educators starting this with me.
        </Text>
        <Text style={textStyles.paragraph}>
          Your honest feedback ("Did this save time or waste it?") literally shapes 
          everything we build next. With 5 users, every voice matters.
        </Text>
      </InfoBox>

      <Text style={textStyles.paragraph}>
        <strong>Questions?</strong> Just reply to this email or text me. This is 
        grassroots—real conversations, not automated support tickets.
      </Text>

      <Text style={textStyles.paragraph}>
        Thanks for being one of the 5,
        <br />
        Randall
        <br />
        <em>Louisiana educator building this for Louisiana educators</em>
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

