import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Heart, 
  Star, 
  Clock, 
  User, 
  School, 
  BookOpen,
  ThumbsUp,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface InnovationCardProps {
  innovation: {
    _id: string;
    title: string;
    description: string;
    userName: string;
    school: string;
    subject: string;
    tags: string[];
    timeSaved?: number;
    likes: number;
    triesCount: number;
    createdAt: number;
  };
  onLike?: () => void;
  onTried?: () => void;
  isLiked?: boolean;
  isTried?: boolean;
  variant?: "default" | "compact";
}

export function InnovationCard({ 
  innovation, 
  onLike, 
  onTried, 
  isLiked = false,
  isTried = false,
  variant = "default"
}: InnovationCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const likeInnovation = useMutation(api.innovations.likeInnovation);
  const markTried = useMutation(api.innovations.markInnovationTried);

  const handleLike = () => {
    likeInnovation({ innovationId: innovation._id as any })
      .then(() => {
        if (onLike) onLike();
      })
      .catch((error) => {
        console.error("Error liking innovation:", error);
        toast.error("Failed to like innovation. Please try again.");
      });
  };

  const handleTried = () => {
    markTried({ innovationId: innovation._id as any })
      .then(() => {
        if (onTried) onTried();
        toast.success("Marked as tried! Thanks for sharing your experience.");
      })
      .catch((error) => {
        console.error("Error marking as tried:", error);
        toast.error("Failed to mark as tried. Please try again.");
      });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const shouldTruncate = innovation.description.length > 150;
  const displayDescription = showFullDescription || !shouldTruncate 
    ? innovation.description 
    : innovation.description.substring(0, 150) + "...";

  if (variant === "compact") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm line-clamp-1">{innovation.title}</h3>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {innovation.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{innovation.userName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{innovation.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>{innovation.triesCount}</span>
                </div>
                {innovation.timeSaved && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{innovation.timeSaved}min</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={isLiked ? "default" : "outline"}
                onClick={handleLike}
                className="px-2"
              >
                <Heart className={cn("h-3 w-3", isLiked && "fill-current")} />
              </Button>
              <Button
                size="sm"
                variant={isTried ? "default" : "outline"}
                onClick={handleTried}
                className="px-2"
              >
                <CheckCircle className={cn("h-3 w-3", isTried && "fill-current")} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg line-clamp-1">{innovation.title}</CardTitle>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{innovation.userName}</span>
              </div>
              <div className="flex items-center gap-1">
                <School className="h-4 w-4" />
                <span>{innovation.school}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{innovation.subject}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDate(innovation.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="mb-4">
          {displayDescription}
          {shouldTruncate && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-primary hover:underline ml-1"
            >
              {showFullDescription ? "Show less" : "Read more"}
            </button>
          )}
        </CardDescription>

        {/* Tags */}
        {innovation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {innovation.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{innovation.likes} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>{innovation.triesCount} tried</span>
            </div>
            {innovation.timeSaved && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Saved {innovation.timeSaved} min</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isLiked ? "default" : "outline"}
              onClick={handleLike}
              className="flex items-center gap-1"
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              {isLiked ? "Liked" : "Like"}
            </Button>
            <Button
              size="sm"
              variant={isTried ? "default" : "outline"}
              onClick={handleTried}
              className="flex items-center gap-1"
            >
              <CheckCircle className={cn("h-4 w-4", isTried && "fill-current")} />
              {isTried ? "Tried" : "I Tried This"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
