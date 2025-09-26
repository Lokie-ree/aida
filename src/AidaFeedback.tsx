import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Trash2, Lightbulb } from "lucide-react";

interface AidaFeedbackProps {
  currentSpaceId?: Id<"spaces"> | null;
}

export function AidaFeedback({ currentSpaceId }: AidaFeedbackProps) {
  const [lessonPlan, setLessonPlan] = useState("");
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const generateFeedback = useAction(api.feedback.generateFeedback);
  const feedbackHistory = useQuery(api.feedback.getFeedbackHistory, { 
    spaceId: currentSpaceId || undefined 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lessonPlan.trim()) {
      toast.error("Please enter a lesson plan to get feedback");
      return;
    }

    setIsLoading(true);
    setFeedback("");

    try {
      const result = await generateFeedback({
        lessonPlan: lessonPlan.trim(),
        title: title.trim() || undefined,
        spaceId: currentSpaceId || undefined,
      });
      
      setFeedback(result);
      toast.success("Feedback generated successfully!");
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error("Failed to generate feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setLessonPlan("");
    setTitle("");
    setFeedback("");
  };

  return (
    <div className="space-y-6">
      {/* Main Feedback Form */}
      <Card>
        <CardHeader>
          <CardTitle>AI Lesson Feedback</CardTitle>
          <CardDescription>
            Get instant AI feedback on your lesson plans and teaching content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title (Optional)</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Introduction to Photosynthesis"
                aria-describedby="title-help"
              />
              <p id="title-help" className="text-xs text-muted-foreground">
                Optional: Give your lesson a descriptive title
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lessonPlan">Lesson Plan or Teaching Content</Label>
              <Textarea
                id="lessonPlan"
                value={lessonPlan}
                onChange={(e) => setLessonPlan(e.target.value)}
                placeholder="Paste your lesson plan, teaching objectives, activities, or any instructional content you'd like feedback on..."
                rows={12}
                className="min-h-[200px] resize-y"
                aria-describedby="lesson-plan-help"
                required
              />
              <p id="lesson-plan-help" className="text-xs text-muted-foreground">
                Required: Enter your lesson plan or instructional content for AI feedback
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isLoading || !lessonPlan.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Feedback...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get AI Feedback
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Feedback Display */}
      {(feedback || isLoading) && (
        <Card>
          <CardHeader>
            <CardTitle>AI Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Analyzing your lesson plan...</span>
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                <div className="bg-muted rounded-lg p-4 whitespace-pre-wrap leading-relaxed">
                  {feedback}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Feedback History */}
      {feedbackHistory && feedbackHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback Sessions</CardTitle>
            <CardDescription>
              Your previous AI feedback sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {feedbackHistory.map((session) => (
                  <Card key={session._id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">
                          {session.title || "Untitled Lesson"}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(session._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {session.lessonPlan.substring(0, 150)}...
                      </p>
                      
                      <details className="text-sm">
                        <summary className="cursor-pointer text-primary hover:text-primary/80">
                          View Feedback
                        </summary>
                        <div className="mt-2 p-3 bg-muted rounded whitespace-pre-wrap">
                          {session.feedback}
                        </div>
                      </details>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
