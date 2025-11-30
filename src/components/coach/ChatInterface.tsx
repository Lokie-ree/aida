import React, { useState, useEffect, useRef } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Send, User, Bot, Loader2, Save, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ChatInterfaceProps {
  conversationId: Id<"promptConversations"> | null;
  onStartNew: () => void;
}

export function ChatInterface({ conversationId, onStartNew }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Save prompt dialog state
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [promptToSave, setPromptToSave] = useState<string>("");
  const [saveContext, setSaveContext] = useState({ grade: "", subject: "", topic: "" });

  const conversation = useQuery(api.promptCoach.getConversation, 
    conversationId ? { conversationId } : "skip"
  );
  
  const sendMessage = useAction(api.promptCoach.sendMessage);
  const savePromptMutation = useMutation(api.promptCoach.savePrompt);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages, isSending]);

  const handleSend = async () => {
    if (!inputValue.trim() || !conversationId) return;

    const message = inputValue;
    setInputValue("");
    setIsSending(true);

    try {
      await sendMessage({ conversationId, message });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const openSaveDialog = (text: string) => {
    setPromptToSave(text);
    setIsSaveDialogOpen(true);
  };

  const handleSavePrompt = async () => {
    if (!conversationId) return;
    
    try {
      await savePromptMutation({
        conversationId,
        promptText: promptToSave,
        context: saveContext
      });
      toast.success("Prompt saved to your library");
      setIsSaveDialogOpen(false);
      setSaveContext({ grade: "", subject: "", topic: "" });
    } catch (error) {
      console.error("Failed to save prompt:", error);
      toast.error("Failed to save prompt");
    }
  };

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <Bot className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Welcome to Prompt Coach</h2>
        <p className="text-muted-foreground max-w-md">
          I'm here to help you design high-quality, Louisiana-aligned AI prompts. 
          Tell me what you're teaching, and we'll build the perfect prompt together.
        </p>
        <Button onClick={onStartNew} size="lg">
          Start Coaching Session
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border shadow-sm">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 pb-4">
          {conversation?.messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex w-full gap-3",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border",
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              
              <div className={cn(
                "flex flex-col gap-2 max-w-[80%]",
                msg.role === "user" ? "items-end" : "items-start"
              )}>
                <div
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm whitespace-pre-wrap",
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-foreground"
                  )}
                >
                  {msg.content}
                </div>
                
                {msg.role === "assistant" && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(msg.content)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openSaveDialog(msg.content)}>
                      <Save className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isSending && (
            <div className="flex w-full gap-3">
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border bg-muted">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-3 w-3 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your lesson or what you need help with..."
            disabled={isSending}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isSending || !inputValue.trim()}>
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save to My Prompts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Prompt Content</Label>
              <Textarea 
                value={promptToSave} 
                onChange={(e) => setPromptToSave(e.target.value)} 
                className="h-32"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Grade Level</Label>
                <Input 
                  placeholder="e.g. 8th Grade" 
                  value={saveContext.grade}
                  onChange={(e) => setSaveContext({...saveContext, grade: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input 
                  placeholder="e.g. Math" 
                  value={saveContext.subject}
                  onChange={(e) => setSaveContext({...saveContext, subject: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Topic</Label>
              <Input 
                placeholder="e.g. Systems of Equations" 
                value={saveContext.topic}
                onChange={(e) => setSaveContext({...saveContext, topic: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePrompt}>Save Prompt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

