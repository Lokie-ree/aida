import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  Target, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck,
  Star,
  Shield,
  Lightbulb,
  X,
  ExternalLink
} from "lucide-react";
import { LoadingSpinner } from "../shared/LoadingStates";
import { EmptyStateNotFound } from "../shared/EmptyState";
import { toast } from "sonner";
import { spacing } from "@/lib/spacing";

interface FrameworkDetailProps {
  frameworkId: string;
  onClose: () => void;
  onAction: (frameworkId: string, action: "copy" | "save" | "unsave" | "tried") => void;
  isSaved: boolean;
}

export function FrameworkDetail({ frameworkId, onClose, onAction, isSaved }: FrameworkDetailProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  
  const framework = useQuery(api.frameworks.getFrameworkById, { frameworkId });

  const handleCopyPrompt = async () => {
    if (!framework) return;
    
    try {
      await navigator.clipboard.writeText(framework.samplePrompt);
      setCopiedPrompt(true);
      onAction(frameworkId, "copy");
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (error) {
      console.error("Failed to copy prompt:", error);
      toast.error("Failed to copy prompt. Please try again.");
    }
  };

  const handleSave = () => {
    onAction(frameworkId, isSaved ? "unsave" : "save");
  };

  const handleTried = () => {
    onAction(frameworkId, "tried");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return <Target className="h-4 w-4" />;
      case "intermediate":
        return <Star className="h-4 w-4" />;
      case "advanced":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (framework === undefined) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
          aria-describedby="loading-description"
        >
          <DialogHeader>
            <DialogTitle>Loading Framework</DialogTitle>
            <p id="loading-description" className="sr-only">
              Loading framework details, please wait
            </p>
          </DialogHeader>
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-3 text-muted-foreground">
              <LoadingSpinner size="md" />
              <span>Loading framework...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!framework) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
          aria-describedby="error-description"
        >
          <DialogHeader>
            <DialogTitle>Framework Not Found</DialogTitle>
            <p id="error-description" className="sr-only">
              The requested framework could not be found
            </p>
          </DialogHeader>
          <div className="flex justify-center items-center h-64">
            <EmptyStateNotFound
              title="Framework not found"
              description="The requested framework could not be found."
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-primary/5"
        aria-describedby="framework-detail-description"
      >
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start justify-between"
          >
            <div className="flex-1">
              <DialogTitle className="text-2xl md:text-3xl font-bold mb-2 font-heading">
                {framework.title}
              </DialogTitle>
              <p id="framework-detail-description" className="sr-only">
                Framework details including challenge, solution, sample prompt, and usage statistics
              </p>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="outline">
                  {framework.module === "ai-basics-hub" ? "AI Basics Hub" : "Instructional Expert Hub"}
                </Badge>
                <Badge variant="outline">
                  {framework.category.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`flex items-center gap-1 ${getDifficultyColor(framework.difficultyLevel)}`}
                >
                  {getDifficultyIcon(framework.difficultyLevel)}
                  <span className="capitalize">{framework.difficultyLevel}</span>
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Framework Stats */}
          <div className={`grid grid-cols-1 md:grid-cols-3 ${spacing.gridGapSmall}`}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className={spacing.card}>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{framework.timeEstimate} min</p>
                    <p className="text-xs text-muted-foreground">Time estimate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className={spacing.card}>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {framework.averageRating ? framework.averageRating.toFixed(1) : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">Average rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className={spacing.card}>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{framework.usageCount}</p>
                      <p className="text-xs text-muted-foreground">Times used</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* The Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                The Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {framework.challenge}
              </p>
            </CardContent>
          </Card>
          </motion.div>

          {/* The Solution */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                The AI-Powered Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {framework.solution}
                </pre>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* Sample Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5 text-primary" />
                Sample Prompt
              </CardTitle>
              <CardDescription>
                Copy this prompt and paste it into your preferred AI platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                  {framework.samplePrompt}
                </pre>
                <Button
                  size="sm"
                  onClick={handleCopyPrompt}
                  className="absolute top-2 right-2"
                  disabled={copiedPrompt}
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* Ethical Guardrail */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Ethical Guardrail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 leading-relaxed">
                  {framework.ethicalGuardrail}
                </p>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* Tips and Variations */}
          {framework.tipsAndVariations && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 }}
            >
              <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Tips and Variations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {framework.tipsAndVariations}
              </p>
            </CardContent>
          </Card>
            </motion.div>
          )}

          {/* Louisiana Standards Alignment */}
          {framework.louisianaStandards && framework.louisianaStandards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.0 }}
            >
              <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Louisiana Standards Alignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {framework.louisianaStandards.map((standard, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-2">
                      {standard}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            </motion.div>
          )}

          {/* LER Domains */}
          {framework.lerDomains && framework.lerDomains.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.1 }}
            >
              <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Louisiana Educator Rubric Domains
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {framework.lerDomains.map((domain, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            </motion.div>
          )}

          {/* Platform Compatibility */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.2 }}
          >
            <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary" />
                Platform Compatibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {framework.platformCompatibility.map((platform, index) => (
                  <Badge key={index} variant="outline">
                    {platform}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.3 }}
            className="flex flex-wrap gap-3 pt-4 border-t border-primary/20"
          >
            <Button onClick={handleSave} variant={isSaved ? "default" : "outline"}>
              {isSaved ? (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save Framework
                </>
              )}
            </Button>
            <Button onClick={handleTried} variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Mark as Tried
            </Button>
            <Button onClick={handleCopyPrompt} variant="outline" disabled={copiedPrompt}>
              {copiedPrompt ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Prompt
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
