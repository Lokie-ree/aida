import {
  Heading,
  Link,
  Text,
} from "@react-email/components";
import { BaseEmailTemplate, InfoBox, HighlightBox, CTAButton, textStyles } from "./BaseEmailTemplate";

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
    >
      <Text style={textStyles.paragraph}>
        Hi {contactName},
      </Text>

      <Text style={textStyles.paragraph}>
        I'm reaching out to {organizationName} because we share a common mission: supporting Louisiana educators as they navigate the challenges of modern teaching.
      </Text>

      {/* Partnership Angle */}
      <HighlightBox>
        <Heading style={textStyles.h2}>Pelican AI: Platform-Agnostic AI Guidance for Louisiana Educators</Heading>
        <Text style={textStyles.paragraph}>
          Pelican AI helps Louisiana educators use <strong>ANY AI tool</strong> their district provides more effectively. We're not another AI platform—we're a guidance system that teaches educators how to get better results from the tools they already have access to.
        </Text>
        <Text style={textStyles.paragraph}>
          <strong>What makes us different:</strong>
        </Text>
        <Text style={listItem}>
          • Louisiana-specific: Aligned to state standards and Louisiana Educator Rubric
        </Text>
        <Text style={listItem}>
          • Platform-agnostic: Works with MagicSchool AI, Brisk, SchoolAI, Gemini, ChatGPT, and others
        </Text>
        <Text style={listItem}>
          • Time-saving: Helps educators reclaim 3-5 hours per week
        </Text>
        <Text style={listItem}>
          • Ethical: Built-in guardrails for responsible AI use
        </Text>
      </HighlightBox>

      {/* Collaboration Benefits */}
      <InfoBox>
        <Heading style={textStyles.h2}>How We Can Support {organizationName} Members</Heading>
        <Text style={textStyles.paragraph}>
          <strong>For Your Members:</strong>
        </Text>
        <Text style={listItem}>
          ✓ Immediate access to 10+ AI guidance frameworks aligned to Louisiana standards
        </Text>
        <Text style={listItem}>
          ✓ Practical workshops on AI integration in Louisiana classrooms
        </Text>
        <Text style={listItem}>
          ✓ Co-creation opportunities to shape frameworks based on member needs
        </Text>
        <Text style={listItem}>
          ✓ Platform-agnostic approach (works with any AI tool districts provide)
        </Text>

        <Text style={textStyles.paragraph}>
          <strong>For {organizationName}:</strong>
        </Text>
        <Text style={listItem}>
          ✓ Co-branded resources and materials
        </Text>
        <Text style={listItem}>
          ✓ Custom frameworks tailored to your members' specific needs
        </Text>
        <Text style={listItem}>
          ✓ Analytics and insights on how members benefit from the platform
        </Text>
        <Text style={listItem}>
          ✓ Joint professional development opportunities
        </Text>
      </InfoBox>

      {/* Beta Program Invitation */}
      <ActionBox>
        <Heading style={textStyles.h2}>Beta Program Launch</Heading>
        <Text style={textStyles.paragraph}>
          We're launching our beta program now and would love to include {organizationName} members as early participants. Beta testers get:
        </Text>
        <Text style={listItem}>
          • Immediate platform access
        </Text>
        <Text style={listItem}>
          • Direct influence on framework development
        </Text>
        <Text style={listItem}>
          • Priority support and feedback opportunities
        </Text>
        <Text style={listItem}>
          • Early access to new frameworks as they're developed
        </Text>
      </ActionBox>

      {/* Partnership Inquiry */}
      <div style={ctaSection}>
        <Text style={textStyles.paragraph}>
          We'd love to explore how Pelican AI can support your members' professional growth. Would you be open to a brief conversation about potential collaboration?
        </Text>
        <CTAButton href="https://pelicanai.org">
          Schedule a Conversation
        </CTAButton>
        <Text style={smallText}>
          Or simply reply to this email to discuss partnership opportunities.
        </Text>
      </div>

      {/* Value Proposition for Organization */}
      <InfoBox>
        <Heading style={textStyles.h2}>Why Louisiana Education Organizations Partner with Us</Heading>
        <Text style={textStyles.paragraph}>
          We understand that Louisiana educators face unique challenges:
        </Text>
        <Text style={listItem}>
          • Aligning with Louisiana state standards and LER rubric requirements
        </Text>
        <Text style={listItem}>
          • Working within district-imposed AI tool constraints
        </Text>
        <Text style={listItem}>
          • Balancing innovation with academic integrity
        </Text>
        <Text style={textStyles.paragraph}>
          Our frameworks address these challenges directly, making AI more practical and accessible for Louisiana educators.
        </Text>
      </InfoBox>

      <Text style={textStyles.paragraph}>
        I'd welcome the opportunity to discuss how Pelican AI can support {organizationName} and your members.
      </Text>

      <Text style={textStyles.paragraph}>
        Best regards,
        <br />
        The Pelican AI Team
        <br />
        <em>Built by Louisiana educators, for Louisiana educators</em>
      </Text>
    </BaseEmailTemplate>
  );
}

// Styles specific to this email template
const listItem = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "8px 0",
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const smallText = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "16px 0 0",
};

export default NetworkPartnerEmail;

