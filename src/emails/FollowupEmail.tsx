/**
 * GRASSROOTS LAUNCH NOTE:
 *
 * This email template is for COLD FOLLOW-UP and is NOT used for the initial
 * 5-user grassroots launch (personal conversations instead of automated follow-ups).
 *
 * This template will be useful when scaling to 30-100 users and following up with
 * educators who showed interest but haven't engaged. For now, it's kept in the
 * codebase for future use but is not actively used.
 *
 * Status: DEPRIORITIZED for 5-user launch, READY for scaling phase
 */

import { Section, Text } from "@react-email/components";
import {
  BaseEmailTemplate,
  Heading,
  Paragraph,
  Card,
  CTAButton,
  PromptBox,
  ListItem,
  Testimonial,
  Signature,
} from "./BaseEmailTemplate";

interface FollowupEmailProps {
  recipientName?: string;
}

export function FollowupEmail({
  recipientName = "Louisiana Educator",
}: FollowupEmailProps) {
  return (
    <BaseEmailTemplate
      previewText="Quick Follow-up: AI Guidance for Louisiana Educators"
      headerTitle="Quick Follow-up"
      headerSubtitle="AI Guidance for Louisiana Educators"
      variant="minimal"
    >
      <Paragraph>Hi {recipientName},</Paragraph>

      <Paragraph>
        I wanted to follow up briefly about Pelican AI—we're launching our beta
        program specifically for Louisiana educators, and I thought you might be
        interested.
      </Paragraph>

      {/* Light Touch Value Focus */}
      <Card variant="default">
        <Heading as="h2" className="mt-0">
          3 Ways Pelican AI Helps Louisiana Educators
        </Heading>
        <ListItem icon="number" number={1}>
          <strong>Conversational Coach:</strong> Just describe what you're teaching, and our AI coach asks clarifying questions like a colleague—then generates Louisiana-aligned prompts
        </ListItem>
        <ListItem icon="number" number={2}>
          <strong>Louisiana-Aligned:</strong> Every generated prompt demonstrates knowledge of Louisiana standards, the LER rubric, and LEADS framework
        </ListItem>
        <ListItem icon="number" number={3}>
          <strong>Platform-Agnostic:</strong> Works with ANY AI tool—ChatGPT, Claude, Gemini, MagicSchool AI, Brisk, or whatever your district provides
        </ListItem>
      </Card>

      {/* Real Example */}
      <Card variant="highlight">
        <Heading as="h2" className="mt-0">🧪 Try This Example Right Now</Heading>
        <Paragraph>
          Here's a sample Louisiana-aligned prompt you can copy and paste into any AI tool you have access to:
        </Paragraph>

        <PromptBox>
          {`"Act as a Louisiana curriculum specialist. Analyze this Louisiana state standard and help me unpack it for lesson planning:

**Standard:** [Paste your standard here]
**Grade Level:** [Your grade]
**Subject:** [Your subject]

Please provide:
1. A clear explanation in student-friendly language
2. Three differentiated 'I can' statements (approaching, meeting, exceeding)
3. Key vocabulary students need
4. Potential misconceptions"`}
        </PromptBox>

        <Paragraph>
          <strong>Or better yet:</strong> Use our conversational coach! Just describe what you're teaching,
          and it will ask clarifying questions and generate a prompt tailored to your specific context.
        </Paragraph>
        <Paragraph className="mb-0">
          This approach saves 7-12 minutes per lesson. With 5-10 lessons per week,
          that's <strong>35-120 minutes saved</strong>.
        </Paragraph>
      </Card>

      {/* Social Proof */}
      <Testimonial
        quote="I finally feel confident using AI tools. The Louisiana-specific guidance makes all the difference."
        author="Middle School Teacher"
        role="Jefferson Parish"
      />

      {/* Soft CTA */}
      <Section className="text-center my-8">
        <Text className="text-slate-700 text-base mb-4">
          If this sounds helpful, we'd love to have you in our beta program:
        </Text>
        <CTAButton href="https://pelicanai.org">Learn More & Join Beta</CTAButton>
        <Text className="text-slate-500 text-sm mt-4 mb-0">
          Or simply reply to this email if you have questions.
        </Text>
      </Section>

      <Signature name="The Pelican AI Team" title="Built by Louisiana educators, for Louisiana educators" />
    </BaseEmailTemplate>
  );
}

export default FollowupEmail;
