import * as React from "react";
import {
  Heading,
  Link,
  Section,
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
      previewText="Welcome to Pelican AI Beta Program - Reclaim Your Time!"
      headerTitle="Welcome to the Beta Program!"
      headerSubtitle="Reclaim Your Time with Confidence"
    >
      <Text style={textStyles.paragraph}>Hi {name},</Text>

      <Text style={textStyles.paragraph}>
        I know you're managing a lot right now. Between lesson planning, 
        differentiating for diverse learners, analyzing data, and everything 
        else that fills your evenings and weekends, finding time for one more 
        thing feels impossible.
      </Text>

      <Text style={textStyles.paragraph}>
        That's exactly why Pelican AI exists. <strong>I'm committed to helping 
        you save 3-5 hours per week on planning and prep tasks</strong> so you can 
        focus on what matters most: teaching Louisiana students.
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
          • <strong>Immediately:</strong> Access the Lesson Objective Unpacker framework and start saving time today
        </Text>
        <Text style={listItem}>
          • <strong>Weeks 1-2:</strong> Master the Lesson Objective Unpacker with multiple lessons
        </Text>
        <Text style={listItem}>
          • <strong>Weeks 3-4:</strong> Share your biggest pain points through weekly check-ins—this drives what we build next
        </Text>
        <Text style={listItem}>
          • <strong>Weeks 5-12:</strong> We co-create NEW frameworks based on YOUR needs, you test prototypes, and we refine together
        </Text>
        <Text style={listItem}>
          • <strong>Ongoing:</strong> Weekly feedback surveys, office hours support, and collaborative framework development
        </Text>
        <Text style={textStyles.paragraph}>
          <strong>Platform access coming soon in Phase 2!</strong> For now, you'll receive weekly prompts via email and can access all frameworks through the links below.
        </Text>
      </InfoBox>

      {/* Beta Welcome Kit */}
      <HighlightBox>
        <Heading style={textStyles.h2}>📚 Your Beta Welcome Kit</Heading>
        <Text style={textStyles.paragraph}>
          Everything you need to succeed in the beta program:
        </Text>
        <Text style={listItem}>
          ✓ <strong>Quick Start Guide</strong> - Understand Pelican AI in 5 minutes
        </Text>
        <Text style={listItem}>
          ✓ <strong>All Available Frameworks</strong> - Direct links and usage instructions
        </Text>
        <Text style={listItem}>
          ✓ <strong>Office Hours Schedule</strong> - Get live support from our team
        </Text>
        <Text style={listItem}>
          ✓ <strong>Feedback Forms</strong> - Help us build what Louisiana educators need
        </Text>
        <Text style={listItem}>
          ✓ <strong>Beta Overview Podcast</strong> - Listen to the full vision and approach
        </Text>
        <Text style={listItem}>
          ✓ <strong>Weekly Check-in Survey</strong> - Share your progress and feedback
        </Text>
        <Text style={listItem}>
          ✓ <strong>Post-Framework Survey</strong> - Help us improve each framework
        </Text>
        <Text style={textStyles.paragraph}>
          <Link href="https://docs.google.com/document/d/1-oZ1qHqyM-cdhX8jmkm1nPQ5ahiAnVWiQun1qqeBNo8/edit" style={ctaLink}>
            <strong>→ Access Your Beta Welcome Kit</strong>
          </Link>
        </Text>
        <Text style={textStyles.paragraph}>
          <Link href="https://drive.google.com/file/d/1bUhJuvoNZURqn6Wrm6_G3UCaxvNDLN29/view?usp=sharing" style={ctaLink}>
            <strong>→ Listen to Beta Overview Podcast</strong>
          </Link>
        </Text>
        <Text style={textStyles.paragraph}>
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdZxABU24KLmaUs0J9OrWqdUuhVV_zEQ5RjU6ttIHgTIR3OWw/viewform?usp=sharing&ouid=110279044776974210923" style={ctaLink}>
            <strong>→ Weekly Check-in Survey</strong>
          </Link>
        </Text>
        <Text style={textStyles.paragraph}>
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLScs85mhZvVU7F_Ldcpgu3XhrT3qIXrnMmT050c7pn5mPqpQ9A/viewform?usp=sharing&ouid=110279044776974210923" style={ctaLink}>
            <strong>→ Post-Framework Survey</strong>
          </Link>
        </Text>
      </HighlightBox>

      {/* Time Commitment */}
      <Text style={textStyles.paragraph}>
        <strong>Your Time Commitment:</strong> About 1 hour per week for 8-12 weeks—
        try frameworks (~15 min), provide feedback (~5 min), and optionally join 
        office hours. In return, you'll save 3-5 hours per week.
      </Text>

      <Text style={textStyles.paragraph}>
        Thank you for helping us build AI guidance that truly serves Louisiana 
        educators. Your feedback will directly shape what we create next.
      </Text>

      <Text style={textStyles.paragraph}>
        Questions? Just reply to this email.
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

