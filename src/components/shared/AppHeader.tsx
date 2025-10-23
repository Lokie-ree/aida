import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { SignOutButton } from "@/components/shared/SignOutButton";
import { AuthModal } from "@/components/auth/AuthModal";
import { Menu, X, Users, LogIn, BookOpen, Home } from "lucide-react";

interface AppHeaderProps {
  onGetStartedClick?: () => void;
  onSignInClick?: () => void;
  showAuthButtons?: boolean;
  showNavigation?: boolean;
  currentUser?: {
    name?: string;
    email?: string;
  };
}

export function AppHeader({ 
  onGetStartedClick, 
  onSignInClick, 
  showAuthButtons = true,
  showNavigation = false,
  currentUser
}: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signIn" | "signUp">("signUp");
  const navigate = useNavigate();
  const location = useLocation();

  const handleGetStartedClick = () => {
    if (onGetStartedClick) {
      onGetStartedClick();
    } else {
      setAuthModalMode("signUp");
      setIsAuthModalOpen(true);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignInClick = () => {
    if (onSignInClick) {
      onSignInClick();
    } else {
      setAuthModalMode("signIn");
      setIsAuthModalOpen(true);
    }
    setIsMobileMenuOpen(false);
  };

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
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
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: Logo and app name */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity durat    ion-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg p-1 -m-1"
            aria-label="Go to dashboard"
          >
            <img src="/icon.png" alt="Pelican AI" className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground">
              Pelican AI
            </span>
          </button>
          
          {/* Middle: Navigation buttons (only for authenticated users) */}
          {showNavigation && (
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
              <Button 
                variant={isActiveRoute('/dashboard') ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleNavigation('/dashboard')}
                className={`text-sm px-4 py-2 h-auto transition-all duration-200 ${
                  isActiveRoute('/dashboard') 
                    ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                    : 'hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                variant={isActiveRoute('/frameworks') ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleNavigation('/frameworks')}
                className={`text-sm px-4 py-2 h-auto transition-all duration-200 ${
                  isActiveRoute('/frameworks') 
                    ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                    : 'hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Frameworks
              </Button>
              <Button 
                variant={isActiveRoute('/community') ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleNavigation('/community')}
                className={`text-sm px-4 py-2 h-auto transition-all duration-200 ${
                  isActiveRoute('/community') 
                    ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                    : 'hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Community
              </Button>
            </nav>
          )}
          
          {/* Right: Desktop navigation and mobile hamburger menu */}
          <div className="flex items-center gap-2">
            {/* Desktop Theme Toggle and Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {showAuthButtons ? (
                // Landing page navigation
                <>
                  <AnimatedThemeToggler />
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleSignInClick}
                    className="text-sm px-4 py-2 h-auto"
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleGetStartedClick}
                    className="bg-primary hover:bg-primary/90 transition-colors text-sm px-4 py-2 h-auto"
                  >
                    Get Started
                  </Button>
                </>
              ) : showNavigation ? (
                // Authenticated user navigation
                <>
                  <AnimatedThemeToggler />
                  <SignOutButton />
                </>
              ) : (
                // Default case
                <AnimatedThemeToggler />
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            {(showAuthButtons || showNavigation) && (
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
                      {showNavigation ? (
                        // Authenticated user mobile menu
                        <>
                          <Button
                            variant={isActiveRoute('/dashboard') ? "secondary" : "ghost"}
                            size="lg"
                            onClick={() => handleNavigation('/dashboard')}
                            className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${
                              isActiveRoute('/dashboard') 
                                ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                                : 'hover:bg-primary/5 hover:text-primary'
                            }`}
                          >
                            <Home className="h-5 w-5" />
                            <div className="text-left">
                              <div className="font-medium">Dashboard</div>
                              <div className="text-xs text-muted-foreground">
                                Your home page
                              </div>
                            </div>
                          </Button>
                          <Button
                            variant={isActiveRoute('/frameworks') ? "secondary" : "ghost"}
                            size="lg"
                            onClick={() => handleNavigation('/frameworks')}
                            className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${
                              isActiveRoute('/frameworks') 
                                ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                                : 'hover:bg-primary/5 hover:text-primary'
                            }`}
                          >
                            <BookOpen className="h-5 w-5" />
                            <div className="text-left">
                              <div className="font-medium">Frameworks</div>
                              <div className="text-xs text-muted-foreground">
                                Browse AI frameworks
                              </div>
                            </div>
                          </Button>
                          <Button
                            variant={isActiveRoute('/community') ? "secondary" : "ghost"}
                            size="lg"
                            onClick={() => handleNavigation('/community')}
                            className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${
                              isActiveRoute('/community') 
                                ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                                : 'hover:bg-primary/5 hover:text-primary'
                            }`}
                          >
                            <Users className="h-5 w-5" />
                            <div className="text-left">
                              <div className="font-medium">Community</div>
                              <div className="text-xs text-muted-foreground">
                                Connect with educators
                              </div>
                            </div>
                          </Button>
                          <div className="border-t pt-4 mt-4">
                            <div className="w-full">
                              <SignOutButton />
                            </div>
                          </div>
                        </>
                      ) : (
                        // Landing page mobile menu
                        <>
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
                        </>
                      )}
                      
                      {/* Theme Toggle - Always at bottom */}
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
            )}
          </div>
        </div>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
