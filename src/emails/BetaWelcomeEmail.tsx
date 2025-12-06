import {
  Heading,
  Link,
  Text,
} from "@react-email/components";
import { BaseEmailTemplate, Card, textStyles } from "./BaseEmailTemplate";

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
      previewText="Welcome to Pelican AI - Your Louisiana Coaching Assistant"
      headerTitle="Welcome to Pelican AI Beta"
      headerSubtitle="Intelligent coaching for Louisiana teachers"
    >
      <Text style={textStyles.paragraph}>Hi {name},</Text>

      <Text style={textStyles.paragraph}>
        You're one of 5 Louisiana educators helping shape Pelican AI—an intelligent
        coaching assistant that helps you generate Louisiana-aligned prompts for ANY
        AI tool you already use (ChatGPT, Claude, Gemini, etc.).
      </Text>

      <Text style={textStyles.paragraph}>
        <strong>This is NOT another AI tool to learn.</strong> It's a coaching layer
        that helps you use the tools you already have more effectively, with Louisiana-specific
        intelligence built in (LER, LSS, LEADS).
      </Text>

      {/* Try It Now Card */}
      <Card>
        <Heading style={textStyles.h2}>🎯 Try Your First Coaching Conversation</Heading>
        <Text style={textStyles.paragraph}>
          Think of a lesson you're teaching this week. Then:
        </Text>
        <Text style={listItem}>
          <strong>1. Log in to Pelican AI</strong> (link coming in your next email)
        </Text>
        <Text style={listItem}>
          <strong>2. Start a conversation</strong> - just describe what you're teaching
        </Text>
        <Text style={listItem}>
          <strong>3. Answer a few clarifying questions</strong> (like a colleague would ask)
        </Text>
        <Text style={listItem}>
          <strong>4. Get a Louisiana-aligned prompt</strong> you can copy/paste into ChatGPT, Claude, or any AI tool
        </Text>
        <Text style={textStyles.paragraph}>
          <strong>That's it.</strong> The conversation should feel natural, not like filling out a form.
        </Text>
      </Card>

      {/* What's Next */}
      <Heading style={textStyles.h2}>What Happens Next?</Heading>
      <Text style={listItem}>
        • <strong>Today:</strong> Your login link is coming in a separate email
      </Text>
      <Text style={listItem}>
        • <strong>This Week:</strong> Generate 2-3 prompts for real lessons you're teaching
      </Text>
      <Text style={listItem}>
        • <strong>Next Week:</strong> Use those prompts in your preferred AI tool and tell me how it went
      </Text>
      <Text style={listItem}>
        • <strong>Throughout December:</strong> Help me understand what makes the coaching feel intelligent vs. robotic
      </Text>

      {/* What We're Testing */}
      <Card>
        <Heading style={textStyles.h2}>📚 What We're Testing</Heading>
        <Text style={textStyles.paragraph}>
          <strong>Primary Question:</strong> Does the conversational coaching experience feel
          like an intelligent colleague who understands Louisiana education?
        </Text>
        <Text style={textStyles.paragraph}>
          <strong>What Makes a Good Prompt Coach:</strong>
        </Text>
        <Text style={listItem}>
          ✓ Asks clarifying questions like a colleague, not a form
        </Text>
        <Text style={listItem}>
          ✓ Demonstrates knowledge of Louisiana standards, LER indicators, and LEADS
        </Text>
        <Text style={listItem}>
          ✓ Generates prompts that actually work in your preferred AI tool
        </Text>
        <Text style={listItem}>
          ✓ Feels authentic and teacher-to-teacher, not corporate EdTech
        </Text>
      </Card>

      {/* Real Talk */}
      <Text style={textStyles.paragraph}>
        <strong>Real Talk:</strong> With 5 beta testers, your feedback literally shapes
        everything. Did the coach ask the right clarifying questions? Did the generated
        prompt actually help? Tell me honestly—that's how we build something Louisiana
        teachers actually want to use.
      </Text>

      <Text style={textStyles.paragraph}>
        <strong>Questions? Confusion? Ideas?</strong> Just reply to this email. This is
        grassroots—we're building it together.
      </Text>

      <Text style={textStyles.paragraph}>
        Thanks for being one of the first 5,
        <br />
        Randall
        <br />
        <em>Louisiana educator building this for Louisiana educators</em>
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

export default BetaWelcomeEmail;
