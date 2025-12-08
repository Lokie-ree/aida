/**
 * GRASSROOTS LAUNCH NOTE:
 *
 * This email template is for COLD OUTREACH and is NOT used for the initial
 * 5-user grassroots launch (personal invitations only).
 *
 * This template will be useful when scaling to 30-100 users and reaching out
 * to educators we don't personally know. For now, it's kept in the codebase
 * for future use but is not actively used.
 *
 * Status: DEPRIORITIZED for 5-user launch, READY for scaling phase
 */

import { Row, Column, Section, Text } from "@react-email/components";
import {
  BaseEmailTemplate,
  Heading,
  Paragraph,
  Card,
  HighlightBox,
  CTAButton,
  ListItem,
  Testimonial,
  Signature,
  Feature,
} from "./BaseEmailTemplate";

interface OutreachEmailProps {
  recipientName?: string;
  districtName?: string;
  schoolName?: string;
}

export function OutreachEmail({
  recipientName = "Louisiana Educator",
  districtName,
  schoolName,
}: OutreachEmailProps) {
  const locationContext =
    districtName || schoolName
      ? `at ${schoolName || districtName}`
      : "in Louisiana";

  return (
    <BaseEmailTemplate
      previewText="AI Guidance Built for Louisiana Educators - Beta Invitation"
      headerTitle="AI Guidance Built for Louisiana Educators"
      headerSubtitle="Beta Program Invitation"
      variant="default"
    >
      <Paragraph>Hi {recipientName},</Paragraph>

      <Paragraph>
        Are you spending too much time on lesson planning, email drafting, and
        administrative tasks when you'd rather focus on teaching your students?
      </Paragraph>

      <Paragraph>
        <strong>Pelican AI</strong> is a platform-agnostic guidance system
        designed specifically for Louisiana educators like you {locationContext}.
        We help you use <strong>ANY AI tool</strong> your district provides—
        MagicSchool AI, Brisk, SchoolAI, Gemini, ChatGPT—more efficiently and
        effectively.
      </Paragraph>

      {/* Value Proposition */}
      <Card variant="default">
        <Heading as="h2" className="mt-0">💡 Save 3-5 Hours Per Week</Heading>
        <Paragraph>
          Our conversational coaching assistant helps you generate Louisiana-aligned prompts that save real time:
        </Paragraph>
        <ListItem icon="check">
          <strong>Lesson Planning:</strong> Describe your lesson, get a prompt that helps you unpack Louisiana standards and create differentiated objectives in 3 minutes instead of 10-15 minutes
        </ListItem>
        <ListItem icon="check">
          <strong>Parent Communication:</strong> Tell our coach what you need, get a prompt that helps you draft professional emails in 5 minutes instead of 20 minutes
        </ListItem>
        <ListItem icon="check">
          <strong>Differentiation:</strong> Share your challenge, get a prompt that helps you create leveled activities aligned to Louisiana Educator Rubric expectations
        </ListItem>
        <Paragraph className="mt-4 mb-0">
          Every generated prompt aligns with Louisiana standards and includes ethical
          guardrails for responsible AI use.
        </Paragraph>
      </Card>

      {/* Louisiana-Specific Value */}
      <HighlightBox>
        <Heading as="h2" className="mt-0">🎯 Built for Louisiana Educators</Heading>
        <Paragraph>Unlike generic AI tools, Pelican AI understands:</Paragraph>
        <ListItem icon="bullet">
          Louisiana state standards and curriculum expectations
        </ListItem>
        <ListItem icon="bullet">
          Louisiana Educator Rubric (LER) domains and requirements
        </ListItem>
        <ListItem icon="bullet">Louisiana LEADS framework alignment</ListItem>
        <ListItem icon="bullet">District-level policies and priorities</ListItem>
        <Paragraph className="mt-4 mb-0">
          Our conversational coach doesn't just give you generic prompts—it asks clarifying questions
          like a colleague would, then generates Louisiana-aligned prompts that help you navigate AI
          confidently while maintaining academic integrity.
        </Paragraph>
      </HighlightBox>

      {/* Platform-Agnostic Emphasis */}
      <Card variant="default">
        <Row className="mb-3">
          <Column>
            <Text className="text-3xl m-0">🔌</Text>
          </Column>
          <Column className="w-full pl-3">
            <Heading as="h2" className="mt-0 mb-0">
              Works with ANY AI Tool
            </Heading>
          </Column>
        </Row>
        <Paragraph className="mb-0">
          We're not asking you to learn another platform. We teach you how to get
          better results from the AI tools your district already provides—whether
          that's MagicSchool AI, Brisk, SchoolAI, Gemini, or others.
        </Paragraph>
      </Card>

      {/* CTA */}
      <Section className="text-center my-8">
        <CTAButton href="https://pelicanai.org" size="lg">
          Join the Beta Program
        </CTAButton>
        <Text className="text-slate-500 text-sm mt-4 mb-0">
          As a beta tester, you'll get immediate platform access and help shape
          the future of AI guidance for Louisiana educators.
        </Text>
      </Section>

      {/* Social Proof */}
      <Testimonial
        quote="The Lesson Objective Unpacker saves me 7-12 minutes per lesson. That's 35-60 minutes per week just on objectives!"
        author="Louisiana High School Teacher"
      />

      <Paragraph>
        Questions? Just reply to this email. We're here to help Louisiana
        educators reclaim their time.
      </Paragraph>

      <Signature
        name="The Pelican AI Team"
        title="Built by Louisiana educators, for Louisiana educators"
      />
    </BaseEmailTemplate>
  );
}

export default OutreachEmail;
