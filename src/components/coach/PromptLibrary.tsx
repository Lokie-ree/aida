import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
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
import { Trash2, CheckCircle, Copy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

interface PromptLibraryProps {
  onSelectPrompt: (prompt: any) => void;
}

export function PromptLibrary({ onSelectPrompt }: PromptLibraryProps) {
  const prompts = useQuery(api.promptCoach.getSavedPrompts);
  const deletePrompt = useMutation(api.promptCoach.deleteSavedPrompt);
  const toggleWorked = useMutation(api.promptCoach.toggleWorkedInClassroom);
  const [deleteId, setDeleteId] = useState<any>(null);

  const handleDelete = async (id: any) => {
    try {
      await deletePrompt({ promptId: id });
      toast.success("Prompt deleted");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete prompt");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied! Paste into ChatGPT, Claude, or your preferred AI tool.");
  };

  const handleToggleWorked = async (id: any, currentStatus: boolean) => {
    try {
      await toggleWorked({ promptId: id, worked: !currentStatus });
      toast.success(currentStatus ? "Removed from worked list" : "Marked as worked in classroom");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (prompts === undefined) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Loading library...
        </div>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Copy className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No saved prompts yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mb-4">
            Start a coaching session to generate and save high-quality, Louisiana-aligned prompts.
          </p>
          <Button onClick={() => onSelectPrompt(null)}>
            Start Coaching Session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto flex flex-col gap-4">
        {prompts.map((prompt) => (
          <Card key={prompt._id} className="flex flex-col h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex gap-2 flex-wrap">
                  {prompt.context.grade && <Badge variant="outline">{prompt.context.grade}</Badge>}
                  {prompt.context.subject && <Badge variant="outline">{prompt.context.subject}</Badge>}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(prompt.createdAt, { addSuffix: true })}
                </span>
              </div>
              {prompt.context.topic && <CardTitle className="text-base mt-2">{prompt.context.topic}</CardTitle>}
            </CardHeader>
            <CardContent className="flex-1 pb-3">
              <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap font-mono bg-muted/50 p-2 rounded">
                {prompt.promptText}
              </p>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between border-t p-3 bg-muted/10 mt-auto">
              <div className="flex gap-1">
                <Button 
                  variant={prompt.feedback?.workedInClassroom ? "default" : "ghost"} 
                  size="sm" 
                  className="h-8 gap-1"
                  onClick={() => handleToggleWorked(prompt._id, prompt.feedback?.workedInClassroom || false)}
                  title="Worked in classroom"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  {prompt.feedback?.workedInClassroom && (
                    <span className="text-xs">Worked</span>
                  )}
                </Button>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleCopy(prompt.promptText)}>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="sr-only">Copy</span>
                </Button>
                <AlertDialog open={deleteId === prompt._id} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteId(prompt._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete</span>
                    </Button>
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
        ))}
      </div>
    </div>
  );
}
