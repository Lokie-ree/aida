import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Button,
  Hr,
  Img,
  Row,
  Column,
  Preview,
  Font,
  Heading as ReactEmailHeading,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

// =============================================================================
// PELICAN AI EMAIL DESIGN SYSTEM
// =============================================================================

const brandColors = {
  // Louisiana sky blue gradient
  primary: "#0ea5e9",
  primaryDark: "#0284c7",
  primaryLight: "#38bdf8",
  // Louisiana deep blue (accent)
  louisiana: "#1e40af",
  louisianaLight: "#3b82f6",
  // Pelican gold
  gold: "#eab308",
  goldLight: "#facc15",
  // Neutrals
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
  // Semantic
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
};

// Tailwind config for emails
const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: brandColors.primary,
          "primary-dark": brandColors.primaryDark,
          "primary-light": brandColors.primaryLight,
          louisiana: brandColors.louisiana,
          "louisiana-light": brandColors.louisianaLight,
          gold: brandColors.gold,
          "gold-light": brandColors.goldLight,
        },
      },
      fontFamily: {
        heading: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Lexend", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["SF Mono", "Monaco", "Menlo", "monospace"],
      },
    },
  },
};

// =============================================================================
// BASE EMAIL TEMPLATE
// =============================================================================

interface BaseEmailTemplateProps {
  children: React.ReactNode;
  previewText: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerEmoji?: string;
  showHeader?: boolean;
  footerContent?: React.ReactNode;
  variant?: "default" | "celebration" | "minimal";
}

export function BaseEmailTemplate({
  children,
  previewText,
  headerTitle,
  headerSubtitle,
  headerEmoji,
  showHeader = true,
  footerContent,
  variant = "default",
}: BaseEmailTemplateProps) {
  return (
    <Html>
      <Tailwind config={tailwindConfig}>
        <Head>
          <Font
            fontFamily="Poppins"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2",
              format: "woff2",
            }}
            fontWeight={700}
            fontStyle="normal"
          />
          <Font
            fontFamily="Poppins"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2",
              format: "woff2",
            }}
            fontWeight={600}
            fontStyle="normal"
          />
          <Font
            fontFamily="Lexend"
            fallbackFontFamily="Arial"
            webFont={{
              url: "https://fonts.gstatic.com/s/lexend/v19/wlptgwvFAVdoq2_F94zlCfv0bz1WCzsX_KhJqMYS.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
        </Head>
        <Preview>{previewText}</Preview>
        <Body className="bg-slate-100 font-body m-0 p-0">
          {/* Outer wrapper with background pattern */}
          <Section className="py-8 px-4">
            <Container className="max-w-[600px] mx-auto">
              {/* Main card */}
              <Section className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Header */}
                {showHeader && (
                  <Header
                    title={headerTitle}
                    subtitle={headerSubtitle}
                    emoji={headerEmoji}
                    variant={variant}
                  />
                )}

                {/* Content */}
                <Section className="px-8 py-8">
                  {children}
                </Section>
              </Section>

              {/* Footer */}
              <Footer content={footerContent} />
            </Container>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}

// =============================================================================
// HEADER COMPONENT
// =============================================================================

interface HeaderProps {
  title?: string;
  subtitle?: string;
  emoji?: string;
  variant?: "default" | "celebration" | "minimal";
}

function Header({ title, subtitle, emoji, variant = "default" }: HeaderProps) {
  const bgStyle = variant === "celebration"
    ? "bg-gradient-to-br from-brand-primary via-brand-louisiana to-brand-primary-dark"
    : variant === "minimal"
    ? "bg-slate-50 border-b border-slate-200"
    : "bg-gradient-to-r from-brand-primary to-brand-louisiana";

  const textColor = variant === "minimal" ? "text-slate-800" : "text-white";
  const subtitleColor = variant === "minimal" ? "text-slate-500" : "text-white/90";

  return (
    <Section className={`${bgStyle} px-8 py-10 text-center`}>
      {/* Logo */}
      <Row className="mb-4">
        <Column className="text-center">
          <Img
            src="https://pelicanai.org/icon.png"
            alt="Pelican AI"
            width={56}
            height={56}
            className="rounded-xl mx-auto shadow-md"
          />
        </Column>
      </Row>

      {/* Title with optional emoji */}
      {title && (
        <Text className={`font-heading text-2xl font-bold ${textColor} m-0 leading-tight`}>
          {emoji && <span className="mr-2">{emoji}</span>}
          {title}
        </Text>
      )}

      {subtitle && (
        <Text className={`text-base ${subtitleColor} mt-2 mb-0 font-body`}>
          {subtitle}
        </Text>
      )}
    </Section>
  );
}

