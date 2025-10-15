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
        Welcome to Week {weekNumber} of your Pelican AI journey! This week's Atomic Note 
        is designed to help you save time on a common Louisiana educator task using 
        ANY AI platform you have access to.
      </Text>

      <Text style={textStyles.paragraph}>
        <strong>Remember:</strong> This guidance works with MagicSchool AI, Brisk, 
        SchoolAI, Gemini, ChatGPT, or any other AI tool your district provides.
      </Text>

      {/* Atomic Note Card */}
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
          <strong>The Challenge:</strong> This Atomic Note addresses a common Louisiana educator pain point.
        </Text>
        
        <Text style={frameworkDescription}>
          <strong>The AI-Powered Solution:</strong> Copy the prompt below and paste it into your 
          preferred AI platform (MagicSchool AI, Brisk, SchoolAI, Gemini, etc.)
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
          View Full Atomic Note
        </CTAButton>
      </Section>

      <Text style={textStyles.paragraph}>
        <strong>Louisiana Educator Pro Tip:</strong> Try this framework with 2-3 different lessons 
        this week and let us know how much time you saved! Your experience helps us understand 
        what's working and what you need next.
      </Text>

      <Text style={textStyles.paragraph}>
        <strong>Co-Creation Reminder:</strong> This week's check-in survey will ask about your biggest 
        pain points. Your answers drive what we build next—this is YOUR beta program, and we're building 
        the frameworks YOU actually need!
      </Text>

      {/* Feedback Forms */}
      <InfoBox>
        <Heading style={textStyles.h2}>Share Your Experience</Heading>
        <Text style={textStyles.paragraph}>
          Help us improve by sharing your experience with this framework:
        </Text>
        <CTAButton href="https://forms.gle/VhY3qexkgsGLNTu59">
          Framework Feedback Form
        </CTAButton>
        <SecondaryButton href="https://forms.gle/gqGTj3j5AKKSN9iD6">
          Weekly Check-in Survey
        </SecondaryButton>
      </InfoBox>

      {/* Phase 1 MVP Focus */}
      <HighlightBox>
        <Heading style={textStyles.h2}>Phase 1 MVP: Email-First Approach</Heading>
        <Text style={textStyles.paragraph}>
          You're part of our Phase 1 MVP validation! We're testing whether an email-first 
          approach can successfully deliver immediate value to Louisiana educators.
        </Text>
        <Text style={textStyles.paragraph}>
          <strong>Your feedback matters:</strong> Reply to this email with your experience 
          using this Atomic Note. Did it save you time? How did it align with Louisiana standards?
        </Text>
      </HighlightBox>

      {/* Future Features Preview */}
      <InfoBox>
        <Heading style={textStyles.h2}>Coming in Phase 2</Heading>
        <Text style={textStyles.paragraph}>
          Based on your feedback, we're building a web-based framework library and 
          community features. Your input as a Phase 1 beta tester directly shapes 
          what comes next.
        </Text>
        <Text style={textStyles.paragraph}>
          <strong>Phase 2 Preview:</strong> Searchable framework library, community 
          sharing, and personalized dashboard.
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
