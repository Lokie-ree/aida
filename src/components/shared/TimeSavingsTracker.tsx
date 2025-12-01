import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSavingsTrackerProps {
  weeklyMinutes: number;
  monthlyMinutes: number;
  totalMinutes: number;
  goal: number; // Weekly goal in minutes
  className?: string;
}

export function TimeSavingsTracker({
  weeklyMinutes,
  monthlyMinutes,
  totalMinutes,
  goal,
  className
}: TimeSavingsTrackerProps) {
  const weeklyHours = Math.round(weeklyMinutes / 60 * 10) / 10;
  const monthlyHours = Math.round(monthlyMinutes / 60 * 10) / 10;
  const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
  const goalHours = Math.round(goal / 60 * 10) / 10;

  // If weekly data isn't available, use total for progress tracking
  const hasWeeklyData = weeklyMinutes > 0 || totalMinutes === 0;
  const progressMinutes = hasWeeklyData ? weeklyMinutes : totalMinutes;
  const progressPercentage = Math.min((progressMinutes / goal) * 100, 100);
  const isGoalMet = progressMinutes >= goal;
  
  const getProgressColor = () => {
    if (progressPercentage >= 100) return "bg-green-500";
    if (progressPercentage >= 75) return "bg-blue-500";
    if (progressPercentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getMotivationalMessage = () => {
    if (isGoalMet) {
      return "🎉 Goal achieved! You're reclaiming your time like a pro!";
    }
    if (progressPercentage >= 75) {
      return "🔥 Almost there! You're so close to your goal!";
    }
    if (progressPercentage >= 50) {
      return "💪 Great progress! Keep up the momentum!";
    }
    return "🚀 Every minute saved counts! You've got this!";
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  const staggerChildren = {
    animate: {
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={staggerChildren}
      className={cn("w-full space-y-6", className)}
    >
        {/* Title */}
        <motion.div 
          variants={fadeInUp}
          className="flex items-center gap-2"
        >
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground font-heading">Time Savings Tracker</h3>
        </motion.div>

        {/* Progress Bar - Only show when tracking weekly data */}
        {hasWeeklyData && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Weekly Goal</span>
              </div>
              <Badge variant={isGoalMet ? "default" : "secondary"}>
                {weeklyHours}h / {goalHours}h
              </Badge>
            </div>

            <Progress
              value={progressPercentage}
              className="h-3"
            />

            <p className="text-xs text-muted-foreground text-center">
              {getMotivationalMessage()}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <motion.div
          variants={staggerChildren}
          className="grid grid-cols-1 gap-4"
        >
          {/* Only show weekly/monthly if we have real data */}
          {hasWeeklyData && weeklyMinutes > 0 && (
            <>
              <motion.div
                variants={fadeInUp}
                className="text-center space-y-1"
              >
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-600">
                    {weeklyHours}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">This Week</p>
                <p className="text-xs font-medium">hours saved</p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="text-center space-y-1"
              >
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-2xl font-bold text-green-600">
                    {monthlyHours}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-xs font-medium">hours saved</p>
              </motion.div>
            </>
          )}

          {/* Always show total */}
          <motion.div
            variants={fadeInUp}
            className="text-center space-y-1"
          >
            <div className="flex items-center justify-center gap-1">
              <Award className="h-4 w-4 text-purple-500" />
              <span className="text-3xl font-bold text-purple-600">
                {totalHours}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {hasWeeklyData && weeklyMinutes > 0 ? "All Time" : "Total Time Saved"}
            </p>
            <p className="text-xs font-medium">hours saved using Pelican AI</p>
          </motion.div>
        </motion.div>

        {/* Quick Stats */}
        {hasWeeklyData && weeklyMinutes > 0 && (
          <div className="pt-4 border-t border-border/50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Avg per day</p>
                <p className="font-semibold">
                  {Math.round(weeklyMinutes / 7)} min
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Goal progress</p>
                <p className="font-semibold">
                  {Math.round(progressPercentage)}%
                </p>
              </div>
            </div>
          </div>
        )}
    </motion.div>
  );
}