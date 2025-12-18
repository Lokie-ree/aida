import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, CheckCircle, Copy, Library, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Type for a generated prompt from the database
 */
type GeneratedPrompt = {
  _id: Id<"generatedPrompts">;
  userId: string;
  conversationId: Id<"promptConversations">;
  promptText: string;
  context: {
    grade?: string;
    subject?: string;
    topic?: string;
    challenge?: string;
  };
  feedback?: {
    rating: "positive" | "negative";
    workedInClassroom: boolean;
    notes?: string;
  };
  isExemplar: boolean;
  createdAt: number;
};

interface PromptLibraryProps {
  /** Callback when a prompt is selected (null for empty state CTA) */
  onSelectPrompt: (prompt: GeneratedPrompt | null) => void;
}

/**
 * Prompt library component displaying all saved prompts.
 * Supports expanding long prompts, rating display, and prompt management (copy, delete, mark as worked).
 */
export function PromptLibrary({ onSelectPrompt }: PromptLibraryProps) {
  const prompts = useQuery(api.promptCoach.getSavedPrompts);
  const deletePrompt = useMutation(api.promptCoach.deleteSavedPrompt);
  const toggleWorked = useMutation(api.promptCoach.toggleWorkedInClassroom);
  const [deleteId, setDeleteId] = useState<Id<"generatedPrompts"> | null>(null);
  const [expandedPrompts, setExpandedPrompts] = useState<Set<Id<"generatedPrompts">>>(new Set());

  const handleDelete = async (id: Id<"generatedPrompts">) => {
    try {
      await deletePrompt({ promptId: id });
      toast.success("Prompt deleted");
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete prompt:", error);
      toast.error("Unable to delete prompt. Please check your connection and try again.", {
        duration: 5000,
      });
      // Keep dialog open so user can retry
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied! Paste into ChatGPT, Claude, or your preferred AI tool.");
  };

  const handleToggleWorked = async (id: Id<"generatedPrompts">, currentStatus: boolean) => {
    try {
      await toggleWorked({ promptId: id, worked: !currentStatus });
      toast.success(currentStatus ? "Removed from worked list" : "Marked as worked in classroom");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Unable to update status. Please check your connection and try again.", {
        duration: 5000,
      });
    }
  };

  const toggleExpand = (promptId: Id<"generatedPrompts">) => {
    setExpandedPrompts(prev => {
      const next = new Set(prev);
      if (next.has(promptId)) {
        next.delete(promptId);
      } else {
        next.add(promptId);
      }
      return next;
    });
  };

  /**
   * Estimates if prompt text is long enough to need expansion.
   * Roughly 4 lines = ~200 characters.
   */
  const needsExpansion = (text: string) => text.length > 200;

  if (prompts === undefined) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex items-center justify-center text-muted-foreground"
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Library className="h-6 w-6" />
            </motion.div>
            <span className="text-sm">Loading your prompts...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-primary/10 p-4 rounded-full mb-4"
          >
            <Library className="h-8 w-8 text-primary" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-foreground"
          >
            No saved prompts yet
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mt-2 max-w-md mb-6 text-sm leading-relaxed"
          >
            Start a coaching session to generate and save high-quality, Louisiana-aligned prompts that you can use in any AI tool.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button onClick={() => onSelectPrompt(null)} size="lg" className="font-medium bg-primary hover:bg-primary/90">
              Start Coaching Session
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 p-1 scroll-smooth">
        <AnimatePresence mode="popLayout">
          {prompts.map((prompt, index) => (
            <motion.div
              key={prompt._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
            >
              <Card className="flex flex-col overflow-hidden border-primary/20 shadow-sm hover:shadow-md hover:border-primary/40 transition-all bg-card">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex gap-2 flex-wrap">
                      {prompt.context.grade && (
                        <Badge variant="outline" className="text-xs font-medium border-primary/30 bg-primary/5 text-primary hover:bg-primary/10">
                          {prompt.context.grade}
                        </Badge>
                      )}
                      {prompt.context.subject && (
                        <Badge variant="outline" className="text-xs font-medium border-primary/30 bg-primary/5 text-primary hover:bg-primary/10">
                          {prompt.context.subject}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(prompt.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  {prompt.context.topic && (
                    <CardTitle className="text-base mt-2 font-semibold text-foreground">{prompt.context.topic}</CardTitle>
                  )}
                </CardHeader>
                <CardContent className="flex-1 pb-3">
                  <div className="space-y-2">
                    <p className={`text-sm text-foreground whitespace-pre-wrap font-mono bg-primary/5 p-3 rounded-lg border border-primary/20 leading-relaxed ${
                      !expandedPrompts.has(prompt._id) && needsExpansion(prompt.promptText) ? "line-clamp-4" : ""
                    }`}>
                      {prompt.promptText}
                    </p>
                    {needsExpansion(prompt.promptText) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground hover:text-foreground rounded-lg"
                        onClick={() => toggleExpand(prompt._id)}
                      >
                        {expandedPrompts.has(prompt._id) ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Show more
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between p-3 mt-auto">
                  <div className="flex gap-1.5 items-center">
                    {prompt.feedback?.rating && (
                      <div className="flex items-center gap-0.5 mr-1">
                        {prompt.feedback.rating === "positive" ? (
                          <ThumbsUp className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <ThumbsDown className="h-3.5 w-3.5 text-destructive" />
                        )}
                      </div>
                    )}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={prompt.feedback?.workedInClassroom ? "default" : "ghost"}
                        size="sm"
                        className={`h-8 gap-1.5 transition-all rounded-lg ${
                          prompt.feedback?.workedInClassroom 
                            ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                            : "hover:bg-primary/10 hover:text-primary"
                        }`}
                        onClick={() => handleToggleWorked(prompt._id, prompt.feedback?.workedInClassroom || false)}
                        title="Worked in classroom"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        {prompt.feedback?.workedInClassroom && (
                          <span className="text-xs font-medium">Worked</span>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                  <div className="flex gap-1">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 transition-all rounded-lg hover:bg-primary/10 hover:text-primary" 
                        onClick={() => handleCopy(prompt.promptText)}
                        title="Copy prompt"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </motion.div>
                    <AlertDialog open={deleteId === prompt._id} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                      <AlertDialogTrigger asChild>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg"
                            onClick={() => setDeleteId(prompt._id)}
                            title="Delete prompt"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </motion.div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this prompt?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The prompt will be permanently removed from your library.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(prompt._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
