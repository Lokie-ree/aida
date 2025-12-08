import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, Loader2, Save, MessageSquare, Copy, GraduationCap, BookOpen, Scale, Target, Sparkles, Lightbulb, MessageCircle, Search, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { spacing } from "@/lib/spacing";

interface ChatInterfaceProps {
  conversationId: Id<"promptConversations"> | null;
  onStartNew: () => void;
}

export function ChatInterface({ conversationId, onStartNew }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Save prompt dialog state
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [promptToSave, setPromptToSave] = useState<string>("");
  const [saveContext, setSaveContext] = useState({ grade: "", subject: "", topic: "" });
  const [promptRatings, setPromptRatings] = useState<Map<number, "positive" | "negative">>(new Map());

  const conversation = useQuery(api.promptCoach.getConversation, 
    conversationId ? { conversationId } : "skip"
  );
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  
  const sendMessage = useAction(api.promptCoach.sendMessage);
  const savePromptMutation = useMutation(api.promptCoach.savePrompt);

  // Simple scroll to bottom - using native scrolling instead of Radix
  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, []);

  // Scroll when messages change
  const messageCount = conversation?.messages?.length ?? 0;
  const prevMessageCountRef = useRef(0);
  
  useEffect(() => {
    if (messageCount > prevMessageCountRef.current) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(scrollToBottom, 100);
      prevMessageCountRef.current = messageCount;
      return () => clearTimeout(timer);
    }
  }, [messageCount, scrollToBottom]);

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
    toast.success("Copied! Paste into ChatGPT, Claude, or your preferred AI tool.");
  };

  const openSaveDialog = (text: string) => {
    setPromptToSave(text);
    // Pre-fill with profile context
    setSaveContext({
      grade: userProfile?.gradeLevel || "",
      subject: userProfile?.subject || "",
      topic: "", // Still manual
    });
    setIsSaveDialogOpen(true);
  };

  const handleSavePrompt = async () => {
    if (!conversationId) return;
    
    // Find the rating for this prompt (if any)
    const messageIndex = conversation?.messages.findIndex(msg => 
      msg.role === "assistant" && msg.content === promptToSave
    );
    const rating = messageIndex !== undefined && messageIndex !== -1 
      ? promptRatings.get(messageIndex) 
      : undefined;
    
    try {
      await savePromptMutation({
        conversationId,
        promptText: promptToSave,
        context: saveContext,
        rating,
      });
      toast.success("Prompt saved to your library");
      setIsSaveDialogOpen(false);
      setSaveContext({ grade: "", subject: "", topic: "" });
    } catch (error) {
      console.error("Failed to save prompt:", error);
      toast.error("Failed to save prompt");
    }
  };

  const handleRating = (messageIndex: number, rating: "positive" | "negative") => {
    setPromptRatings(prev => {
      const newMap = new Map(prev);
      // Toggle if same rating clicked, otherwise set new rating
      if (newMap.get(messageIndex) === rating) {
        newMap.delete(messageIndex);
      } else {
        newMap.set(messageIndex, rating);
      }
      return newMap;
    });
  };

  // Empty state - no conversation started
  if (!conversationId) {
    const starterPrompts = [
      {
        icon: Search,
        text: "Analyze LEAP data to identify misconceptions",
        category: "Assessment Data"
      },
      {
        icon: Target,
        text: "Differentiate science lab for IEP students",
        category: "Special Education"
      },
      {
        icon: Scale,
        text: "Highly effective actions for PIC in STEM",
        category: "LER Evidence"
      },
      {
        icon: BookOpen,
        text: "Internalize 7th grade math standards",
        category: "Curriculum Mastery"
      }
    ];

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Welcome content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center overflow-y-auto relative">
          {/* Subtle decorative background */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 md:w-64 md:h-64 bg-blue-600/5 rounded-full blur-3xl" />

          <div className={spacing.sectionGapSmall + " relative z-10 w-full max-w-3xl"}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-linear-to-br from-blue-500/10 to-blue-600/10 p-4 md:p-5 rounded-full ring-2 ring-blue-500/20 mx-auto w-fit"
            >
              <Bot className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
            </motion.div>

            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Welcome to Prompt Coach
              </h2>
              <p className="text-muted-foreground text-xs md:text-sm px-2">
                Built by Louisiana teachers, for Louisiana teachers. Craft prompts aligned to
                <span className="font-semibold text-foreground"> Louisiana Student Standards</span> and the
                <span className="font-semibold text-foreground"> Louisiana Educator Rubric</span>.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-medium">
                Try these examples:
              </p>
              <div className={`grid grid-cols-1 md:grid-cols-2 ${spacing.gridGapSmall} items-stretch`}>
                {starterPrompts.map((prompt, idx) => {
                  const IconComponent = prompt.icon;
                  return (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onStartNew();
                        setTimeout(() => {
                          setInputValue(prompt.text);
                          inputRef.current?.focus();
                        }, 150);
                      }}
                      className="text-left p-3 md:p-4 rounded-lg border-2 bg-linear-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 border-primary/20 hover:border-primary/40 transition-all duration-300 group shadow-sm hover:shadow-md h-full"
                    >
                      <div className="flex items-start gap-2 md:gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shadow-sm shrink-0">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-0.5 min-w-0">
                          <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider">{prompt.category}</p>
                          <p className="text-xs md:text-sm text-foreground font-medium leading-snug">{prompt.text}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <p className="text-[10px] md:text-xs text-muted-foreground max-w-lg mx-auto">
              I'll ask clarifying questions to understand your context, then generate a Louisiana-aligned prompt
              you can use in ChatGPT, Claude, Gemini, or any AI tool.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Determine conversation phase
  const getConversationPhase = () => {
    if (!conversation?.messages || conversation.messages.length === 0) {
      return { phase: "starting", label: "Ready to start", icon: MessageCircle, color: "bg-gray-100 dark:bg-gray-800" };
    }

    const msgCount = conversation.messages.length;
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
    } else if (msgCount >= 6) {
      return { phase: "generating", label: "Preparing Your Prompt", icon: Target, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200" };
    } else if (msgCount >= 3) {
      return { phase: "clarifying", label: "Identifying Your Challenge", icon: Search, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200" };
    } else {
      return { phase: "understanding", label: "Understanding Your Context", icon: MessageCircle, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200" };
    }
  };

  const currentPhase = getConversationPhase();

  return (
    <div className="flex flex-col h-full">
      {/* Chat card */}
      <div className="flex-1 flex flex-col bg-card rounded-lg border shadow-sm overflow-hidden">
        {/* Conversation Phase Header */}
        {conversation && conversation.messages.length > 0 && (
          <div className="border-b px-3 md:px-4 py-2 md:py-3 bg-muted/30 shrink-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 md:gap-3">
                <div className={cn("flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1 md:py-1.5 rounded-full", currentPhase.color)}>
                  <currentPhase.icon className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  {currentPhase.label}
                </div>
                <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:inline">
                  {currentPhase.phase === "completed"
                    ? "Ready to copy and use in any AI tool"
                    : "Louisiana standards & rubric being searched"}
                </span>
              </div>
            </div>
          </div>
        )}

      {/* Messages Area - Using native overflow instead of Radix ScrollArea */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-3 md:p-4"
      >
        <div className="space-y-6 pb-4">
          {/* Louisiana context indicator */}
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
                  "flex w-full gap-2 md:gap-4",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 md:h-8 md:w-8 shrink-0 select-none items-center justify-center rounded-full border shadow-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground border-primary/30"
                      : isPrompt
                        ? "bg-linear-to-br from-blue-500 to-blue-600 text-white border-blue-400"
                        : "bg-muted border-border"
                  )}
                >
                  {msg.role === "user" ? <User className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <Bot className="h-3.5 w-3.5 md:h-4 md:w-4" />}
                </div>

                <div className={cn(
                  "flex flex-col gap-2 max-w-[90%] md:max-w-[85%]",
                  msg.role === "user" ? "items-end" : "items-start"
                )}>
                  {isPrompt && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Louisiana-Aligned Prompt Generated</span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm whitespace-pre-wrap",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : isPrompt
                          ? "bg-linear-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/30 border-2 border-blue-200 dark:border-blue-700 text-foreground shadow-sm"
                          : "bg-muted text-foreground border border-border"
                    )}
                  >
                    {msg.content}
                  </div>

                  {msg.role === "assistant" && (
                    <div className="flex gap-2">
                      {isPrompt && (
                        <>
                          <Button
                            variant={promptRatings.get(idx) === "positive" ? "default" : "ghost"}
                            size="icon"
                            className="h-7 w-7 hover:bg-primary/10"
                            onClick={() => handleRating(idx, "positive")}
                            title="This prompt is helpful"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant={promptRatings.get(idx) === "negative" ? "default" : "ghost"}
                            size="icon"
                            className="h-7 w-7 hover:bg-primary/10"
                            onClick={() => handleRating(idx, "negative")}
                            title="This prompt needs improvement"
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-primary/10"
                        onClick={() => handleCopy(msg.content)}
                        title="Copy to clipboard"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-primary/10"
                        onClick={() => openSaveDialog(msg.content)}
                        title="Save to library"
                      >
                        <Save className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {isSending && (
            <div className="flex w-full gap-4">
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border bg-linear-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-3 bg-muted/50 px-4 py-3 rounded-xl border border-border">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Searching Louisiana standards and rubric...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Example: I'm teaching RL.5.3 and students confuse character traits with feelings..."
            disabled={isSending}
            className="flex-1 text-xs md:text-sm"
          />
          <Button onClick={handleSend} disabled={isSending || !inputValue.trim()} size="sm" className="shrink-0">
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground mt-2 px-1">
          <Lightbulb className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
          <span className="line-clamp-2 md:line-clamp-1">Tip: Press Enter to send • Mention your grade level, Louisiana standard code, or teaching challenge for best results</span>
        </div>
      </div>

        {/* Save Dialog */}
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
    </div>
  );
}
