import { useState, useMemo } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { AppHeader, type NavConfig } from "@/components/navigation";
import { PrivacyPolicyModal } from "@/components/shared/PrivacyPolicyModal";
import { TermsOfServiceModal } from "@/components/shared/TermsOfServiceModal";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { LouisianaExamplesSection } from "@/components/landing/LouisianaExamplesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { AuthModal } from "@/components/auth/AuthModal";

function LandingPage() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signIn" | "signUp">("signUp");

  const handleGetStartedClick = () => {
    setAuthModalMode("signUp");
    setIsAuthModalOpen(true);
  };

  const handleSignInClick = () => {
    setAuthModalMode("signIn");
    setIsAuthModalOpen(true);
  };

  const navConfig: NavConfig = useMemo(
    () => ({
      actions: [
        {
          label: "Sign In",
          icon: LogIn,
          onClick: handleSignInClick,
          variant: "ghost" as const,
          showLabel: true,
        },
        {
          label: "Get Started",
          icon: UserPlus,
          onClick: handleGetStartedClick,
          variant: "default" as const,
          showLabel: true,
        },
      ],
      showThemeToggle: false,
    }),
    []
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <AppHeader config={navConfig} logoHref="/" animated />

      {/* Main Content */}
      <main id="main-content">
        <HeroSection onGetStartedClick={handleGetStartedClick} />
        <FeaturesSection />
        <LouisianaExamplesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection onGetStartedClick={handleGetStartedClick} />
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <img src="/icon.png" alt="Pelican AI" className="h-8 w-8" />
                  <span className="text-xl font-bold text-foreground">
                    Pelican AI
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Navigate AI with Confidence
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An intelligent coaching assistant that helps Louisiana educators generate better prompts for any AI tool.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Product</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleGetStartedClick}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Get Started
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <a 
                    href="mailto:hello@pelicanai.org" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Created with 💙 by educators for educators
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Pelican AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
      <TermsOfServiceModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
      />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default LandingPage;
