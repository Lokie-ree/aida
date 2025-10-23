import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  Lightbulb, 
  TrendingUp,
  ArrowRight
} from "lucide-react";

export interface QuickAccessItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary";
}

export interface QuickAccessGridProps {
  items?: QuickAccessItem[];
  onNavigateToFrameworks?: () => void;
  onNavigateToCommunity?: () => void;
  onNavigateToInnovation?: () => void;
  onNavigateToProgress?: () => void;
  userStats?: {
    frameworksTried: number;
    timeSaved: number;
    innovationsShared: number;
    weeklyStreak: number;
  };
  className?: string;
}

const getDefaultItems = (userStats?: QuickAccessGridProps['userStats']): QuickAccessItem[] => [
  {
    id: "frameworks",
    label: "AI Framework Library",
    description: "80+ Louisiana Standards-aligned frameworks",
    icon: <BookOpen className="h-6 w-6" />,
    onClick: () => {},
    variant: "default"
  },
  {
    id: "community",
    label: "Louisiana Educator Community",
    description: "Connect with fellow educators across the state",
    icon: <Users className="h-6 w-6" />,
    onClick: () => {},
    variant: "outline"
  },
  {
    id: "innovation",
    label: "Share Your Success",
    description: "Help fellow Louisiana educators succeed",
    icon: <Lightbulb className="h-6 w-6" />,
    onClick: () => {},
    variant: "outline"
  },
  {
    id: "progress",
    label: "Your AI Journey",
    description: "Track time saved and confidence gained",
    icon: <TrendingUp className="h-6 w-6" />,
    onClick: () => {},
    variant: "outline"
  }
];

export function QuickAccessGrid({ 
  items,
  onNavigateToFrameworks,
  onNavigateToCommunity,
  onNavigateToInnovation,
  onNavigateToProgress,
  userStats,
  className = ""
}: QuickAccessGridProps) {
  const defaultItems = getDefaultItems(userStats);
  const processedItems = items || defaultItems;
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerChildren = {
    animate: {
      transition: { staggerChildren: 0.1 }
    }
  };

  // Override default onClick handlers if provided
  const finalItems = processedItems.map(item => {
    switch (item.id) {
      case "frameworks":
        return { ...item, onClick: onNavigateToFrameworks || item.onClick };
      case "community":
        return { ...item, onClick: onNavigateToCommunity || item.onClick };
      case "innovation":
        return { ...item, onClick: onNavigateToInnovation || item.onClick };
      case "progress":
        return { ...item, onClick: onNavigateToProgress || item.onClick };
      default:
        return item;
    }
  });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerChildren}
      className={`bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 sm:p-8 lg:p-10 border border-primary/20 shadow-sm ${className}`}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground font-heading mb-3">Navigate AI with Confidence</h2>
        <p className="text-muted-foreground text-base leading-relaxed">Your platform-agnostic AI guidance hub - works with ANY tool you use</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        {finalItems.map((item) => (
          <motion.div
            key={item.id}
            variants={fadeInUp}
            className="group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={item.variant || "outline"}
              className={`w-full h-auto p-6 sm:p-8 flex items-center gap-4 hover:shadow-lg transition-all duration-300 min-w-0 ${
                item.variant === "default" 
                  ? "bg-primary hover:bg-primary/90 text-white border-primary" 
                  : "hover:border-primary/50 hover:bg-primary/5"
              }`}
              onClick={item.onClick}
            >
              <div className={`p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                item.variant === "default" 
                  ? "bg-white/20 group-hover:bg-white/30" 
                  : "bg-primary/10 group-hover:bg-primary/20"
              }`}>
                {item.icon}
              </div>
              
              <div className="flex-1 text-left min-w-0 overflow-hidden">
                <div className="font-semibold text-lg mb-1 truncate">{item.label}</div>
                <div className={`text-sm line-clamp-2 overflow-hidden ${
                  item.variant === "default" 
                    ? "text-white/80" 
                    : "text-muted-foreground group-hover:text-foreground"
                }`}>
                  {item.description}
                </div>
              </div>
              
              <ArrowRight className={`h-5 w-5 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0 ${
                item.variant === "default" ? "text-white/80" : "text-muted-foreground group-hover:text-primary"
              }`} />
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
