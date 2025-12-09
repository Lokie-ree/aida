import { Section, Text } from "@react-email/components";
import {
  BaseEmailTemplate,
  Paragraph,
  CTAButton,
  Signature,
} from "./BaseEmailTemplate";

interface MagicLinkEmailProps {
  url: string;
  name?: string;
}

export function MagicLinkEmail({
  url,
  name = "Educator",
}: MagicLinkEmailProps) {
  return (
    <BaseEmailTemplate
      previewText="Your Pelican AI sign-in link (expires in 5 min)"
      headerTitle="Sign In to Pelican AI"
      headerSubtitle="Your secure link is ready"
      headerEmoji="🔐"
      variant="minimal"
    >
      <Paragraph>Hey {name}! 👋</Paragraph>

      <Paragraph>
        Click the button below to sign in and start creating Louisiana-aligned prompts
        with our conversational coach.
      </Paragraph>

      {/* Magic Link CTA */}
      <Section className="text-center my-8 py-8 px-6 bg-sky-900/30 rounded-2xl border border-sky-700">
        <CTAButton href={url} size="lg">
          Sign In to Pelican AI
        </CTAButton>
        <Text className="text-slate-300 text-sm mt-4 mb-0">
          This link will expire in 5 minutes.
        </Text>
      </Section>

      <Paragraph className="text-slate-200 text-sm">
        Questions? Just reply—I read every one.
      </Paragraph>

      <Signature />
    </BaseEmailTemplate>
  );
}

export default MagicLinkEmail;

