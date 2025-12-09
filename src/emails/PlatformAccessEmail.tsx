import { Row, Column, Section, Text, Link } from "@react-email/components";
import {
  BaseEmailTemplate,
  Heading,
  Paragraph,
  Card,
  HighlightBox,
  CTAButton,
  Step,
  ListItem,
  Feature,
  Signature,
  Divider,
} from "./BaseEmailTemplate";

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
  const loginUrl = magicLinkUrl || "https://pelicanai.org";

  return (
    <BaseEmailTemplate
      previewText="Your Pelican AI access is ready — Let's start your first conversation"
      headerTitle={`Welcome, ${name}!`}
      headerSubtitle="Your access is ready. Let's start coaching."
      headerEmoji="🎉"
      variant="celebration"
    >
      <Paragraph>
        Your access to Pelican AI is ready! Click the button below to log in and
        start your first coaching conversation.
      </Paragraph>

      {/* Magic Link CTA - Prominent */}
      <Section className="text-center my-8 py-8 px-6 bg-sky-900/30 rounded-2xl border border-sky-700">
        <Text className="text-4xl m-0 mb-4">🚀</Text>
        <CTAButton href={loginUrl} size="lg">
          Log In to Pelican AI
        </CTAButton>
        {magicLinkUrl && (
          <Text className="text-slate-300 text-sm mt-4 mb-0">
            This link is valid for 24 hours. If it expires, request a new one from the login page.
          </Text>
        )}
      </Section>

      <Divider />

      {/* Quick Start Steps */}
      <Heading as="h2">🎯 Get Started in 4 Steps</Heading>

      <Section className="mt-6">
        <Step
          number={1}
          title="Click the login button above"
          description="Access your Pelican AI dashboard"
        />
        <Step
          number={2}
          title="Complete your profile"
          description="Grade level, subject, school—helps personalize coaching"
        />
        <Step
          number={3}
          title="Start a conversation"
          description="Just describe a lesson you're teaching this week"
        />
        <Step
          number={4}
          title="Get your Louisiana-aligned prompt"
          description="Copy/paste into ChatGPT, Claude, Gemini, or any AI tool"
          isLast
        />
      </Section>

      <Divider />

      {/* What Makes This Different */}
      <HighlightBox>
        <Heading as="h2" className="mt-0">✨ What Makes This Different</Heading>
        <Paragraph>
          Pelican AI isn't another AI tool to learn. It's an{" "}
          <strong>intelligent coaching layer</strong> that helps you use the tools
          you already have (ChatGPT, Claude, Gemini) more effectively.
        </Paragraph>

        <Row className="mt-6">
          <Feature
            icon="🎯"
            title="Louisiana-Specific"
            description="LER indicators, LSS standards, LEADS framework"
          />
          <Feature
            icon="🔌"
            title="Platform-Agnostic"
            description="Works with ANY AI tool your district provides"
          />
          <Feature
            icon="💬"
            title="Conversational"
            description="Feels like talking to a colleague, not filling forms"
          />
        </Row>
      </HighlightBox>

      {/* Grassroots Note */}
      <Card variant="default">
        <Heading as="h3" className="mt-0">🤝 We're Building This Together</Heading>
        <Paragraph>
          You're one of 5 Louisiana educators starting this with me. Your feedback
          literally shapes what we build next.
        </Paragraph>
        <ListItem icon="arrow">
          <strong>Questions?</strong> Just reply to this email
        </ListItem>
        <ListItem icon="arrow">
          <strong>Ideas?</strong> Share them—every suggestion matters with 5 testers
        </ListItem>
        <ListItem icon="arrow">
          <strong>Problems?</strong> Tell me honestly—that's how we improve
        </ListItem>
      </Card>

      <Paragraph>See you inside,</Paragraph>
      <Signature />

      {/* Backup Link */}
      <Section className="mt-10 py-5 px-6 bg-slate-700 rounded-xl text-center">
        <Text className="text-slate-300 text-xs m-0">
          Button not working? Copy and paste this link:
        </Text>
        <Text className="text-brand-primary-light text-xs mt-2 mb-0 break-all font-mono">
          {loginUrl}
        </Text>
      </Section>
    </BaseEmailTemplate>
  );
}

export default PlatformAccessEmail;
