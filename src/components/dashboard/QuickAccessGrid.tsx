import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  BookOpen,
  ArrowRight,
  User
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
  onStartCoach?: () => void;
  user?: {
    name?: string;
    school?: string;
    subject?: string;
    gradeLevel?: string;
  };
  className?: string;
}

const getDefaultItems = (
  user?: QuickAccessGridProps['user']
): QuickAccessItem[] => [
  {
    id: "coach",
    label: "Prompt Coach",
    description: "Create Louisiana-aligned prompts with AI guidance",
    icon: <MessageSquare className="h-6 w-6" />,
    onClick: () => {},
    variant: "default"
  },
  {
    id: "library",
    label: "My Prompts",
    description: "View and manage your saved prompts",
    icon: <BookOpen className="h-6 w-6" />,
    onClick: () => {},
    variant: "outline"
  },
  {
    id: "profile",
    label: "My Profile",
    description: `${user?.gradeLevel && user?.subject ? `Grade ${user.gradeLevel} ${user.subject}` : "Complete your teaching profile"}`,
    icon: <User className="h-6 w-6" />,
    onClick: () => {},
    variant: "outline"
  }
];

export function QuickAccessGrid({
  items,
  onStartCoach,
  user,
  className = ""
}: QuickAccessGridProps) {
  const navigate = useNavigate();
  const defaultItems = getDefaultItems(user);
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
        return { ...item, onClick: onStartCoach || (() => navigate('/coach')) };
      case "library":
        return { ...item, onClick: () => navigate('/coach?view=library') };
      case "profile":
        return { ...item, onClick: () => navigate('/profile') };
      default:
        return item;
    }
  });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerChildren}
      className={`rounded-2xl ${spacing.card} border border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground font-heading mb-2">Quick Access</h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Get started with your Louisiana-aligned prompt coaching
        </p>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${spacing.gridGap}`}>
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
