import {
  Heading,
  Section,
  Text,
} from "@react-email/components";
import { BaseEmailTemplate, Card, CTAButton, textStyles } from "./BaseEmailTemplate";

interface PlatformAccessEmailProps {
  email: string;
  name?: string;
  magicLinkUrl?: string;
}

export function PlatformAccessEmail({
  name = "Educator",
  magicLinkUrl,
}: PlatformAccessEmailProps) {
  return (
    <BaseEmailTemplate
      previewText="Your Pelican AI access is ready"
      headerTitle={`Welcome ${name}!`}
      headerSubtitle="Let's start your first coaching conversation"
    >
      <Text style={textStyles.paragraph}>
        Your access to Pelican AI is ready! Click the button below to log in and start
        your first coaching conversation.
      </Text>

      {/* Magic Link CTA */}
      <Card>
        {magicLinkUrl && (
          <Section style={ctaSection}>
            <CTAButton href={magicLinkUrl}>
              Log In to Pelican AI
            </CTAButton>
          </Section>
        )}

        {!magicLinkUrl && (
          <Section style={ctaSection}>
            <CTAButton href="https://pelicanai.org">
              Log In to Pelican AI
            </CTAButton>
          </Section>
        )}

        {magicLinkUrl && (
          <Text style={helperText}>
            This link is valid for 24 hours. If it expires, request a new one from the login page.
          </Text>
        )}
      </Card>

      {/* What to Do Next */}
      <Heading style={textStyles.h2}>What to Do Next</Heading>
      <Text style={listItem}>
        1. <strong>Click the login button above</strong> to access Pelican AI
      </Text>
      <Text style={listItem}>
        2. <strong>Complete your profile</strong> (grade level, subject, school)—this helps personalize your coaching
      </Text>
      <Text style={listItem}>
        3. <strong>Start a conversation</strong> - just describe a lesson you're teaching this week
      </Text>
      <Text style={listItem}>
        4. <strong>Get a Louisiana-aligned prompt</strong> you can use in ChatGPT, Claude, Gemini, or any AI tool
      </Text>

      {/* What Makes This Different */}
      <Card>
        <Heading style={textStyles.h2}>What Makes This Different</Heading>
        <Text style={textStyles.paragraph}>
          Pelican AI isn't another AI tool to learn. It's an intelligent coaching layer that helps
          you use the tools you already have (ChatGPT, Claude, Gemini) more effectively.
        </Text>
        <Text style={textStyles.paragraph}>
          <strong>Louisiana-Specific Intelligence:</strong> Every generated prompt demonstrates
          knowledge of Louisiana Educator Rubric, Louisiana Student Standards, and LEADS evaluation framework.
        </Text>
      </Card>

      <Text style={textStyles.paragraph}>
        <strong>Questions?</strong> Just reply to this email. This is grassroots—we're building
        it together.
      </Text>

      <Text style={textStyles.paragraph}>
        See you inside,
        <br />
        Randall
        <br />
        <em>Louisiana educator building this for Louisiana educators</em>
      </Text>
    </BaseEmailTemplate>
  );
}

const ctaSection = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const listItem = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "8px 0",
};

const helperText = {
  color: "#6b7280",
  fontSize: "13px",
  textAlign: "center" as const,
  margin: "12px 0 0 0",
};

export default PlatformAccessEmail;
