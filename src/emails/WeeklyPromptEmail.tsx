import { Row, Column, Section, Text } from "@react-email/components";
import {
  BaseEmailTemplate,
  Heading,
  Paragraph,
  Card,
  CTAButton,
  PromptBox,
  Signature,
  Badge,
} from "./BaseEmailTemplate";

interface WeeklyPromptEmailProps {
  userName: string;
  promptTitle: string;
  samplePrompt: string;
  useCase: string;
  weekNumber: number;
}

export function WeeklyPromptEmail({
  userName = "Educator",
  promptTitle = "Lesson Objective Unpacker",
  samplePrompt = "Act as a compassionate and professional [grade level] [subject] teacher...",
  useCase = "Unpacking Louisiana standards and creating differentiated objectives",
  weekNumber = 1,
}: WeeklyPromptEmailProps) {
  const previewText = `Week ${weekNumber}: ${promptTitle} - Navigate AI with Confidence`;

  return (
    <BaseEmailTemplate
      previewText={previewText}
      headerTitle={`Week ${weekNumber}`}
      headerSubtitle="Your Louisiana-Aligned AI Prompt"
      headerEmoji="📬"
      variant="default"
    >
      <Paragraph>Hi {userName},</Paragraph>

      <Paragraph>
        <strong>Week {weekNumber} Prompt:</strong> Here's a Louisiana-aligned prompt you can use
        with ANY AI tool you already have—ChatGPT, Claude, Gemini, MagicSchool AI, or whatever your district provides.
      </Paragraph>

      <Paragraph>
        <strong>Platform-Agnostic:</strong> This prompt works with any AI tool. Just copy and paste it into
        whatever platform you're using. No new tools to learn.
      </Paragraph>

      {/* Prompt Card */}
      <Section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 my-8">
        {/* Title */}
        <Heading as="h2" className="mt-0 mb-4">{promptTitle}</Heading>

        {/* Description */}
        <Paragraph muted>
          <strong className="text-slate-700">Use Case:</strong> {useCase}
        </Paragraph>

        <Paragraph muted className="mb-6">
          <strong className="text-slate-700">How to Use:</strong> Copy the prompt below and paste it into ANY AI tool you use.
          The prompt is already aligned to Louisiana standards and the Louisiana Educator Rubric.
        </Paragraph>

        {/* Prompt Box */}
        <PromptBox label="Ready-to-use prompt">
          {samplePrompt}
        </PromptBox>

        {/* Ethical Guardrail */}
        <Section className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
          <Row>
            <Column className="w-8 align-top">
              <Text className="text-xl m-0">⚠️</Text>
            </Column>
            <Column className="pl-2">
              <Text className="text-amber-800 text-sm italic m-0 leading-relaxed">
                <strong className="not-italic">Ethical Guardrail:</strong> AI is a drafting assistant.
                The final output, professional judgment, and accountability are always yours.
                Always review and personalize any AI-generated content.
              </Text>
            </Column>
          </Row>
        </Section>

        {/* CTA */}
        <Section className="text-center mt-6">
          <CTAButton href="https://pelicanai.org/coach">
            Generate Your Own Prompt
          </CTAButton>
        </Section>
      </Section>

      <Paragraph>
        <strong>Want a Custom Prompt?</strong> Instead of using this template, try our conversational coach.
        Just describe what you're teaching, and our AI coach asks clarifying questions like a colleague would,
        then generates a Louisiana-aligned prompt tailored to your specific context.
      </Paragraph>

      {/* Grassroots Feedback */}
      <Card variant="highlight">
        <Heading as="h2" className="mt-0">Your Feedback Shapes Everything</Heading>
        <Paragraph>
          <strong>We're Not Waiting for LDOE.</strong> Louisiana educators are building
          practical AI guidance NOW. You're one of 5 educators starting this with me.
        </Paragraph>
        <Paragraph className="mb-0">
          <strong>Just reply to this email:</strong> Did this prompt work for you? Did the conversational coach
          ask the right questions? What would make it better? With 5 users, every piece of feedback literally shapes
          what we build next.
        </Paragraph>
      </Card>

      <Signature />
    </BaseEmailTemplate>
  );
}

export default WeeklyPromptEmail;
