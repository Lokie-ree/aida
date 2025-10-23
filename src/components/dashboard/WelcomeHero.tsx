import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export interface WelcomeHeroProps {
  user: {
    name?: string;
    school?: string;
    subject?: string;
  };
  userProgress?: {
    frameworksTried: number;
    timeSaved: number;
    weeklyStreak: number;
  };
  onPrimaryAction?: () => void;
  primaryActionText?: string;
  primaryActionIcon?: React.ReactNode;
}

export function WelcomeHero({ 
  user, 
  userProgress,
  onPrimaryAction,
  primaryActionText = "Start Learning AI Frameworks",
  primaryActionIcon = <BookOpen className="h-5 w-5" />
}: WelcomeHeroProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  // Personalized messaging based on user progress and context
  const getPersonalizedMessage = () => {
    if (!userProgress) {
      return user.school && user.subject 
        ? `Ready to explore AI frameworks for ${user.subject} education at ${user.school}`
        : "Ready to explore AI frameworks for Louisiana education";
    }

    const { frameworksTried, timeSaved, weeklyStreak } = userProgress;
    const hoursSaved = Math.round(timeSaved / 60 * 10) / 10;

    // New user (no frameworks tried)
    if (frameworksTried === 0) {
      return user.subject 
        ? `Let's get you started with AI frameworks designed for ${user.subject} teachers`
        : "Let's get you started with AI frameworks designed for Louisiana educators";
    }

    // Beginner (1-3 frameworks)
    if (frameworksTried <= 3) {
      return user.subject
        ? `Great start! You've tried ${frameworksTried} framework${frameworksTried > 1 ? 's' : ''} for ${user.subject} education`
        : `Great start! You've tried ${frameworksTried} framework${frameworksTried > 1 ? 's' : ''} - keep building your AI confidence`;
    }

    // Intermediate (4-8 frameworks)
    if (frameworksTried <= 8) {
      return user.subject
        ? `You're building momentum! ${frameworksTried} frameworks tried for ${user.subject} education${hoursSaved > 0 ? ` and ${hoursSaved}h saved` : ''}`
        : `You're building momentum! ${frameworksTried} frameworks tried${hoursSaved > 0 ? ` and ${hoursSaved}h saved` : ''}`;
    }

    // Advanced (9+ frameworks)
    return user.subject
      ? `You're an AI champion! ${frameworksTried} frameworks mastered for ${user.subject} education${hoursSaved > 0 ? ` and ${hoursSaved}h saved` : ''}`
      : `You're an AI champion! ${frameworksTried} frameworks mastered${hoursSaved > 0 ? ` and ${hoursSaved}h saved` : ''}`;
  };

  const getMotivationalSubtext = () => {
    if (!userProgress) return null;

    const { frameworksTried, weeklyStreak } = userProgress;

    if (frameworksTried === 0) {
      return "Every expert was once a beginner. Let's start your AI journey!";
    }

    if (weeklyStreak >= 3) {
      return "🔥 You're on fire! Keep that streak going!";
    }

    if (frameworksTried >= 5) {
      return "You're becoming a confident AI user - keep exploring!";
    }

    return "Every framework you try builds your AI confidence!";
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Personal Welcome */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-foreground leading-tight">
            Welcome back, <span 
              className="bg-gradient-to-r from-[#0ea5e9] to-[#1e40af] bg-clip-text text-transparent font-bold"
            >
              {user.name || "Educator"}
            </span>!
          </h1>
          <div className="mt-1 max-w-2xl">
            <p className="text-muted-foreground text-sm sm:text-base">
              {getPersonalizedMessage()}
            </p>
            {getMotivationalSubtext() && (
              <p className="text-primary/80 text-xs sm:text-sm font-medium mt-1">
                {getMotivationalSubtext()}
              </p>
            )}
            {user.school && user.subject && (
              <p className="text-muted-foreground text-xs mt-1">
                <span className="font-medium">{user.subject} Teacher</span>
                <span className="mx-2">•</span>
                <span>{user.school}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right: Primary Action */}
        <div className="flex-shrink-0">
          <Button 
            size="lg"
            className="h-12 px-6 bg-primary hover:bg-primary/90 text-base font-semibold"
            onClick={onPrimaryAction}
          >
            {primaryActionIcon}
            <span className="ml-2">{primaryActionText}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
