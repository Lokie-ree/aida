import { useState } from "react";
import { AppHeader } from "@/components/shared/AppHeader";
import { PrivacyPolicyModal } from "@/components/shared/PrivacyPolicyModal";
import { TermsOfServiceModal } from "@/components/shared/TermsOfServiceModal";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { LouisianaExamplesSection } from "@/components/landing/LouisianaExamplesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { AuthModal } from "@/components/auth/AuthModal";

export function LandingPage() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signIn" | "signUp">("signUp");

  const handleGetStartedClick = () => {
    setAuthModalMode("signUp");
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      {/* Main Content */}
      <main>
        <HeroSection onGetStartedClick={handleGetStartedClick} />
        <FeaturesSection />
        <LouisianaExamplesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection onGetStartedClick={handleGetStartedClick} />
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 px-6">
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
                Platform-agnostic guidance frameworks designed specifically for Louisiana educators. Learn to use ANY AI tool effectively with ethical guardrails aligned to Louisiana standards.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">
                Product
              </h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors h-[45px] min-w-[45px] px-2 py-2"
                    aria-label="Navigate to How It Works section"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleGetStartedClick}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors h-[45px] min-w-[45px] px-2 py-2"
                    aria-label="Get Started"
                  >
                    Get Started
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors h-[45px] min-w-[45px] px-2 py-2"
                    aria-label="Navigate to FAQ section"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <a href="mailto:hello@pelicanai.org" className="text-sm text-muted-foreground hover:text-primary transition-colors h-[45px] min-w-[45px] px-2 py-2 inline-flex items-center">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors h-[45px] min-w-[45px] px-2 py-2 inline-flex items-center"
                    aria-label="Open Privacy Policy"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors h-[45px] min-w-[45px] px-2 py-2 inline-flex items-center"
                    aria-label="Open Terms of Service"
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

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />

      {/* Terms of Service Modal */}
      <TermsOfServiceModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}
