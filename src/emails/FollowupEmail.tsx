import {
  Heading,
  Link,
  Text,
} from "@react-email/components";
import { BaseEmailTemplate, ActionBox, InfoBox, CTAButton, textStyles } from "./BaseEmailTemplate";

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
    >
      <Text style={textStyles.paragraph}>
        Hi {recipientName},
      </Text>

      <Text style={textStyles.paragraph}>
        I wanted to follow up briefly about Pelican AI—we're launching our beta program specifically for Louisiana educators, and I thought you might be interested.
      </Text>

      {/* Light Touch Value Focus */}
      <InfoBox>
        <Heading style={textStyles.h2}>3 Ways Pelican AI Helps Louisiana Educators</Heading>
        <Text style={listItem}>
          <strong>1. Save Time:</strong> 3-5 hours per week on planning and prep tasks
        </Text>
        <Text style={listItem}>
          <strong>2. Louisiana-Aligned:</strong> Every framework aligns with Louisiana standards and the LER rubric
        </Text>
        <Text style={listItem}>
          <strong>3. Platform-Agnostic:</strong> Works with ANY AI tool—MagicSchool AI, Brisk, SchoolAI, Gemini, etc.
        </Text>
      </InfoBox>

      {/* Real Example */}
      <ActionBox>
        <Heading style={textStyles.h2}>Try This Example Right Now</Heading>
        <Text style={textStyles.paragraph}>
          Copy this prompt and paste it into any AI tool you have access to:
        </Text>
        <Text style={promptBox}>
          "Act as a Louisiana curriculum specialist. Analyze this Louisiana state standard and help me unpack it for lesson planning:
          <br /><br />
          **Standard:** [Paste your standard here]
          <br />
          **Grade Level:** [Your grade]
          <br />
          **Subject:** [Your subject]
          <br /><br />
          Please provide:
          1. A clear explanation in student-friendly language
          2. Three differentiated 'I can' statements (approaching, meeting, exceeding)
          3. Key vocabulary students need
          4. Potential misconceptions"
        </Text>
        <Text style={textStyles.paragraph}>
          This framework saves 7-12 minutes per lesson. With 5-10 lessons per week, that's 35-120 minutes saved.
        </Text>
      </ActionBox>

      {/* Social Proof */}
      <InfoBox>
        <Heading style={textStyles.h2}>What Louisiana Educators Are Saying</Heading>
        <Text style={testimonialStyle}>
          "I finally feel confident using AI tools. The Louisiana-specific guidance makes all the difference."
        </Text>
        <Text style={testimonialAuthor}>
          — Middle School Teacher, Jefferson Parish
        </Text>
      </InfoBox>

      {/* Soft CTA */}
      <div style={ctaSection}>
        <Text style={textStyles.paragraph}>
          If this sounds helpful, we'd love to have you in our beta program:
        </Text>
        <CTAButton href="https://pelicanai.org">
          Learn More & Join Beta
        </CTAButton>
        <Text style={smallText}>
          Or simply reply to this email if you have questions.
        </Text>
      </div>

      <Text style={textStyles.paragraph}>
        Best,
        <br />
        The Pelican AI Team
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

const promptBox = {
  color: "#1e40af",
  fontSize: "14px",
  fontFamily: "monospace",
  lineHeight: "20px",
  margin: "16px 0",
  padding: "16px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const testimonialStyle = {
  color: "#1e40af",
  fontSize: "16px",
  fontStyle: "italic",
  lineHeight: "24px",
  margin: "16px 0 8px",
};

const testimonialAuthor = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 16px",
};

const smallText = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "16px 0 0",
};

export default FollowupEmail;

