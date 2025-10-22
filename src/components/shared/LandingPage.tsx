import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { AuthModal } from "@/components/auth/AuthModal";
import { PrivacyPolicyModal } from "@/components/shared/PrivacyPolicyModal";
import { TermsOfServiceModal } from "@/components/shared/TermsOfServiceModal";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { LouisianaExamplesSection } from "@/components/landing/LouisianaExamplesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { Menu, X, Users, LogIn } from "lucide-react";

export function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signIn" | "signUp">("signUp");
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleGetStartedClick = () => {
    setAuthModalMode("signUp");
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleSignInClick = () => {
    setAuthModalMode("signIn");
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close menu on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="Pelican AI" className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground">
              Pelican AI
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-2 sm:gap-4">
            <AnimatedThemeToggler />
            <Button 
              variant="outline"
              size="sm"
              onClick={handleSignInClick}
              className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 h-auto"
            >
              Sign In
            </Button>
            <Button 
              size="sm"
              onClick={handleGetStartedClick}
              className="bg-primary hover:bg-primary/90 transition-colors text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 h-auto"
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden relative z-[60]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 relative z-[60]"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
                onClick={handleCloseMenu}
              >
                <nav 
                  aria-label="Mobile navigation"
                  className="fixed top-16 left-0 right-0 bg-background border-b shadow-lg z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 space-y-2">
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={handleSignInClick}
                      className="w-full justify-start gap-3 h-12"
                    >
                      <LogIn className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Sign In</div>
                        <div className="text-xs text-muted-foreground">
                          Access your account
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={handleGetStartedClick}
                      className="w-full justify-start gap-3 h-12"
                    >
                      <Users className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Get Started</div>
                        <div className="text-xs text-muted-foreground">
                          Create your account
                        </div>
                      </div>
                    </Button>
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Theme</span>
                        <AnimatedThemeToggler />
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      </motion.header>

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
