import { useState } from "react";
import { motion } from "framer-motion";
import { spacing } from "@/lib/spacing";
import { DesktopNav } from "./DesktopNav";
import { DesktopActions } from "./DesktopActions";
import { MobileMenu } from "./MobileMenu";
import type { NavConfig } from "./types";

interface AppHeaderProps {
  config: NavConfig;
  onLogoClick?: () => void;
  logoHref?: string;
  animated?: boolean; // Whether to animate header on mount (for landing page)
}

export function AppHeader({
  config,
  onLogoClick,
  logoHref = "/coach",
  animated = false,
}: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onLogoClick) {
      e.preventDefault();
      onLogoClick();
    }
  };

  const HeaderContent = (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl backdrop-saturate-150 shrink-0 supports-backdrop-filter:bg-background/80">
      <div
        className={`w-full ${spacing.container} h-16 flex items-center justify-between gap-2 sm:gap-4`}
      >
        {/* Left: Logo */}
        <motion.a
          href={logoHref}
          onClick={handleLogoClick}
          className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative">
            <img
              src="/icon.png"
              alt="Pelican AI"
              className="h-8 w-8 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="font-bold text-base sm:text-lg md:text-xl tracking-tight text-foreground">
            Pelican AI
          </span>
        </motion.a>

        {/* Center: Desktop Navigation */}
        <DesktopNav items={config.navItems} />

        {/* Right: Actions (desktop) + Mobile Menu (mobile only) */}
        <div className="flex items-center gap-2">
          <DesktopActions
            actions={config.actions}
            showThemeToggle={config.showThemeToggle}
          />
          <MobileMenu
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            navItems={config.navItems}
            actions={config.actions}
            showThemeToggle={config.showThemeToggle}
            recentSessions={config.recentSessions}
            onSelectSession={config.onSelectSession}
            onRenameSession={config.onRenameSession}
            onDeleteSession={config.onDeleteSession}
          />
        </div>
      </div>
    </header>
  );

  // Wrap with motion if animated is true (for landing page)
  if (animated) {
    return (
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {HeaderContent}
      </motion.div>
    );
  }

  return HeaderContent;
}
