import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, Loader2, Copy, GraduationCap, Sparkles, Lightbulb, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ChatInterfaceProps {
  conversationId: Id<"promptConversations"> | null;
  onStartNew: () => void;
  onSelectConversation: (id: Id<"promptConversations">) => void;
}

/**
 * Chat interface component for the conversational prompt coach.
 * Handles message display, sending, prompt generation, and saving prompts to library.
 */
export function ChatInterface({
  conversationId,
  onStartNew,
  onSelectConversation,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track ratings for prompts
  const [promptRatings, setPromptRatings] = useState<Map<number, "positive" | "negative">>(new Map());
  // Track which prompts have been saved (to avoid duplicate saves)
  const [savedPromptIndices, setSavedPromptIndices] = useState<Set<number>>(new Set());

  const conversation = useQuery(api.promptCoach.getConversation, 
    conversationId ? { conversationId } : "skip"
  );
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const conversations = useQuery(api.promptCoach.listConversations);
  
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
    const messageToSend = message; // Store for potential retry
    setInputValue("");
    setIsSending(true);

    try {
      await sendMessage({ conversationId, message });
    } catch (error) {
      console.error("Failed to send message:", error);
      // Restore input value for retry
      setInputValue(messageToSend);
      toast.error("Unable to send message. Please check your connection and try again.", {
        duration: 5000,
      });
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

  /**
   * Extracts a topic from the conversation's first user message.
   * Looks for standard codes or meaningful keywords.
   */
  const extractTopicFromConversation = useCallback(() => {
    if (!conversation?.messages) return "";

    const firstUserMessage = conversation.messages.find(m => m.role === "user");
    if (!firstUserMessage) return "";

    const content = firstUserMessage.content;

    // Look for Louisiana standard codes (e.g., RL.5.3, W.8.2)
    const standardMatch = content.match(/\b([A-Z]{1,4}\.\d+\.\d+(?:\.[A-Z]\.\d+)?|\d+\.[A-Z]{1,4}\.[A-Z]\.\d+)\b/i);
    if (standardMatch) {
      return standardMatch[1].toUpperCase();
    }

    // Extract key words from the message (up to 40 chars)
    const cleaned = content
      .replace(/^(hi|hello|hey|i'm|i am|can you|could you|help me|please)/i, "")
      .trim()
      .slice(0, 40);

    return cleaned.trim();
  }, [conversation?.messages]);

  /**
   * Handles copy + auto-save for generated prompts.
   * Only saves prompts (messages with prompt markers), not regular responses.
   */
  const handleCopy = async (text: string, messageIndex: number, isPrompt: boolean) => {
    // Always copy to clipboard
    navigator.clipboard.writeText(text);

    // Only auto-save actual generated prompts, not regular assistant responses
    if (isPrompt && conversationId && !savedPromptIndices.has(messageIndex)) {
      try {
        const rating = promptRatings.get(messageIndex);
        const topic = extractTopicFromConversation();

        await savePromptMutation({
          conversationId,
          promptText: text,
          context: {
            grade: userProfile?.gradeLevel || "",
            subject: userProfile?.subject || "",
            topic,
          },
          rating,
        });

        // Mark as saved to avoid duplicate saves
        setSavedPromptIndices(prev => new Set(prev).add(messageIndex));
        toast.success("Copied! Saved to My Prompts");
      } catch (error) {
        console.error("Failed to auto-save prompt:", error);
        // Still show copy success even if save fails
        toast.success("Copied! Paste into ChatGPT, Claude, or your preferred AI tool.");
      }
    } else {
      toast.success("Copied! Paste into ChatGPT, Claude, or your preferred AI tool.");
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


  // Empty state - show chat interface with welcome message
  if (!conversationId) {
    const isNewUser = conversations !== undefined && (conversations?.length ?? 0) === 0;
    
    return (
      <div className="flex flex-col h-full min-h-0">
        {/* Chat card - same structure as active chat */}
        <div className="flex-1 min-h-0 flex flex-col bg-card rounded-lg border shadow-sm overflow-hidden">
          {/* Welcome content in messages area */}
          <div className="flex-1 min-h-0 overflow-y-auto px-3 py-6 md:px-4 md:py-8">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 max-w-md"
              >
                <div className="flex justify-center">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  {isNewUser ? (
                    <>
                      <h2 className="text-xl font-semibold text-foreground">
                        Welcome to Pelican AI!
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Start a conversation about what you're teaching. I'll help you craft Louisiana-aligned prompts
                        you can use in ChatGPT, Claude, Gemini, or any AI tool you prefer.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        No new tools to learn—just better prompts that improve your practice.
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-lg font-semibold text-foreground">
                        What are you teaching?
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        I'll help you craft a Louisiana-aligned prompt for any AI tool.
                      </p>
                      {/* Recent sessions as simple text links */}
                      {conversations && conversations.length > 0 && (
                        <div className="pt-4">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="h-px flex-1 bg-border" />
                            <span>or continue</span>
                            <span className="h-px flex-1 bg-border" />
                          </div>
                          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3">
                            {conversations.slice(0, 3).map((conv, idx) => {
                              const firstUserMessage = conv.messages?.find(m => m.role === "user");
                              const title = conv.title ||
                                (firstUserMessage?.content
                                  ? firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? "…" : "")
                                  : "Untitled");
                              return (
                                <button
                                  key={conv._id}
                                  type="button"
                                  onClick={() => onSelectConversation(conv._id)}
                                  className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                                >
                                  {title}{idx < Math.min(conversations.length, 3) - 1 && <span className="text-muted-foreground ml-3">•</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 md:p-4 border-t bg-background">
            {/* Input field */}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
                    e.preventDefault();
                    onStartNew();
                  }
                }}
                placeholder="Example: I'm teaching RL.5.3 and students confuse character traits with feelings..."
                className="flex-1 text-xs md:text-sm"
                autoFocus
              />
              <Button
                onClick={() => {
                  if (inputValue.trim()) {
                    onStartNew();
                  }
                }}
                disabled={!inputValue.trim()}
                size="sm"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground mt-2 px-1">
              <Lightbulb className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
              <span>Press Enter to start • Mention your grade level or Louisiana standard code</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Determines the current phase of the conversation based on message content.
   * Simplified to only show "completed" when a prompt is actually generated.
   * Otherwise shows generic "In Conversation" to avoid false progress indicators.
   */
  const getConversationPhase = () => {
    if (!conversation?.messages || conversation.messages.length === 0) {
      return { phase: "starting", label: "Ready to start", icon: MessageCircle, color: "bg-gray-100 dark:bg-gray-800" };
    }

    // Check if any message contains an actual prompt
    const hasPrompt = conversation.messages.some(msg =>
      msg.role === "assistant" && (
        msg.content.includes("PROMPT:") ||
        msg.content.includes("**PROMPT:**") ||
        msg.content.includes("Here's your prompt") ||
        msg.content.includes("Here is your prompt") ||
        msg.content.includes("Here's a prompt") ||
        msg.content.includes("Here is a prompt")
      )
    );

    if (hasPrompt) {
      return { phase: "completed", label: "Prompt Generated", icon: Sparkles, color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" };
    } else {
      // Don't try to guess progress - just show we're in conversation
      return { phase: "conversing", label: "In Conversation", icon: MessageCircle, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200" };
    }
  };

  const currentPhase = getConversationPhase();

  /**
   * Gets a contextual progress message based on the current conversation phase.
   * Simplified to avoid false progress indicators.
   */
  const getProgressMessage = () => {
    if (!conversation?.messages) return null;
    
    if (currentPhase.phase === "completed") {
      return null;
    } else {
      // Don't show progress estimates - they're often inaccurate
      // Just show that we're working on it
      return null;
    }
  };

  const progressMessage = getProgressMessage();

  /**
   * Gets a contextual loading message based on conversation phase.
   * Rotates through different messages to provide variety and context.
   */
  const getLoadingMessage = () => {
    const messages = [
      "Searching Louisiana Student Standards...",
      "Analyzing Louisiana Educator Rubric alignment...",
      "Finding relevant LER indicators...",
      "Crafting your Louisiana-aligned prompt...",
    ];
    
    // Use phase to determine message, or rotate based on message count
    if (currentPhase.phase === "generating") {
      return messages[3]; // "Crafting your Louisiana-aligned prompt..."
    } else if (currentPhase.phase === "clarifying") {
      return messages[1]; // "Analyzing Louisiana Educator Rubric alignment..."
    } else if (currentPhase.phase === "understanding") {
      return messages[0]; // "Searching Louisiana Student Standards..."
    }
    
    // Default: rotate based on message count
    const msgCount = conversation?.messages.length || 0;
    return messages[msgCount % messages.length];
  };

  const loadingMessage = getLoadingMessage();

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Chat card */}
      <div className="flex-1 min-h-0 flex flex-col bg-card rounded-lg border shadow-sm overflow-hidden">
        {/* Conversation Phase Header */}
        {conversation && conversation.messages.length > 0 && (
          <div className="border-b px-3 md:px-4 py-2 md:py-3 bg-muted/30 shrink-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 md:gap-3">
                <motion.div
                  layout
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className={cn("flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1 md:py-1.5 rounded-full", currentPhase.color)}
                >
                  <currentPhase.icon className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  {currentPhase.label}
                </motion.div>
                <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:inline">
                  {currentPhase.phase === "completed"
                    ? "Ready to copy and use in any AI tool"
                    : "Ask questions to understand your needs"}
                </span>
              </div>
              {progressMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] md:text-xs text-muted-foreground"
                >
                  {progressMessage}
                </motion.div>
              )}
            </div>
          </div>
        )}

      {/* Messages Area - Using native overflow instead of Radix ScrollArea */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4 scroll-smooth"
      >
        <div className="space-y-5 md:space-y-6 pb-4">
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
            // Only mark as prompt if it explicitly contains prompt markers
            // This prevents false positives from clarifying questions
            const isPrompt = msg.role === "assistant" && (
              msg.content.includes("PROMPT:") ||
              msg.content.includes("**PROMPT:**") ||
              msg.content.includes("Here's your prompt") ||
              msg.content.includes("Here is your prompt") ||
              msg.content.includes("Here's a prompt") ||
              msg.content.includes("Here is a prompt")
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
                    "flex h-7 w-7 md:h-8 md:w-8 shrink-0 select-none items-center justify-center rounded-full border shadow-sm transition-all",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground border-primary/30"
                      : isPrompt
                        ? "bg-linear-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-md"
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
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Louisiana-Aligned Prompt Generated</span>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm whitespace-pre-wrap leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : isPrompt
                          ? "bg-linear-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/30 border-2 border-blue-200 dark:border-blue-700 text-foreground shadow-sm"
                          : "bg-muted text-foreground border border-border"
                    )}
                  >
                    {msg.content}
                  </motion.div>

                  {msg.role === "assistant" && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex gap-1.5 mt-1"
                    >
                      {isPrompt && (
                        <>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant={promptRatings.get(idx) === "positive" ? "default" : "ghost"}
                              size="icon"
                              className="h-7 w-7 hover:bg-primary/10 transition-all rounded-lg"
                              onClick={() => handleRating(idx, "positive")}
                              title="This prompt is helpful"
                              aria-label="Rate this prompt as helpful"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant={promptRatings.get(idx) === "negative" ? "default" : "ghost"}
                              size="icon"
                              className="h-7 w-7 hover:bg-primary/10 transition-all rounded-lg"
                              onClick={() => handleRating(idx, "negative")}
                              title="This prompt needs improvement"
                              aria-label="Rate this prompt as needing improvement"
                            >
                              <ThumbsDown className="h-3.5 w-3.5" />
                            </Button>
                          </motion.div>
                        </>
                      )}
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-primary/10 transition-all rounded-lg"
                          onClick={() => handleCopy(msg.content, idx, isPrompt)}
                          title={isPrompt && !savedPromptIndices.has(idx) ? "Copy & save to library" : "Copy to clipboard"}
                          aria-label={isPrompt ? "Copy prompt and save to library" : "Copy to clipboard"}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
          
          {isSending && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full gap-4"
            >
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border bg-linear-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-md">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-3 bg-muted/50 px-4 py-3 rounded-xl border border-border shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">{loadingMessage}</span>
              </div>
            </motion.div>
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
      </div>
    </div>
  );
}
