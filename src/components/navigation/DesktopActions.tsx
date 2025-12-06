import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import type { NavAction } from "./types";

interface DesktopActionsProps {
  actions?: NavAction[];
  showThemeToggle?: boolean;
}

export function DesktopActions({
  actions,
  showThemeToggle = true,
}: DesktopActionsProps) {
  return (
    // Hidden on mobile - MobileMenu handles those breakpoints
    <div className="hidden md:flex items-center gap-1">
      {actions?.map((action, index) => {
        const Icon = action.icon;
        const showLabel = action.showLabel ?? false;
        const isDestructive = action.variant === "destructive";

        return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={action.variant || "ghost"}
              size={showLabel ? "sm" : "icon"}
              onClick={action.onClick}
              className={`
                h-9 transition-all duration-200
                ${showLabel ? "px-4 gap-2" : "w-9"}
                ${isDestructive ? "hover:bg-destructive/10" : ""}
              `}
              title={action.label}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {showLabel && (
                <span className="text-sm font-medium tracking-tight">
                  {action.label}
                </span>
              )}
            </Button>
          </motion.div>
        );
      })}
      {showThemeToggle && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <AnimatedThemeToggler className="h-9 w-9 p-2 shrink-0 rounded-md hover:bg-accent transition-colors" />
        </motion.div>
      )}
    </div>
  );
}
