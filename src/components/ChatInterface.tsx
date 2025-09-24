import { useState, useRef, useEffect } from "react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { VoiceInterface } from "./VoiceInterface";
import { Id } from "../../convex/_generated/dataModel";

interface ChatInterfaceProps {
  currentSpaceId: Id<"spaces"> | null;
}

export function ChatInterface({ currentSpaceId }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatHistory = useQuery(api.chat.getChatHistory, { spaceId: currentSpaceId ?? undefined });
  const sendMessage = useAction(api.chat.sendMessage);
  const clearHistory = useMutation(api.chat.clearChatHistory);
  const currentSpace = useQuery(api.spaces.getSpaceById, 
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
    if (window.confirm(`Are you sure you want to clear all chat history${spaceContext}?`)) {
      try {
        await clearHistory({ spaceId: currentSpaceId ?? undefined });
        toast.success("Chat history cleared");
      } catch (error) {
        toast.error("Failed to clear chat history");
      }
    }
  };

  const handleVoiceTranscription = (text: string) => {
    // Optionally display the transcription in the chat
    console.log("Voice transcription:", text);
  };

  const handleVoiceResponse = (text: string) => {
    // Handle voice response if needed
    console.log("Voice response:", text);
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
    <div className="flex flex-col h-full bg-white rounded-lg shadow-xs border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{getHeaderTitle()}</h2>
          {currentSpace && (
            <p className="text-xs text-gray-600">Shared workspace with team knowledge base</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVoiceInterface(!showVoiceInterface)}
            className={`
              flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors
              ${showVoiceInterface 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Voice
          </button>
          <button
            onClick={handleClearHistory}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            Clear History
          </button>
        </div>
      </div>

      {/* Voice Interface */}
      {showVoiceInterface && (
        <div className="border-b bg-blue-50">
          <VoiceInterface 
            onTranscription={handleVoiceTranscription}
            onResponse={handleVoiceResponse}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {!chatHistory || chatHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">🤖</div>
              <p className="text-lg font-medium">Welcome to A.I.D.A.!</p>
              <p className="text-sm max-w-md">{getWelcomeMessage()}</p>
              <p className="text-xs text-gray-400 mt-2">
                Use voice chat for hands-free conversations or type your questions below.
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
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.content}
                  </div>
                  {/* Context indicators */}
                  {(msg.contextDocuments && msg.contextDocuments.length > 0) || 
                   (msg.contextWebsites && msg.contextWebsites.length > 0) ? (
                    <div className="mt-2 pt-2 border-t border-gray-300 text-xs opacity-75">
                      {msg.contextDocuments && msg.contextDocuments.length > 0 && (
                        <div>📄 Documents: {msg.contextDocuments.join(", ")}</div>
                      )}
                      {msg.contextWebsites && msg.contextWebsites.length > 0 && (
                        <div>🌐 Websites: {msg.contextWebsites.join(", ")}</div>
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
                <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-[80%]">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm">A.I.D.A. is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Ask A.I.D.A. about instructional design${currentSpace ? ` in ${currentSpace.name}` : ""}...`}
            className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-hidden transition-all shadow-xs"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs hover:shadow"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
