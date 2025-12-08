/**
 * GRASSROOTS LAUNCH NOTE:
 *
 * This email template is for NETWORK PARTNERSHIP OUTREACH and is NOT used for
 * the initial 5-user grassroots launch.
 *
 * This template will be useful when scaling beyond 100 users and establishing
 * partnerships with Louisiana education organizations (LDOE, parishes, professional
 * organizations). For now, it's kept in the codebase for future use but is not
 * actively used.
 *
 * Status: DEPRIORITIZED for 5-user launch, READY for partnership phase
 */

import { Section, Text } from "@react-email/components";
import {
  BaseEmailTemplate,
  Heading,
  Paragraph,
  Card,
  HighlightBox,
  CTAButton,
  ListItem,
  Signature,
} from "./BaseEmailTemplate";

interface NetworkPartnerEmailProps {
  organizationName?: string;
  contactName?: string;
}

export function NetworkPartnerEmail({
  organizationName = "Louisiana Education Organization",
  contactName = "Team",
}: NetworkPartnerEmailProps) {
  return (
    <BaseEmailTemplate
      previewText="Partner Opportunity: AI Guidance Platform for Louisiana Educators"
      headerTitle="Partner Opportunity"
      headerSubtitle="AI Guidance for Louisiana Educators"
      variant="default"
    >
      <Paragraph>Hi {contactName},</Paragraph>

      <Paragraph>
        I'm reaching out to {organizationName} because we share a common mission:
        supporting Louisiana educators as they navigate the challenges of modern
        teaching.
      </Paragraph>

      {/* Partnership Angle */}
      <HighlightBox>
        <Heading as="h2" className="mt-0">
          Pelican AI: Platform-Agnostic AI Guidance
        </Heading>
        <Paragraph>
          Pelican AI helps Louisiana educators use <strong>ANY AI tool</strong>{" "}
          their district provides more effectively. We're not another AI
          platform—we're a guidance system that teaches educators how to get
          better results from the tools they already have access to.
        </Paragraph>
        <Text className="text-slate-700 text-base font-semibold mb-3">
          What makes us different:
        </Text>
        <ListItem icon="bullet">
          <strong>Louisiana-specific:</strong> Aligned to state standards and
          Louisiana Educator Rubric
        </ListItem>
        <ListItem icon="bullet">
          <strong>Platform-agnostic:</strong> Works with MagicSchool AI, Brisk,
          SchoolAI, Gemini, ChatGPT, and others
        </ListItem>
        <ListItem icon="bullet">
          <strong>Time-saving:</strong> Helps educators reclaim 3-5 hours per week
        </ListItem>
        <ListItem icon="bullet">
          <strong>Ethical:</strong> Built-in guardrails for responsible AI use
        </ListItem>
      </HighlightBox>

      {/* Collaboration Benefits */}
      <Card variant="default">
        <Heading as="h2" className="mt-0">
          🤝 How We Can Support {organizationName} Members
        </Heading>

        <Text className="text-slate-700 text-base font-semibold mb-2 mt-4">
          For Your Members:
        </Text>
        <ListItem icon="check">
          Immediate access to our conversational coaching assistant that generates Louisiana-aligned prompts
        </ListItem>
        <ListItem icon="check">
          Practical workshops on using AI effectively in Louisiana classrooms with any tool districts provide
        </ListItem>
        <ListItem icon="check">
          Co-creation opportunities to shape the coaching experience based on member needs
        </ListItem>
        <ListItem icon="check">
          Platform-agnostic approach (works with any AI tool districts provide—ChatGPT, Claude, Gemini, MagicSchool AI, etc.)
        </ListItem>

        <Text className="text-slate-700 text-base font-semibold mb-2 mt-6">
          For {organizationName}:
        </Text>
        <ListItem icon="check">Co-branded resources and materials</ListItem>
        <ListItem icon="check">
          Custom coaching experiences tailored to your members' specific needs
        </ListItem>
        <ListItem icon="check">
          Analytics and insights on how members benefit from the platform
        </ListItem>
        <ListItem icon="check">Joint professional development opportunities</ListItem>
      </Card>

      {/* Beta Program Invitation */}
      <Card variant="action">
        <Heading as="h2" className="mt-0">🚀 Beta Program Launch</Heading>
        <Paragraph>
          We're launching our beta program now and would love to include{" "}
          {organizationName} members as early participants. Beta testers get:
        </Paragraph>
        <ListItem icon="star">Immediate platform access</ListItem>
        <ListItem icon="star">Direct influence on coaching experience development</ListItem>
        <ListItem icon="star">Priority support and feedback opportunities</ListItem>
        <ListItem icon="star">Early access to new features as they're developed</ListItem>
      </Card>

      {/* Partnership Inquiry */}
      <Section className="text-center my-8">
        <Paragraph className="text-center">
          We'd love to explore how Pelican AI can support your members'
          professional growth. Would you be open to a brief conversation about
          potential collaboration?
        </Paragraph>
        <CTAButton href="https://pelicanai.org" size="lg">
          Schedule a Conversation
        </CTAButton>
        <Text className="text-slate-500 text-sm mt-4 mb-0">
          Or simply reply to this email to discuss partnership opportunities.
        </Text>
      </Section>

      {/* Value Proposition for Organization */}
      <Card variant="highlight">
        <Heading as="h2" className="mt-0">
          Why Louisiana Education Organizations Partner with Us
        </Heading>
        <Paragraph>
          We understand that Louisiana educators face unique challenges:
        </Paragraph>
        <ListItem icon="bullet">
          Aligning with Louisiana state standards and LER rubric requirements
        </ListItem>
        <ListItem icon="bullet">
          Working within district-imposed AI tool constraints
        </ListItem>
        <ListItem icon="bullet">
          Balancing innovation with academic integrity
        </ListItem>
        <Paragraph className="mt-4 mb-0">
          Our conversational coaching assistant addresses these challenges directly, helping Louisiana educators
          generate better prompts that make AI more practical and accessible.
        </Paragraph>
      </Card>

      <Paragraph className="mt-6">
        I'd welcome the opportunity to discuss how Pelican AI can support{" "}
        {organizationName} and your members.
      </Paragraph>

      <Signature
        name="The Pelican AI Team"
        title="Built by Louisiana educators, for Louisiana educators"
      />
    </BaseEmailTemplate>
  );
}

export default NetworkPartnerEmail;
