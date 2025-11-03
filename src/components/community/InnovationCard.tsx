import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Heart, 
  Clock, 
  User, 
  School, 
  BookOpen,
  CheckCircle,
  Link as LinkIcon
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
    relatedFramework?: string; // Framework ID
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
  const navigate = useNavigate();
  
  // Get framework details if relatedFramework exists
  const framework = useQuery(
    api.frameworks.getFrameworkByConvexId,
    innovation.relatedFramework ? { frameworkConvexId: innovation.relatedFramework as any } : "skip"
  );
  
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
      <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-background to-primary/5">
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
                data-testid="innovation-card-like"
                aria-label={isLiked ? "Unlike innovation" : "Like innovation"}
                size="sm"
                variant={isLiked ? "default" : "outline"}
                onClick={handleLike}
                className="px-2"
              >
                <Heart className={cn("h-3 w-3", isLiked && "fill-current")} aria-hidden="true" />
              </Button>
              <Button
                data-testid="innovation-card-tried"
                aria-label={isTried ? "Mark as not tried" : "Mark as tried"}
                size="sm"
                variant={isTried ? "default" : "outline"}
                onClick={handleTried}
                className="px-2"
              >
                <CheckCircle className={cn("h-3 w-3", isTried && "fill-current")} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      data-testid="innovation-card"
    >
      <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-to-br from-background to-primary/5">
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
          <div className="flex flex-wrap gap-1 mb-4" data-testid="innovation-card-tags">
            {innovation.tags.map((tag) => (
              <Badge key={tag} data-testid="innovation-tag" variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Framework Connection */}
        {innovation.relatedFramework && framework && (
          <div className="mt-3 mb-4 pt-3 border-t border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Based on framework:
                </span>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 transition-colors">
                  {framework.frameworkId}: {framework.title}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/frameworks?view=${framework.frameworkId}`)}
                className="text-primary hover:text-primary/80"
              >
                View Framework →
              </Button>
            </div>
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

          <ButtonGroup>
            <Button
              data-testid="innovation-card-like"
              aria-label={isLiked ? "Unlike innovation" : "Like innovation"}
              size="sm"
              variant={isLiked ? "default" : "outline"}
              onClick={handleLike}
              className="flex items-center gap-1"
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} aria-hidden="true" />
              {isLiked ? "Liked" : "Like"}
            </Button>
            <Button
              data-testid="innovation-card-tried"
              aria-label={isTried ? "Mark as not tried" : "Mark as tried"}
              size="sm"
              variant={isTried ? "default" : "outline"}
              onClick={handleTried}
              className="flex items-center gap-1"
            >
              <CheckCircle className={cn("h-4 w-4", isTried && "fill-current")} aria-hidden="true" />
              {isTried ? "Tried" : "I Tried This"}
            </Button>
          </ButtonGroup>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
