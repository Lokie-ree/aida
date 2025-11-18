import {
  Heading,
  Section,
  Text,
} from "@react-email/components";
import { BaseEmailTemplate, InfoBox, HighlightBox, CTAButton, SecondaryButton, textStyles } from "./BaseEmailTemplate";

interface WeeklyPromptEmailProps {
  userName: string;
  frameworkTitle: string;
  frameworkId: string;
  samplePrompt: string;
  timeEstimate: number;
  difficultyLevel: string;
  weekNumber: number;
}

export const WeeklyPromptEmail = ({
  userName = "Educator",
  frameworkTitle = "Lesson Objective Unpacker & Success Criteria Builder",
  frameworkId = "AIB-001",
  samplePrompt = "Act as a compassionate and professional [grade level] [subject] teacher...",
  timeEstimate = 3,
  difficultyLevel = "beginner",
  weekNumber = 1,
}: WeeklyPromptEmailProps) => {
  const previewText = `Week ${weekNumber}: ${frameworkTitle} - Navigate AI with Confidence`;

  return (
    <BaseEmailTemplate
      previewText={previewText}
      headerTitle={`Week ${weekNumber}: Your Louisiana Educator AI Prompt`}
    >
      <Text style={textStyles.paragraph}>Hi {userName},</Text>
      
      <Text style={textStyles.paragraph}>
        <strong>Week {weekNumber} Framework:</strong> This week's framework is designed to 
        save you time on a common Louisiana educator task using ANY AI tool you already use.
      </Text>

      <Text style={textStyles.paragraph}>
        <strong>Platform-Agnostic:</strong> Works with ChatGPT, Gemini, MagicSchool AI, 
        SchoolAI, Brisk, or any other AI tool your district provides. Copy-paste the prompt below.
      </Text>

      {/* Framework Card */}
      <Section style={frameworkCard}>
        <div style={frameworkHeader}>
          <Text style={frameworkIdStyle}>{frameworkId}</Text>
          <div style={frameworkBadges}>
            <span style={badge}>{difficultyLevel}</span>
            <span style={badge}>{timeEstimate} min</span>
          </div>
        </div>
        
        <Heading style={frameworkTitleStyle}>{frameworkTitle}</Heading>
        
        <Text style={frameworkDescription}>
          <strong>The Challenge:</strong> This framework addresses a common Louisiana educator pain point.
        </Text>
        
        <Text style={frameworkDescription}>
          <strong>The Solution:</strong> Copy the prompt below and paste it into ANY AI tool you use.
        </Text>
        
        <Section style={promptBox}>
          <Text style={promptText}>{samplePrompt}</Text>
        </Section>
        
        <Text style={ethicalGuardrail}>
          <strong>Ethical Guardrail:</strong> AI is a drafting assistant. The final output, 
          professional judgment, and accountability are always yours. Always review and 
          personalize any AI-generated content.
        </Text>
        
        <CTAButton href="https://pelicanai.org/frameworks">
          View Full Framework
        </CTAButton>
      </Section>

      <Text style={textStyles.paragraph}>
        <strong>Real Talk:</strong> Try this framework this week and tell me honestly—did it save 
        you time or waste it? Your feedback literally shapes what we build next. With 5 users, 
        every data point matters.
      </Text>

      {/* Grassroots Feedback */}
      <InfoBox>
        <Heading style={textStyles.h2}>Your Feedback Shapes Everything</Heading>
        <Text style={textStyles.paragraph}>
          <strong>We're Not Waiting for LDOE.</strong> Louisiana educators are building 
          practical AI guidance NOW. You're one of 5 educators starting this with me.
        </Text>
        <Text style={textStyles.paragraph}>
          <strong>Just reply to this email:</strong> Did this save you time? Confuse you? 
          What would make it better? With 5 users, every piece of feedback literally shapes 
          what we build next.
        </Text>
      </InfoBox>
    </BaseEmailTemplate>
  );
};

// Styles specific to this email template
const frameworkCard = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const frameworkHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const frameworkIdStyle = {
  color: "#6b7280",
  fontSize: "14px",
  fontFamily: "monospace",
  margin: 0,
};

const frameworkBadges = {
  display: "flex",
  gap: "8px",
};

const badge = {
  backgroundColor: "#e5e7eb",
  color: "#374151",
  fontSize: "12px",
  fontWeight: "500",
  padding: "4px 8px",
  borderRadius: "4px",
};

const frameworkTitleStyle = {
  color: "#1e40af",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const frameworkDescription = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 16px",
};

const promptBox = {
  backgroundColor: "#ffffff",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  padding: "16px",
  margin: "16px 0",
};

const promptText = {
  color: "#374151",
  fontSize: "14px",
  fontFamily: "monospace",
  lineHeight: "20px",
  margin: 0,
  whiteSpace: "pre-wrap" as const,
};

const ethicalGuardrail = {
  backgroundColor: "#fef3c7",
  border: "1px solid #f59e0b",
  borderRadius: "6px",
  padding: "12px",
  margin: "16px 0",
  color: "#92400e",
  fontSize: "14px",
  fontStyle: "italic",
};

export default WeeklyPromptEmail;
