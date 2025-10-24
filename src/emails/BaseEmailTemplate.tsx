import * as React from "react";
import {
  Html,
  Body,
  Container,
  Head,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface BaseEmailTemplateProps {
  children: React.ReactNode;
  previewText: string;
  headerTitle?: string;
  headerSubtitle?: string;
}

export function BaseEmailTemplate({
  children,
  previewText,
  headerTitle,
  headerSubtitle,
}: BaseEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Pelican AI Branding */}
          <Section style={header}>
            {headerTitle && (
              <Text style={headerTitleStyle}>{headerTitle}</Text>
            )}
            {headerSubtitle && (
              <Text style={headerSubtitleStyle}>{headerSubtitle}</Text>
            )}
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {children}
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Pelican AI</strong> - Navigate AI with Confidence
              <br />
              Built with Louisiana educators, for Louisiana educators
            </Text>
            <Text style={footerText}>
              <Link href="https://pelicanai.org" style={link}>
                pelicanai.org
              </Link>
              {" • "}
              <Link href="mailto:hello@pelicanai.org" style={link}>
                hello@pelicanai.org
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Reusable styled components
export const InfoBox = ({ children, ...props }: any) => (
  <Section style={infoBox} {...props}>
    {children}
  </Section>
);

export const HighlightBox = ({ children, ...props }: any) => (
  <Section style={highlightBox} {...props}>
    {children}
  </Section>
);

export const ActionBox = ({ children, ...props }: any) => (
  <Section style={actionBox} {...props}>
    {children}
  </Section>
);

export const CredentialsBox = ({ children, ...props }: any) => (
  <Section style={credentialsBox} {...props}>
    {children}
  </Section>
);

export const CTAButton = ({ href, children, ...props }: any) => (
  <Button style={button} href={href} {...props}>
    {children}
  </Button>
);

export const SecondaryButton = ({ href, children, ...props }: any) => (
  <Button style={secondaryButton} href={href} {...props}>
    {children}
  </Button>
);

// Base styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '"Lexend", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 24px 0",
  textAlign: "center" as const,
};


const headerTitleStyle = {
  color: "#1e40af",
  fontSize: "28px",
  fontWeight: "bold",
  fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: "16px 0 8px",
  textAlign: "center" as const,
};

const headerSubtitleStyle = {
  color: "#6b7280",
  fontSize: "16px",
  margin: "0 0 16px",
  textAlign: "center" as const,
};

const content = {
  padding: "0 24px",
};

const h1 = {
  color: "#1e40af",
  fontSize: "24px",
  fontWeight: "bold",
  fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: "0 0 16px",
};

const h2 = {
  color: "#1e40af",
  fontSize: "20px",
  fontWeight: "bold",
  fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: "0 0 12px",
};

const paragraph = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const infoBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const highlightBox = {
  backgroundColor: "#eff6ff",
  border: "1px solid #0ea5e9",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  borderLeft: "4px solid #0ea5e9",
};

const actionBox = {
  backgroundColor: "#fef3c7",
  border: "2px solid #f59e0b",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  borderLeft: "4px solid #f59e0b",
};

const credentialsBox = {
  backgroundColor: "#dcfce7",
  border: "2px solid #22c55e",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  borderLeft: "4px solid #22c55e",
};

const button = {
  backgroundColor: "#0ea5e9",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  margin: "16px 0",
};

const secondaryButton = {
  backgroundColor: "#ffffff",
  border: "1px solid #0ea5e9",
  borderRadius: "6px",
  color: "#0ea5e9",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  margin: "16px 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  padding: "32px 24px 0",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
};

const link = {
  color: "#0ea5e9",
  textDecoration: "none",
};


// Export common text styles for use in child components
export const textStyles = {
  h1,
  h2,
  paragraph,
};

export default BaseEmailTemplate;