// =============================================================================
// FOOTER COMPONENT
// =============================================================================

function Footer({ content }: { content?: React.ReactNode }) {
  if (content) return <Section className="px-8 py-6">{content}</Section>;

  return (
    <Section className="px-8 py-8 text-center">
      {/* Logo */}
      <Row className="mb-4">
        <Column className="text-center">
          <Img
            src="https://pelicanai.org/icon.png"
            alt="Pelican AI"
            width={32}
            height={32}
            className="rounded-lg mx-auto opacity-80"
          />
        </Column>
      </Row>

      <Text className="text-slate-500 text-sm m-0 mb-2">
        Created with 💙 by educators, for educators
      </Text>

      <Text className="text-slate-400 text-sm m-0 mb-4">
        <Link href="https://pelicanai.org" className="text-brand-primary underline">
          pelicanai.org
        </Link>
        <span className="mx-2">•</span>
        <Link href="mailto:hello@pelicanai.org" className="text-brand-primary underline">
          hello@pelicanai.org
        </Link>
      </Text>

      <Hr className="border-slate-200 my-4 mx-8" />

      <Text className="text-slate-400 text-xs m-0">
        Pelican AI • Louisiana educator-built guidance for AI in education
      </Text>
    </Section>
  );
}

// =============================================================================
// TYPOGRAPHY COMPONENTS
// =============================================================================

interface HeadingProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function Heading({ children, as = "h2", className = "" }: HeadingProps) {
  const baseStyles = "font-heading font-bold leading-tight";
  const sizeStyles = {
    h1: "text-2xl text-brand-louisiana mb-4",
    h2: "text-xl text-brand-louisiana mt-6 mb-3",
    h3: "text-lg text-slate-800 mt-4 mb-2",
  };

  return (
    <ReactEmailHeading as={as} className={`${baseStyles} ${sizeStyles[as]} ${className}`}>
      {children}
    </ReactEmailHeading>
  );
}

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
}

export function Paragraph({ children, className = "", muted = false }: ParagraphProps) {
  const color = muted ? "text-slate-500" : "text-slate-700";
  return (
    <Text className={`${color} text-base leading-relaxed mb-4 ${className}`}>
      {children}
    </Text>
  );
}

// =============================================================================
// CARD COMPONENTS
// =============================================================================

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "highlight" | "success" | "warning" | "action" | "glass";
  className?: string;
}

export function Card({ children, variant = "default", className = "" }: CardProps) {
  const variants = {
    default: "bg-white border border-slate-200",
    highlight: "bg-sky-50/80 border border-sky-200 border-l-4 border-l-brand-primary",
    success: "bg-emerald-50/80 border border-emerald-200 border-l-4 border-l-emerald-500",
    warning: "bg-amber-50/80 border border-amber-200 border-l-4 border-l-amber-500",
    action: "bg-slate-50 border-2 border-dashed border-slate-300",
    glass: "bg-white/80 backdrop-blur border border-white/20 shadow-lg",
  };

  return (
    <Section className={`${variants[variant]} rounded-xl p-6 my-6 ${className}`}>
      {children}
    </Section>
  );
}

