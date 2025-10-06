import { useState, useRef, useEffect } from "react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2, MessageCircle, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface ConversationPaneProps {
  // No props needed - individual user conversation
}

export function ConversationPane({}: ConversationPaneProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatHistory = useQuery(api.chat.getChatHistory, {});
  const sendMessage = useAction(api.chat.sendMessage);
  const clearHistory = useMutation(api.chat.clearChatHistory);

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
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (
      window.confirm(
        `Are you sure you want to clear all chat history?`
      )
    ) {
      try {
        await clearHistory({});
        toast.success("Chat history cleared");
        setIsCollapsed(true); // Collapse after clearing
      } catch (error) {
        toast.error("Failed to clear chat history");
      }
    }
  };

  // Auto-expand when there are messages
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setIsCollapsed(false);
    }
  }, [chatHistory]);

  return (
    <Card className="flex flex-col h-96 min-h-0 shadow-lg">
      <CardHeader className="flex-shrink-0 border-b pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center bg-primary">
              <span className="text-primary-foreground font-bold text-xs">AI</span>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Ask A.I.D.A.
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Personal AI Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {chatHistory && chatHistory.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearHistory}
                className="h-7 px-2 text-xs"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-7 w-7 p-0"
              aria-label={isCollapsed ? "Expand conversation" : "Collapse conversation"}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <>
          {/* Messages */}
          <CardContent className="flex-1 p-0 min-h-0 overflow-hidden">
        <ScrollArea className="h-full p-6">
          <div className="space-y-4">
            {!chatHistory || chatHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center p-6">
                <div className="max-w-sm">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-primary/10">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-foreground">
                    Welcome to A.I.D.A.
                  </h3>
                  <p className="text-sm mb-4 text-muted-foreground">
                    Ask me anything about your district policies and procedures.
                  </p>
                  <div className="text-left">
                    <div className="p-3 rounded-lg border bg-muted/30 text-sm">
                      <strong className="text-foreground">Try asking:</strong>
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <li>• "What's our bullying policy?"</li>
                        <li>• "Bus schedule for Maple Street"</li>
                        <li>• "Student wellness goals"</li>
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
                          ? "bg-primary text-primary-foreground"
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
      <div className="p-4 border-t bg-muted/20">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Ask A.I.D.A. anything...`}
            className="flex-1 h-9"
            disabled={isLoading}
            autoFocus
          />
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            size="sm"
            className="h-9 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
        </>
      )}
    </Card>
  );
}
