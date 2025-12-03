import React, { useState, useEffect, useRef } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Loader2, Save, MessageSquare, Copy, GraduationCap, BookOpen, Calculator, Scale, Target, Sparkles, Lightbulb, MessageCircle, Search } from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  
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
    const starterPrompts = [
      {
        icon: BookOpen,
        text: "Help me teach RL.8.1 (citing textual evidence) - my students struggle with this",
        category: "ELA Standard"
      },
      {
        icon: Calculator,
        text: "I need to differentiate instruction for multi-digit multiplication (4.NBT.B.5)",
        category: "Math Standard"
      },
      {
        icon: Scale,
        text: "I'm working on Indicator 1.3 - my lesson pacing always feels off",
        category: "LER Alignment"
      },
      {
        icon: Target,
        text: "My 6th graders won't engage with argumentative writing - need fresh ideas",
        category: "Engagement Challenge"
      }
    ];

    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8 space-y-4 md:space-y-6 overflow-y-auto">
        <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-600/10 p-4 md:p-5 rounded-full ring-2 ring-blue-500/20 mt-4 md:mt-0">
          <Bot className="h-10 w-10 md:h-14 md:w-14 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">Welcome to Prompt Coach</h2>
          <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
            Built by Louisiana teachers, for Louisiana teachers. I'll help you craft prompts aligned to
            <span className="font-semibold text-foreground"> Louisiana Student Standards</span> and the
            <span className="font-semibold text-foreground"> Louisiana Educator Rubric</span>.
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-3 pb-8 md:pb-0">
          <p className="text-sm text-muted-foreground font-medium">Try these examples:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {starterPrompts.map((prompt, idx) => {
              const IconComponent = prompt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onStartNew();
                    setInputValue(prompt.text);
                    setTimeout(() => inputRef.current?.focus(), 100);
                  }}
                  className="text-left p-4 rounded-lg border bg-card hover:bg-accent hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{prompt.category}</p>
                      <p className="text-sm text-foreground">{prompt.text}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={onStartNew} size="lg" className="gap-2 mt-4">
          <MessageSquare className="h-4 w-4" />
          Start Coaching Session
        </Button>

        <p className="text-xs text-muted-foreground max-w-lg">
          I'll ask clarifying questions to understand your context, then generate a Louisiana-aligned prompt
          you can use in ChatGPT, Claude, Gemini, or any AI tool.
        </p>
      </div>
    );
  }

  // Determine conversation phase based on message count and content
  const getConversationPhase = () => {
    if (!conversation?.messages || conversation.messages.length === 0) {
      return { phase: "starting", label: "Ready to start", icon: MessageCircle, color: "bg-gray-100 dark:bg-gray-800" };
    }

    const messageCount = conversation.messages.length;
    const hasPrompt = conversation.messages.some(msg =>
      msg.role === "assistant" && (
        msg.content.includes("PROMPT:") ||
        msg.content.includes("**PROMPT:**") ||
        msg.content.includes("Here's your prompt") ||
        msg.content.includes("Here is your prompt")
      )
    );

    if (hasPrompt) {
      return { phase: "completed", label: "Prompt Generated", icon: Sparkles, color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" };
    } else if (messageCount >= 6) {
      return { phase: "generating", label: "Preparing Your Prompt", icon: Target, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200" };
    } else if (messageCount >= 3) {
      return { phase: "clarifying", label: "Identifying Your Challenge", icon: Search, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200" };
    } else {
      return { phase: "understanding", label: "Understanding Your Context", icon: MessageCircle, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200" };
    }
  };

  const currentPhase = getConversationPhase();

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border shadow-sm">
      {/* Conversation Phase Header */}
      {conversation && conversation.messages.length > 0 && (
        <div className="border-b px-4 py-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full", currentPhase.color)}>
                <currentPhase.icon className="h-3.5 w-3.5" />
                {currentPhase.label}
              </div>
              <span className="text-xs text-muted-foreground">
                {currentPhase.phase === "completed"
                  ? "Ready to copy and use in any AI tool"
                  : "Louisiana standards & rubric being searched"}
              </span>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 pb-4">
          {/* Louisiana context indicator at top */}
          {conversation?.messages && conversation.messages.length === 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">Louisiana-Aligned Coaching</p>
                  <p className="text-blue-700 dark:text-blue-300 mt-1">
                    I'll ask clarifying questions about your grade, subject, and teaching challenge before generating a prompt.
                    All prompts reference specific LER indicators and Louisiana standards.
                  </p>
                </div>
              </div>
            </div>
          )}

          {conversation?.messages.map((msg, idx) => {
            // Detect if this message contains a generated prompt (heuristic: contains "PROMPT:" or is long and structured)
            const isPrompt = msg.role === "assistant" && (
              msg.content.includes("PROMPT:") ||
              msg.content.includes("**PROMPT:**") ||
              msg.content.includes("Here's your prompt") ||
              msg.content.includes("Here is your prompt") ||
              (msg.content.length > 300 && msg.content.includes("Louisiana"))
            );

            return (
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
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : isPrompt
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-400"
                        : "bg-muted border-border"
                  )}
                >
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className={cn(
                  "flex flex-col gap-2 max-w-[80%]",
                  msg.role === "user" ? "items-end" : "items-start"
                )}>
                  {isPrompt && (
                    <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Louisiana-Aligned Prompt Generated</span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm whitespace-pre-wrap",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : isPrompt
                          ? "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800 text-foreground"
                          : "bg-muted text-foreground"
                    )}
                  >
                    {msg.content}
                  </div>

                  {msg.role === "assistant" && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(msg.content)} title="Copy to clipboard">
                        <Copy className="h-3 w-3" />
                      </Button>
                      {isPrompt && (
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openSaveDialog(msg.content)} title="Save to library">
                          <Save className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {isSending && (
            <div className="flex w-full gap-3">
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-400">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Searching Louisiana standards and rubric...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Example: I'm teaching RL.5.3 and students confuse character traits with feelings..."
            disabled={isSending}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isSending || !inputValue.trim()}>
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 px-1">
          <Lightbulb className="h-3.5 w-3.5" />
          <span>Tip: Mention your grade level, Louisiana standard code, or teaching challenge for best results</span>
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

