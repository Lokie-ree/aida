import { Row, Column, Section, Text } from "@react-email/components";
import {
  BaseEmailTemplate,
  Heading,
  Paragraph,
  Card,
  HighlightBox,
  ListItem,
  StatsRow,
  Signature,
  Divider,
  TimelineItem,
  Feature,
  Badge,
} from "./BaseEmailTemplate";

interface BetaWelcomeEmailProps {
  name?: string;
  school?: string;
}

export function BetaWelcomeEmail({
  name = "Educator",
}: BetaWelcomeEmailProps) {
  return (
    <BaseEmailTemplate
      previewText="Welcome to Pelican AI — Your Louisiana Coaching Assistant"
      headerTitle="Welcome to Pelican AI"
      headerSubtitle="You're one of 5 educators building this together"
      headerEmoji="🎉"
      variant="celebration"
    >
      <Paragraph>Hi {name},</Paragraph>

      <Paragraph>
        <strong>You're in!</strong> You're one of 5 Louisiana educators helping shape
        Pelican AI—an intelligent coaching assistant that helps you generate
        Louisiana-aligned prompts for <strong>ANY AI tool</strong> you already use
        (ChatGPT, Claude, Gemini, etc.).
      </Paragraph>

      {/* Key Value Proposition */}
      <HighlightBox>
        <Heading as="h2" className="mt-0">🎯 This Is NOT Another AI Tool</Heading>
        <Paragraph>
          It's a coaching layer that helps you use the tools you already have more
          effectively, with Louisiana-specific intelligence built in:
        </Paragraph>

        <Row className="mt-6">
          <Column className="text-center px-3 py-4">
            <Text className="text-brand-primary-light text-xl font-bold m-0 mb-1">LER</Text>
            <Text className="text-slate-300 text-xs m-0">Louisiana Educator Rubric</Text>
          </Column>
          <Column className="text-center px-3 py-4">
            <Text className="text-brand-primary-light text-xl font-bold m-0 mb-1">LSS</Text>
            <Text className="text-slate-300 text-xs m-0">Louisiana Student Standards</Text>
          </Column>
          <Column className="text-center px-3 py-4">
            <Text className="text-brand-primary-light text-xl font-bold m-0 mb-1">LEADS</Text>
            <Text className="text-slate-300 text-xs m-0">Evaluation Framework</Text>
          </Column>
        </Row>
      </HighlightBox>

      {/* Stats */}
      <Section className="text-center my-8">
        <StatsRow
          stats={[
            { value: "5", label: "Beta Testers" },
            { value: "100%", label: "Louisiana-Built" },
            { value: "∞", label: "AI Tools Supported" },
          ]}
        />
      </Section>

      {/* Getting Started Card */}
      <Card variant="default">
        <Row className="mb-4">
          <Column>
            <Text className="text-2xl m-0">🚀</Text>
          </Column>
          <Column className="w-full pl-3">
            <Heading as="h2" className="mt-0 mb-0">Try Your First Coaching Conversation</Heading>
          </Column>
        </Row>

        <Paragraph>
          Think of a lesson you're teaching this week. Then:
        </Paragraph>

        <ListItem icon="number" number={1}>
          <strong>Log in to Pelican AI</strong> (link coming in your next email)
        </ListItem>
        <ListItem icon="number" number={2}>
          <strong>Start a conversation</strong> — just describe what you're teaching
        </ListItem>
        <ListItem icon="number" number={3}>
          <strong>Answer a few clarifying questions</strong> (like a colleague would ask)
        </ListItem>
        <ListItem icon="number" number={4}>
          <strong>Get a Louisiana-aligned prompt</strong> you can copy/paste into any AI tool
        </ListItem>

        <Text className="text-slate-100 text-base mt-6 mb-0 font-semibold bg-sky-900/30 rounded-lg p-4">
          That's it. The conversation should feel natural, not like filling out a form.
        </Text>
      </Card>

      <Divider />

      {/* Timeline */}
      <Heading as="h2">📅 What Happens Next</Heading>

      <Section className="mt-6">
        <TimelineItem
          title="Today"
          description="Your login link is coming in a separate email"
          isActive
        />
        <TimelineItem
          title="This Week"
          description="Generate 2-3 prompts for real lessons you're teaching"
        />
        <TimelineItem
          title="Next Week"
          description="Use those prompts in your preferred AI tool and tell me how it went"
        />
        <TimelineItem
          title="Throughout December"
          description="Help me understand what makes coaching feel intelligent vs. robotic"
        />
      </Section>

      <Divider />

      {/* What We're Testing */}
      <Card variant="highlight">
        <Row className="mb-4">
          <Column>
            <Text className="text-2xl m-0">📚</Text>
          </Column>
          <Column className="w-full pl-3">
            <Heading as="h2" className="mt-0 mb-0">What We're Testing</Heading>
          </Column>
        </Row>

        <Paragraph>
          <strong>Primary Question:</strong> Does the conversational coaching experience
          feel like an intelligent colleague who understands Louisiana education?
        </Paragraph>

        <Text className="text-slate-100 text-base font-semibold mb-3">
          What Makes a Good Prompt Coach:
        </Text>

        <ListItem icon="check">Asks clarifying questions like a colleague, not a form</ListItem>
        <ListItem icon="check">Demonstrates knowledge of Louisiana standards, LER indicators, and LEADS</ListItem>
        <ListItem icon="check">Generates prompts that actually work in your preferred AI tool</ListItem>
        <ListItem icon="check">Feels authentic and teacher-to-teacher, not corporate EdTech</ListItem>
      </Card>

      {/* Personal Appeal */}
      <Section className="bg-slate-700 rounded-xl p-6 mt-8">
        <Heading as="h3" className="mt-0">💬 Real Talk</Heading>
        <Paragraph className="mb-4">
          With 5 beta testers, your feedback literally shapes everything. Did the coach
          ask the right clarifying questions? Did the generated prompt actually help?
          Tell me honestly—that's how we build something Louisiana teachers actually want to use.
        </Paragraph>
        <Paragraph className="mb-0">
          <strong>Questions? Confusion? Ideas?</strong> Just reply to this email.
          This is grassroots—we're building it together.
        </Paragraph>
      </Section>

      <Paragraph className="mt-8">Thanks for being one of the first 5,</Paragraph>
      <Signature />
    </BaseEmailTemplate>
  );
}

export default BetaWelcomeEmail;
