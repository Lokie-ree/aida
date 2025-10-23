import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, ArrowRight, Clock, Star } from "lucide-react";

export interface Framework {
  _id: string;
  frameworkId: string;
  title: string;
  module: "ai-basics-hub" | "instructional-expert-hub";
  category: string;
  tags: string[];
  challenge: string;
  timeEstimate: number;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  usageCount: number;
  averageRating?: number;
}

export interface FeaturedRecommendationProps {
  framework: Framework;
  userContext?: {
    subject?: string;
    school?: string;
  };
  onTryFramework?: (frameworkId: string) => void;
  onViewAll?: () => void;
  className?: string;
}

export function FeaturedRecommendation({ 
  framework, 
  userContext,
  onTryFramework,
  onViewAll,
  className = ""
}: FeaturedRecommendationProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800 border-green-200";
      case "intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPersonalizedMessage = () => {
    if (userContext?.subject) {
      return `Perfect for ${userContext.subject} teachers getting started with AI`;
    }
    return "Perfect for Louisiana educators getting started with AI";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground font-heading">Today's Recommendation</h2>
            <p className="text-muted-foreground">Based on your progress, try this framework:</p>
          </div>
        </div>
      </div>

        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Framework Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-foreground font-heading">{framework.title}</h3>
              <Badge className={`${getDifficultyColor(framework.difficultyLevel)} font-medium`}>
                {framework.difficultyLevel}
              </Badge>
            </div>
            
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {framework.challenge}
            </p>
            
            <p className="text-sm text-primary font-medium mb-4">
              {getPersonalizedMessage()}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{framework.timeEstimate} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{framework.averageRating?.toFixed(1) || 'New'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>{framework.category}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {framework.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 font-semibold"
              onClick={() => onTryFramework?.(framework.frameworkId)}
            >
              Try This Framework
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={onViewAll}
              className="font-medium"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
