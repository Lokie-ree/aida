import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { NavItem } from "./types";

interface DesktopNavProps {
  items?: NavItem[];
}

export function DesktopNav({ items }: DesktopNavProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="hidden md:flex items-center gap-1 bg-muted/50 rounded-full px-1.5 py-1 backdrop-blur-sm">
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = item.active;

        return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={item.onClick}
              className={`
                h-8 px-4 rounded-xl transition-all duration-200
                ${isActive 
                  ? "shadow-sm border border-primary/20" 
                  : "hover:bg-background/80 hover:border-border"
                }
              `}
            >
              {Icon && (
                <Icon
                  className={`h-4 w-4 mr-1.5 transition-colors ${
                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                />
              )}
              <span className="text-sm font-medium tracking-tight">
                {item.label}
              </span>
              {item.badge !== undefined && item.badge !== null && (
                <span className={`ml-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                  isActive 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {item.badge}
                </span>
              )}
            </Button>
          </motion.div>
        );
      })}
    </nav>
  );
}
