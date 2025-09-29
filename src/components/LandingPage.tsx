import HeroSection from "./landing/HeroSection";
import FeaturesSection from "./landing/Features";
import StatsSection from "./landing/Stats";
import WallOfLoveSection from "./landing/Testimonials";
import IntegrationsSection from "./landing/Integrations";
import CallToAction from "./landing/CallToAction";
import FooterSection from "./landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <main id="main-content" className="flex-1" role="main">
        {/* Hero Section - includes its own header */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Testimonials Section */}
        <WallOfLoveSection />

        {/* Integrations Section */}
        <IntegrationsSection />

        {/* Call to Action Section */}
        <CallToAction />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
