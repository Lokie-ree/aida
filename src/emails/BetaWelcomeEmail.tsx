import {
  Heading,
  Link,
  Text,
} from "@react-email/components";
import { BaseEmailTemplate, ActionBox, InfoBox, HighlightBox, CTAButton, textStyles } from "./BaseEmailTemplate";

interface BetaWelcomeEmailProps {
  name?: string;
  school?: string;
}

export function BetaWelcomeEmail({
  name = "Educator",
  school,
}: BetaWelcomeEmailProps) {
  return (
    <BaseEmailTemplate
      previewText="Ready to dive in? - Pelican AI"
      headerTitle="You're one of 5 educators building this together"
      headerSubtitle="Let's get started!"
    >
      <Text style={textStyles.paragraph}>Hi {name},</Text>

      <Text style={textStyles.paragraph}>
        You're one of 5 Louisiana educators I'm starting with. No formal beta 
        program, no complex onboarding—just practical AI guidance that works with 
        ANY tool you already use (ChatGPT, Gemini, MagicSchool AI, etc.).
      </Text>

      <Text style={textStyles.paragraph}>
        <strong>We're Not Waiting for LDOE.</strong> Louisiana educators need 
        confidence using AI NOW, not when official guidance arrives. That's why 
        we're building this together—platform-agnostic frameworks that save you 
        real time.
      </Text>


      {/* Immediate Action Box */}
      <ActionBox>
        <Heading style={textStyles.h2}>🎯 Try This Right Now (Seriously, Right Now)</Heading>
        <Text style={textStyles.paragraph}>
          Before you attend any training or read lengthy documentation, you can 
          use Pelican AI today. Here's how:
        </Text>
        <Text style={listItem}>
          <strong>1. Click this link</strong> → <Link href="https://docs.google.com/document/d/1yv9sBUXL84U1X1DQ0NxAILBrflGThOFbBePNv4uHUsc/edit" style={ctaLink}>
            Lesson Objective Unpacker & Success Criteria Builder
          </Link>
        </Text>
        <Text style={listItem}>
          <strong>2. Copy the sample prompt</strong> (it's ready to use)
        </Text>
        <Text style={listItem}>
          <strong>3. Paste it into ANY AI tool</strong> you have access to (MagicSchool AI, Gemini, ChatGPT, etc.)
        </Text>
        <Text style={listItem}>
          <strong>4. Unpack a lesson objective and create student-friendly success criteria in 3 minutes</strong> instead of 10-15 minutes
        </Text>
        <Text style={textStyles.paragraph}>
          <strong>That's it.</strong> You'll save 7-12 minutes on your very first try—and you do this for EVERY lesson you plan.
        </Text>
      </ActionBox>

      {/* What's Next Section */}
      <InfoBox>
        <Heading style={textStyles.h2}>What Happens Next?</Heading>
        <Text style={listItem}>
          • <strong>Today:</strong> Your platform access email is coming shortly with a login link
        </Text>
        <Text style={listItem}>
          • <strong>Right Now:</strong> Try the framework linked above—no need to wait!
        </Text>
        <Text style={listItem}>
          • <strong>This Week:</strong> Explore 10 frameworks designed for your role (see personalized recommendations below)
        </Text>
        <Text style={listItem}>
          • <strong>Your Feedback:</strong> Tell me honestly—did this save time or waste it? Your feedback literally shapes everything.
        </Text>
        <Text style={textStyles.paragraph}>
          <strong>No structured timeline. No pressure.</strong> Use what helps, tell me what doesn't. We're building this together.
        </Text>
      </InfoBox>

      {/* What You Get */}
      <HighlightBox>
        <Heading style={textStyles.h2}>📚 What You're Getting</Heading>
        <Text style={textStyles.paragraph}>
          <strong>10 Frameworks Ready to Use:</strong>
        </Text>
        <Text style={listItem}>
          ✓ <strong>3 Advanced Louisiana-Specific</strong> - Lesson alignment, curriculum internalization, contextualization
        </Text>
        <Text style={listItem}>
          ✓ <strong>7 Essential Productivity</strong> - Document summarization, email drafting, meeting notes, standards unpacking, misconceptions, rubrics
        </Text>
        <Text style={textStyles.paragraph}>
          <strong>Platform-Agnostic:</strong> Copy-paste into ANY AI tool you already use. No new platform to learn.
        </Text>
        <Text style={textStyles.paragraph}>
          <strong>Louisiana-Aligned:</strong> Every framework references Louisiana standards and educator rubric.
        </Text>
        <Text style={textStyles.paragraph}>
          <Link href="https://pelicanai.org/frameworks" style={ctaLink}>
            <strong>→ Browse All 10 Frameworks</strong>
          </Link>
        </Text>
      </HighlightBox>

      {/* Real Talk */}
      <Text style={textStyles.paragraph}>
        <strong>Real Talk:</strong> With 5 users, your feedback matters more than anything. 
        Did this framework save you 10 minutes or waste 5? Tell me. That's how we figure 
        out what actually works for Louisiana educators.
      </Text>

      <Text style={textStyles.paragraph}>
        <strong>Questions? Confusion? Ideas?</strong> Just reply to this email or text me. 
        This is grassroots—we're building it together.
      </Text>

      <Text style={textStyles.paragraph}>
        Thanks for being one of the 5 to start this with me,
        <br />
        Randall
        <br />
        <em>Louisiana educator building this for Louisiana educators</em>
      </Text>
    </BaseEmailTemplate>
  );
}

// Styles specific to this email template

const ctaLink = {
  color: "#0ea5e9",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "16px",
};

const listItem = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "8px 0",
};

const smallText = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "18px",
  margin: "8px 0 0",
};

export default BetaWelcomeEmail;

