import { Section, Text } from "@react-email/components";
import {
  BaseEmailTemplate,
  Heading,
  Paragraph,
  Card,
  CTAButton,
  Signature,
} from "./BaseEmailTemplate";

interface ApprovalNotificationEmailProps {
  name?: string;
  siteUrl?: string;
}

export function ApprovalNotificationEmail({
  name = "Educator",
  siteUrl = "https://pelicanai.org",
}: ApprovalNotificationEmailProps) {
  return (
    <BaseEmailTemplate
      previewText="You're in! Sign in to Pelican AI"
      headerTitle={`Welcome, ${name}!`}
      headerSubtitle="Your beta access has been approved"
      headerEmoji="🎉"
      variant="celebration"
    >
      <Paragraph>Hey {name}! 👋</Paragraph>

      <Paragraph>
        <strong>Great news—your beta access has been approved!</strong>
      </Paragraph>

      <Paragraph>
        You're one of a small group of Louisiana educators helping shape Pelican AI.
        Your feedback will directly influence how this tool supports teachers across the state.
      </Paragraph>

      {/* CTA Card */}
      <Card variant="default">
        <Heading as="h2" className="mt-0">Ready to Get Started?</Heading>
        <Paragraph>
          Click the button below to sign in. On the sign-in page, enter your email address
          and we'll send you a secure link to access your account.
        </Paragraph>

        <Section className="text-center mt-6">
          <CTAButton href={siteUrl} size="lg">
            Sign In to Pelican AI
          </CTAButton>
        </Section>
      </Card>

      {/* What to Expect */}
      <Section className="bg-slate-700 rounded-xl p-6 mt-8">
        <Heading as="h3" className="mt-0">What to Expect</Heading>
        <Paragraph className="mb-0">
          Once you're in, you'll have access to our conversational coaching assistant.
          Just describe what you're teaching, and our AI coach asks clarifying questions
          like a colleague would—then generates Louisiana-aligned prompts you can use
          in any AI tool (ChatGPT, Claude, Gemini, etc.).
        </Paragraph>
      </Section>

      <Paragraph className="mt-8 text-slate-200 text-sm">
        Questions? Just reply to this email—I read every one.
      </Paragraph>

      <Signature />
    </BaseEmailTemplate>
  );
}

export default ApprovalNotificationEmail;

