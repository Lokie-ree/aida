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

import {
  Heading,
  Link,
  Text,
} from "@react-email/components";
import { BaseEmailTemplate, ActionBox, InfoBox, CTAButton, textStyles } from "./BaseEmailTemplate";

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
  const locationContext = districtName || schoolName ? `at ${schoolName || districtName}` : "in Louisiana";

  return (
    <BaseEmailTemplate
      previewText="AI Guidance Built for Louisiana Educators - Beta Invitation"
      headerTitle="AI Guidance Built for Louisiana Educators"
      headerSubtitle="Beta Program Invitation"
    >
      <Text style={textStyles.paragraph}>
        Hi {recipientName},
      </Text>

      <Text style={textStyles.paragraph}>
        Are you spending too much time on lesson planning, email drafting, and administrative tasks when you'd rather focus on teaching your students?
      </Text>

      <Text style={textStyles.paragraph}>
        <strong>Pelican AI</strong> is a platform-agnostic guidance system designed specifically for Louisiana educators like you {locationContext}. We help you use <strong>ANY AI tool</strong> your district provides—MagicSchool AI, Brisk, SchoolAI, Gemini, ChatGPT—more efficiently and effectively.
      </Text>

      {/* Value Proposition */}
      <ActionBox>
        <Heading style={textStyles.h2}>Save 3-5 Hours Per Week</Heading>
        <Text style={textStyles.paragraph}>
          Our AI guidance frameworks are designed to save you real time:
        </Text>
        <Text style={listItem}>
          ✓ <strong>Lesson Planning:</strong> Unpack Louisiana standards and create differentiated objectives in 3 minutes instead of 10-15 minutes
        </Text>
        <Text style={listItem}>
          ✓ <strong>Parent Communication:</strong> Draft professional emails in 5 minutes instead of 20 minutes
        </Text>
        <Text style={listItem}>
          ✓ <strong>Differentiation:</strong> Create leveled activities that meet Louisiana Educator Rubric expectations faster
        </Text>
        <Text style={textStyles.paragraph}>
          Every framework aligns with Louisiana standards and includes ethical guardrails for responsible AI use.
        </Text>
      </ActionBox>

      {/* Louisiana-Specific Value */}
      <InfoBox>
        <Heading style={textStyles.h2}>Built for Louisiana Educators, by Louisiana Educators</Heading>
        <Text style={textStyles.paragraph}>
          Unlike generic AI tools, Pelican AI understands:
        </Text>
        <Text style={listItem}>
          • Louisiana state standards and curriculum expectations
        </Text>
        <Text style={listItem}>
          • Louisiana Educator Rubric (LER) domains and requirements
        </Text>
        <Text style={listItem}>
          • Louisiana LEADS framework alignment
        </Text>
        <Text style={listItem}>
          • District-level policies and priorities
        </Text>
        <Text style={textStyles.paragraph}>
          Our guidance frameworks aren't just prompts—they're strategic frameworks that help you navigate AI confidently while maintaining academic integrity.
        </Text>
      </InfoBox>

      {/* Platform-Agnostic Emphasis */}
      <InfoBox>
        <Heading style={textStyles.h2}>Works with ANY AI Tool You Already Have</Heading>
        <Text style={textStyles.paragraph}>
          We're not asking you to learn another platform. We teach you how to get better results from the AI tools your district already provides—whether that's MagicSchool AI, Brisk, SchoolAI, Gemini, or others.
        </Text>
      </InfoBox>

      {/* CTA */}
      <div style={ctaSection}>
        <CTAButton href="https://pelicanai.org">
          Join the Beta Program
        </CTAButton>
        <Text style={textStyles.paragraph}>
          As a beta tester, you'll get immediate platform access and help shape the future of AI guidance for Louisiana educators.
        </Text>
      </div>

      {/* Social Proof */}
      <Text style={textStyles.paragraph}>
        <strong>What Louisiana educators are saying:</strong>
      </Text>
      <Text style={testimonialStyle}>
        "The Lesson Objective Unpacker saves me 7-12 minutes per lesson. That's 35-60 minutes per week just on objectives!"
      </Text>
      <Text style={testimonialAuthor}>
        — Louisiana High School Teacher
      </Text>

      <Text style={textStyles.paragraph}>
        Questions? Just reply to this email. We're here to help Louisiana educators reclaim their time.
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

const testimonialStyle = {
  color: "#1e40af",
  fontSize: "16px",
  fontStyle: "italic",
  lineHeight: "24px",
  margin: "16px 0 8px",
  padding: "16px",
  backgroundColor: "#eff6ff",
  borderLeft: "4px solid #0ea5e9",
};

const testimonialAuthor = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 16px",
  paddingLeft: "16px",
};

export default OutreachEmail;

