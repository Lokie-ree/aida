import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Users, Copy, Bookmark, BookmarkCheck } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface FrameworkCardProps {
  framework: {
    _id: Id<"frameworks">;
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
  };
  variant?: "compact" | "expanded";
  onView: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

export function FrameworkCard({ 
  framework, 
  variant = "compact", 
  onView, 
  onSave, 
  isSaved = false 
}: FrameworkCardProps) {
  const difficultyColors = {
    beginner: "bg-green-100 text-green-800 border-green-200",
    intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    advanced: "bg-red-100 text-red-800 border-red-200",
  };

  const moduleColors = {
    "ai-basics-hub": "bg-blue-100 text-blue-800 border-blue-200",
    "instructional-expert-hub": "bg-purple-100 text-purple-800 border-purple-200",
  };

  const copyPrompt = () => {
    // This would copy the sample prompt to clipboard
    // Implementation depends on how prompts are stored/accessed
    console.log("Copy prompt functionality");
  };

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20",
      variant === "expanded" && "h-full"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge 
            variant="outline" 
            className={cn("text-xs font-medium", moduleColors[framework.module])}
          >
            {framework.module === "ai-basics-hub" ? "AI Basics" : "Instructional Expert"}
          </Badge>
          <Badge 
            variant="outline" 
            className={cn("text-xs font-medium", difficultyColors[framework.difficultyLevel])}
          >
            {framework.difficultyLevel}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-mono text-muted-foreground">
            {framework.frameworkId}
          </span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{framework.usageCount}</span>
          </div>
          {framework.averageRating && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{framework.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
          {framework.title}
        </CardTitle>
        
        <CardDescription className="text-sm line-clamp-2">
          {framework.challenge}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-4">
          {framework.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {framework.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{framework.tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{framework.timeEstimate} min</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="capitalize">{framework.category.replace("-", " ")}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onView} 
            className="flex-1"
            size="sm"
          >
            View Details
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={copyPrompt}
            className="px-3"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          {onSave && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onSave}
              className="px-3"
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}