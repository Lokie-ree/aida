import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import type { NavItem, NavAction } from "./types";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navItems?: NavItem[];
  actions?: NavAction[];
  showThemeToggle?: boolean;
}

const menuItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export function MobileMenu({
  open,
  onOpenChange,
  navItems,
  actions,
  showThemeToggle = true,
}: MobileMenuProps) {
  const handleAction = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  const hasNavItems = navItems && navItems.length > 0;
  const hasActions = actions && actions.length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 rounded-full"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </motion.div>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[300px] p-0 border-l border-border/50"
      >
        <SheetHeader className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold tracking-tight">
              Menu
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100%-80px)]">
          {/* Navigation Section */}
          {hasNavItems && (
            <nav className="px-4 py-4">
              <p className="px-3 mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Navigation
              </p>
              <div className="flex flex-col gap-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = item.active;

                  return (
                    <motion.div
                      key={index}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={menuItemVariants}
                    >
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        onClick={() => item.onClick && handleAction(item.onClick)}
                        className={`
                          w-full justify-start h-11 px-3 rounded-lg
                          transition-all duration-200
                          ${isActive ? "bg-primary/10 text-primary font-medium" : ""}
                        `}
                      >
                        {Icon && (
                          <Icon
                            className={`h-4 w-4 mr-3 ${
                              isActive ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                        )}
                        <span className="text-sm tracking-tight">{item.label}</span>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </nav>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Account Section */}
          {(hasActions || showThemeToggle) && (
            <div className="px-4 py-4 border-t border-border/50 bg-muted/30">
              <p className="px-3 mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Account
              </p>

              {showThemeToggle && (
                <motion.div
                  custom={navItems?.length || 0}
                  initial="hidden"
                  animate="visible"
                  variants={menuItemVariants}
                  className="flex items-center justify-between px-3 py-2 mb-1 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <AnimatedThemeToggler className="h-8 w-8 p-1.5 rounded-md hover:bg-accent" />
                </motion.div>
              )}

              {actions?.map((action, index) => {
                const Icon = action.icon;
                const isDestructive = action.variant === "destructive";
                const itemIndex = (navItems?.length || 0) + (showThemeToggle ? 1 : 0) + index;

                return (
                  <motion.div
                    key={index}
                    custom={itemIndex}
                    initial="hidden"
                    animate="visible"
                    variants={menuItemVariants}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => handleAction(action.onClick)}
                      className={`
                        w-full justify-start h-11 px-3 rounded-lg
                        transition-all duration-200
                        ${isDestructive 
                          ? "text-destructive hover:text-destructive hover:bg-destructive/10" 
                          : "hover:bg-accent/50"
                        }
                      `}
                    >
                      <Icon
                        className={`h-4 w-4 mr-3 ${
                          isDestructive ? "text-destructive" : "text-muted-foreground"
                        }`}
                      />
                      <span className="text-sm tracking-tight">{action.label}</span>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
