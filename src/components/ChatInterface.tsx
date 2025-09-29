import { useState, useRef, useEffect } from "react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2 } from "lucide-react";
import { designTokens } from "@/lib/design-tokens";

interface ChatInterfaceProps {
  currentSpaceId: Id<"spaces"> | null;
}

export function ChatInterface({ currentSpaceId }: ChatInterfaceProps) {
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

  const getHeaderTitle = () => {
    if (currentSpace) {
      return `A.I.D.A. Chat - ${currentSpace.name}`;
    }
    return "A.I.D.A. Chat - Personal";
  };

  const getWelcomeMessage = () => {
    if (currentSpace) {
      return `Welcome to the ${currentSpace.name} space! Ask me anything about instructional design and pedagogy. I can access shared documents and websites in this space.`;
    }
    return "Ask me anything about instructional design and pedagogy.";
  };

  return (
    <Card className="flex flex-col h-full min-h-0">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{getHeaderTitle()}</CardTitle>
            {currentSpace && (
              <CardDescription>
                Shared workspace with team knowledge base
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleClearHistory}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0 min-h-0 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {!chatHistory || chatHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <div className="text-4xl mb-2">🤖</div>
                  <p className="text-lg font-medium">Welcome to A.I.D.A.!</p>
                  <p className="text-sm max-w-md">{getWelcomeMessage()}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Use voice chat for hands-free conversations or type your
                    questions below.
                  </p>
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
                      {/* Context indicators */}
                      {(msg.contextDocuments &&
                        msg.contextDocuments.length > 0) ||
                      (msg.contextWebsites &&
                        msg.contextWebsites.length > 0) ? (
                        <div className="mt-2 pt-2 border-t border-current/20 text-xs opacity-75">
                          {msg.contextDocuments &&
                            msg.contextDocuments.length > 0 && (
                              <div>
                                📄 Documents: {msg.contextDocuments.join(", ")}
                              </div>
                            )}
                          {msg.contextWebsites &&
                            msg.contextWebsites.length > 0 && (
                              <div>
                                🌐 Websites: {msg.contextWebsites.join(", ")}
                              </div>
                            )}
                        </div>
                      ) : null}
                      <div className="text-xs opacity-75 mt-1">
                        {new Date(msg._creationTime).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3 max-w-[80%]">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                        <span className="text-sm">A.I.D.A. is thinking...</span>
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
      <div className="p-4 border-t bg-muted/50">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Ask A.I.D.A. about instructional design${currentSpace ? ` in ${currentSpace.name}` : ""}...`}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            size="default"
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </Card>
  );
}
