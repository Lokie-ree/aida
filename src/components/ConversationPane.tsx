import { useState, useRef, useEffect } from "react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2, MessageCircle, FileText } from "lucide-react";

interface ConversationPaneProps {
  currentSpaceId: Id<"spaces"> | null;
}

export function ConversationPane({ currentSpaceId }: ConversationPaneProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatHistory = useQuery(api.chat.getChatHistory, {
    spaceId: currentSpaceId ?? undefined,
  });
  const sendMessage = useAction(api.chat.sendMessage);
  const clearHistory = useMutation(api.chat.clearChatHistory);
  const currentSpace = useQuery(
    api.spaces.getSpaceById,
    currentSpaceId ? { spaceId: currentSpaceId } : "skip"
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    try {
      await sendMessage({
        message: userMessage,
        spaceId: currentSpaceId ?? undefined,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    const spaceContext = currentSpace ? ` for "${currentSpace.name}"` : "";
    if (
      window.confirm(
        `Are you sure you want to clear all chat history${spaceContext}?`
      )
    ) {
      try {
        await clearHistory({ spaceId: currentSpaceId ?? undefined });
        toast.success("Chat history cleared");
      } catch (error) {
        toast.error("Failed to clear chat history");
      }
    }
  };

  return (
    <Card className="flex flex-col h-full min-h-0 shadow-md">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-accent">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <div>
              <CardTitle className="text-xl">
                A.I.D.A. Conversation
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {currentSpace ? `Connected to ${currentSpace.name}` : "Personal Assistant"}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearHistory}
            className="text-xs"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0 min-h-0 overflow-hidden">
        <ScrollArea className="h-full p-6">
          <div className="space-y-4">
            {!chatHistory || chatHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="max-w-md">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-primary to-accent">
                    <MessageCircle className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Ask me anything about the district
                  </h3>
                  <p className="text-sm mb-4 text-muted-foreground">
                    Use voice chat for hands-free conversations or type your questions below.
                  </p>
                  <div className="grid grid-cols-1 gap-2 text-left">
                    <div className="p-3 rounded-lg border bg-accent/5 text-sm">
                      <strong>Example questions:</strong>
                      <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                        <li>• "What's our district's policy for reporting bullying?"</li>
                        <li>• "What time does the bus arrive at Maple Street?"</li>
                        <li>• "Summarize our student wellness goals"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {chatHistory.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {msg.content}
                      </div>
                      
                      {/* Source Citations - Critical for Demo */}
                      {msg.contextDocuments && msg.contextDocuments.length > 0 && (
                        <div 
                          className={`mt-2 pt-2 border-t text-xs ${
                            msg.role === "user" 
                              ? "border-primary-foreground/20 text-primary-foreground/80"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <FileText className="w-3 h-3" />
                            <span className="font-medium">Sources:</span>
                          </div>
                          <div className="space-y-1">
                            {msg.contextDocuments.map((doc, index) => (
                              <div key={index} className="truncate">
                                {index + 1}. {doc}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className={`text-xs mt-1 opacity-75 ${
                        msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        {new Date(msg._creationTime).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                        <span className="text-sm text-muted-foreground">
                          A.I.D.A. is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <div className="p-4 border-t bg-muted/30">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Ask A.I.D.A. about district policies${currentSpace ? ` in ${currentSpace.name}` : ""}...`}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            size="default"
            className="bg-gradient-to-br from-primary to-accent hover:opacity-90 text-primary-foreground"
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </Card>
  );
}