// Convenience wrappers
export const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <Card variant="highlight">{children}</Card>
);
export const HighlightBox = ({ children }: { children: React.ReactNode }) => (
  <Card variant="highlight">{children}</Card>
);
export const SuccessBox = ({ children }: { children: React.ReactNode }) => (
  <Card variant="success">{children}</Card>
);
export const WarningBox = ({ children }: { children: React.ReactNode }) => (
  <Card variant="warning">{children}</Card>
);
export const ActionBox = ({ children }: { children: React.ReactNode }) => (
  <Card variant="action">{children}</Card>
);
export const CredentialsBox = ({ children }: { children: React.ReactNode }) => (
  <Card variant="success">{children}</Card>
);

// =============================================================================
// BUTTON COMPONENTS
// =============================================================================

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "default" | "lg";
  fullWidth?: boolean;
}

export function CTAButton({
  href,
  children,
  variant = "primary",
  size = "default",
  fullWidth = false,
}: CTAButtonProps) {
  const variants = {
    primary: "bg-brand-primary text-white",
    secondary: "bg-white text-brand-primary border-2 border-brand-primary",
    ghost: "bg-transparent text-brand-primary",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const width = fullWidth ? "w-full" : "inline-block";

  return (
    <Button
      href={href}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${width}
        font-semibold
        rounded-lg
        text-center
        no-underline
        transition-colors
        my-4
        shadow-sm
      `}
    >
      {children}
    </Button>
  );
}

export function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <CTAButton href={href} variant="secondary">
      {children}
    </CTAButton>
  );
}

// =============================================================================
// STEP/LIST COMPONENTS
// =============================================================================

interface StepProps {
  number: number;
  title: string;
  description?: string;
  isLast?: boolean;
}

export function Step({ number, title, description, isLast = false }: StepProps) {
  return (
    <Row className={`mb-4 ${!isLast ? "pb-4" : ""}`}>
      <Column className="w-12 align-top">
        <Text
          className={`
            w-8 h-8 leading-8 text-center text-sm font-bold rounded-full m-0
            ${isLast
              ? "bg-brand-primary text-white"
              : "bg-sky-100 text-brand-primary"
            }
          `}
        >
          {number}
        </Text>
      </Column>
      <Column className="pl-3">
        <Text className="text-slate-800 font-semibold text-base m-0 mb-1">
          {title}
        </Text>
        {description && (
          <Text className="text-slate-500 text-sm m-0 leading-relaxed">
            {description}
          </Text>
        )}
      </Column>
    </Row>
  );
}

interface ListItemProps {
  children: React.ReactNode;
  icon?: "check" | "bullet" | "number" | "arrow" | "star";
  number?: number;
}

export function ListItem({ children, icon = "bullet", number }: ListItemProps) {
  const icons = {
    check: "✓",
    bullet: "•",
    number: `${number}.`,
    arrow: "→",
    star: "★",
  };

  const iconColor = icon === "check" ? "text-emerald-500" : "text-brand-primary";

  return (
    <Text className="text-slate-700 text-base leading-relaxed my-2 pl-6">
      <span className={`${iconColor} font-bold mr-3`}>
        {icon === "number" ? number : icons[icon]}
      </span>
      {children}
    </Text>
  );
}

// =============================================================================
// FEATURE/STATS COMPONENTS
// =============================================================================

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

export function Feature({ icon, title, description }: FeatureProps) {
  return (
    <Column className="text-center px-3 py-4">
      <Text className="text-3xl m-0 mb-2">{icon}</Text>
      <Text className="text-slate-800 font-semibold text-sm m-0 mb-1">{title}</Text>
      <Text className="text-slate-500 text-xs m-0 leading-snug">{description}</Text>
    </Column>
  );
}

export function FeatureCard({ icon, title, description }: FeatureProps) {
  return (
    <Section className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
      <Text className="text-4xl m-0 mb-3">{icon}</Text>
      <Text className="text-slate-800 font-heading font-semibold text-base m-0 mb-2">
        {title}
      </Text>
      <Text className="text-slate-600 text-sm m-0 leading-relaxed">{description}</Text>
    </Section>
  );
}

interface StatProps {
  value: string;
  label: string;
}

interface StatsRowProps {
  stats: StatProps[];
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <Row className="my-6">
      {stats.map((stat, index) => (
        <Column key={index} className="text-center px-4">
          <Text className="text-brand-primary text-3xl font-heading font-bold m-0">
            {stat.value}
          </Text>
          <Text className="text-slate-500 text-sm mt-1 mb-0">{stat.label}</Text>
        </Column>
      ))}
    </Row>
  );
}

// =============================================================================
// SPECIAL COMPONENTS
// =============================================================================

interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
}

export function Testimonial({ quote, author, role }: TestimonialProps) {
  return (
    <Section className="bg-sky-50 border-l-4 border-brand-primary rounded-r-xl p-5 my-6 italic">
      <Text className="text-brand-louisiana text-base leading-relaxed m-0">
        "{quote}"
      </Text>
      <Text className="text-slate-500 text-sm mt-3 mb-0 not-italic">
        — {author}{role && `, ${role}`}
      </Text>
    </Section>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-slate-200 text-slate-700",
    primary: "bg-sky-100 text-brand-primary",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
  };

  return (
    <span className={`${variants[variant]} text-xs font-medium px-2 py-1 rounded inline-block`}>
      {children}
    </span>
  );
}

interface SignatureProps {
  name?: string;
  title?: string;
}

export function Signature({
  name = "Randall",
  title = "Louisiana educator building this for Louisiana educators",
}: SignatureProps) {
  return (
    <Section className="mt-6">
      <Text className="text-slate-700 text-base m-0">
        {name}
        <br />
        <span className="text-slate-500 text-sm italic">{title}</span>
      </Text>
    </Section>
  );
}

export function Divider() {
  return <Hr className="border-slate-200 my-8" />;
}

// =============================================================================
// CODE/PROMPT COMPONENTS
// =============================================================================

interface PromptBoxProps {
  children: React.ReactNode;
  label?: string;
}

export function PromptBox({ children, label }: PromptBoxProps) {
  return (
    <Section className="bg-slate-50 border border-slate-200 border-l-4 border-l-brand-primary rounded-lg p-4 my-4">
      {label && (
        <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wide m-0 mb-2">
          {label}
        </Text>
      )}
      <Text className="text-slate-700 font-mono text-sm leading-relaxed m-0 whitespace-pre-wrap">
        {children}
      </Text>
    </Section>
  );
}

export function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <Section className="bg-slate-900 rounded-lg p-4 my-4 overflow-auto">
      <Text className="text-slate-100 font-mono text-sm leading-relaxed m-0 whitespace-pre-wrap">
        {children}
      </Text>
    </Section>
  );
}

// =============================================================================
// TIMELINE COMPONENT
// =============================================================================

interface TimelineItemProps {
  title: string;
  description: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

export function TimelineItem({ title, description, isActive = false, isCompleted = false }: TimelineItemProps) {
  const dotStyle = isCompleted
    ? "text-emerald-500"
    : isActive
    ? "text-brand-primary"
    : "text-slate-300";

  const dot = isCompleted ? "●" : isActive ? "●" : "○";

  return (
    <Row className="mb-4">
      <Column className="w-6 align-top pt-1">
        <Text className={`${dotStyle} text-base m-0 font-bold`}>{dot}</Text>
      </Column>
      <Column className="pl-2">
        <Text className="text-slate-800 font-semibold text-sm m-0 mb-1">{title}</Text>
        <Text className="text-slate-500 text-sm m-0 leading-relaxed">{description}</Text>
      </Column>
    </Row>
  );
}

// =============================================================================
// LEGACY EXPORTS (backwards compatibility)
// =============================================================================

export const textStyles = {
  h1: { color: "#1e40af", fontSize: "24px", fontWeight: "bold" },
  h2: { color: "#1e40af", fontSize: "20px", fontWeight: "bold" },
  h3: { color: "#1e293b", fontSize: "18px", fontWeight: "600" },
  paragraph: { color: "#334155", fontSize: "16px", lineHeight: "1.625" },
  small: { color: "#64748b", fontSize: "14px" },
  listItem: { color: "#334155", fontSize: "14px", lineHeight: "1.625" },
};

export default BaseEmailTemplate;
