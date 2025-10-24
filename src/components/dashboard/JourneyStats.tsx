import { motion } from "framer-motion";
import { BookOpen, Clock, Lightbulb, TrendingUp } from "lucide-react";

export interface JourneyStatsProps {
  stats: {
    frameworksTried: number;
    timeSaved: number; // in minutes
    innovationsShared: number;
    weeklyStreak: number;
  };
  className?: string;
}

export function JourneyStats({ stats, className = "" }: JourneyStatsProps) {
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

  const statItems = [
    {
      value: stats.frameworksTried,
      label: "AI Frameworks Mastered",
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    },
    {
      value: `${Math.round(stats.timeSaved / 60)}h`,
      label: "Hours Reclaimed This Week",
      icon: Clock,
      color: "text-accent-600",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20"
    },
    {
      value: stats.innovationsShared,
      label: "Success Stories Shared",
      icon: Lightbulb,
      color: "text-secondary-600",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/20"
    },
    {
      value: stats.weeklyStreak,
      label: "Day Learning Streak",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple/10",
      borderColor: "border-purple/20"
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerChildren}
      className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ${className}`}
    >
      {statItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div 
            key={item.label}
            variants={fadeInUp} 
            className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <IconComponent className={`h-5 w-5 ${item.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold text-foreground font-heading">{item.value}</p>
                <p className="text-xs text-muted-foreground font-medium leading-tight">{item.label}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
