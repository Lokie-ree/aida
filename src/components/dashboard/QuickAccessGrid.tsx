import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  Lightbulb, 
  TrendingUp,
  ArrowRight,
  FileCheck,
  MessageSquare
} from "lucide-react";
import { spacing } from "@/lib/spacing";

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
    id: "coach",
    label: "Conversational Coach",
    description: "Start a new coaching session",
    icon: <MessageSquare className="h-6 w-6" />,
    onClick: () => {},
    variant: "default"
  },
  {
    id: "frameworks",
    label: "Frameworks",
    description: "10 Louisiana Standards-aligned frameworks",
    icon: <BookOpen className="h-6 w-6" />,
    onClick: () => {},
    variant: "outline"
  },
  {
    id: "alignment-scorecard",
    label: "Alignment Scorecard",
    description: "Analyze content against Louisiana Standards",
    icon: <FileCheck className="h-6 w-6" />,
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
  onNavigateToProgress,
  userStats,
  className = ""
}: QuickAccessGridProps) {
  const navigate = useNavigate();
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
      case "coach":
        return { ...item, onClick: () => navigate('/coach') };
      case "frameworks":
        return { ...item, onClick: onNavigateToFrameworks || item.onClick };
      case "alignment-scorecard":
        return { ...item, onClick: () => navigate('/alignment-scorecard') };
      case "progress":
        return { ...item, onClick: onNavigateToProgress || (() => navigate('/time-tracking')) };
      default:
        return item;
    }
  });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerChildren}
      className={`bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl ${spacing.card} border border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground font-heading mb-2">Navigate AI with Confidence</h2>
        <p className="text-muted-foreground text-base leading-relaxed">Your platform-agnostic AI guidance hub - works with ANY tool you use</p>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${spacing.gridGap}`}>
        {finalItems.map((item) => (
          <motion.div
            key={item.id}
            variants={fadeInUp}
            className="group"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={item.variant || "outline"}
              className={`w-full h-auto ${spacing.card} flex items-center gap-4 hover:shadow-xl transition-all duration-300 cursor-pointer min-w-0 ${
                item.variant === "default" 
                  ? "bg-primary hover:bg-primary/90 text-white border-primary shadow-md" 
                  : "hover:border-primary/50 hover:bg-primary/5 border-2"
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
