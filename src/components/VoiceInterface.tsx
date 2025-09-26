import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, X, Loader2 } from "lucide-react";

interface VoiceInterfaceProps {
  onTranscription?: (text: string) => void;
  onResponse?: (text: string) => void;
  currentSpaceId?: Id<"spaces"> | null;
  className?: string;
}

export function VoiceInterface({ onTranscription, onResponse, currentSpaceId, className }: VoiceInterfaceProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<{
    response: string;
    sources: string[];
    isPolicyQuery: boolean;
  } | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  
  const processAuthenticatedVoiceQuery = useAction(api.vapi.processAuthenticatedVoiceQuery);

  // Handle authenticated voice queries with RAG
  const handleAuthenticatedQuery = async (message: string) => {
    try {
      const result = await processAuthenticatedVoiceQuery({
        message,
        spaceId: currentSpaceId || undefined
      });
      
      setLastResponse(result);
      onResponse?.(result.response);
      
      // Show sources if available
      if (result.sources.length > 0) {
        toast.success(`Found ${result.sources.length} relevant source(s)`, {
          description: result.sources.slice(0, 3).join(", ") + (result.sources.length > 3 ? "..." : "")
        });
      }
      
      return result.response;
    } catch (error) {
      console.error("Error processing authenticated voice query:", error);
      toast.error("Failed to process voice query");
      return "I'm sorry, I encountered an error processing your request. Please try again.";
    }
  };


  useEffect(() => {
    // Check if Vapi API key is configured
    const vapiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    
    if (!vapiKey) {
      console.error("VITE_VAPI_PUBLIC_KEY is not configured");
      toast.error("Voice chat is not configured. Please set up your Vapi API key.");
      return;
    }

    // Initialize Vapi instance
    const vapi = new Vapi(vapiKey);
    vapiRef.current = vapi;

    // Set up event listeners
    vapi.on("call-start", () => {
      setIsConnected(true);
      setIsLoading(false);
    });

    vapi.on("call-end", () => {
      setIsConnected(false);
      setIsListening(false);
      setIsSpeaking(false);
      setIsLoading(false);
    });

    vapi.on("speech-start", () => {
      setIsListening(true);
      setIsSpeaking(false);
    });

    vapi.on("speech-end", () => {
      setIsListening(false);
    });

    vapi.on("message", async (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        onTranscription?.(message.transcript);
        
        // Process the transcript with RAG if it's a policy query
        const isPolicyQuery = /district|policy|procedure|guideline|requirement|standard|curriculum|assessment|evaluation|rubric|syllabus/i.test(message.transcript);
        
        if (isPolicyQuery) {
          try {
            const response = await handleAuthenticatedQuery(message.transcript);
            // The response will be handled by the Vapi system
          } catch (error) {
            console.error("Error processing policy query:", error);
          }
        }
      }
      
      if (message.type === "function-call") {
        // Handle function calls if needed
      }
    });

    vapi.on("error", (error: any) => {
      console.error("Vapi error:", error);
      
      let errorMessage = "Voice connection error. Please try again.";
      if (error?.message) {
        errorMessage = `Voice error: ${error.message}`;
      } else if (error?.code) {
        errorMessage = `Voice error (${error.code}): Please check your API key and try again.`;
      }
      
      toast.error(errorMessage);
      setIsConnected(false);
      setIsListening(false);
      setIsSpeaking(false);
      setIsLoading(false);
    });

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [onTranscription, onResponse]);

  const startCall = async () => {
    if (!vapiRef.current) {
      toast.error("Voice chat is not configured. Please set up your Vapi API key.");
      return;
    }

    setIsLoading(true);
    
    try {
      // For development, we need to use a secure URL for Vapi webhook
      // Use environment variable if available, otherwise construct from Convex URL
      const convexUrl = import.meta.env.VITE_CONVEX_URL;
      let webhookUrl = convexUrl 
        ? `${convexUrl}/api/vapi/webhook`
        : `${window.location.origin}/api/vapi/webhook`;

      // Ensure we're using HTTPS for Vapi compatibility
      if (webhookUrl.startsWith('http://')) {
        webhookUrl = webhookUrl.replace('http://', 'https://');
      }


      await vapiRef.current.start({
        name: "A.I.D.A.",
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are A.I.D.A. (AI Instructional Design Assistant), an expert instructional coach. Keep responses concise and conversational for voice interaction. Provide helpful guidance on teaching and curriculum design."
            }
          ],
        },
        voice: {
          provider: "playht",
          voiceId: "jennifer"
        },
        firstMessage: "Hello! I'm A.I.D.A., your instructional design assistant. How can I help you improve your teaching today?",
        server: {
          url: webhookUrl
        }
      });
    } catch (error: any) {
      console.error("Failed to start call:", error);
      
      let errorMessage = "Failed to start voice session. Please check your microphone permissions.";
      if (error?.message?.includes("API key")) {
        errorMessage = "Invalid API key. Please check your Vapi configuration.";
      } else if (error?.message?.includes("microphone")) {
        errorMessage = "Microphone access denied. Please allow microphone permissions and try again.";
      } else if (error?.message) {
        errorMessage = `Voice error: ${error.message}`;
      }
      
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const stopCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Space bar to start/stop voice (when focused on the button)
      if (event.code === 'Space' && event.target === document.activeElement) {
        event.preventDefault();
        if (isConnected) {
          stopCall();
        } else {
          startCall();
        }
      }
      
      // Escape to stop voice
      if (event.code === 'Escape' && isConnected) {
        stopCall();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isConnected, startCall, stopCall]);

  const getStatusText = () => {
    const vapiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!vapiKey) return "Not configured - API key missing";
    if (isLoading) return "Connecting...";
    if (!isConnected) return "Ready to talk";
    if (isListening) return "Listening...";
    if (isSpeaking) return "A.I.D.A. is speaking...";
    return "Connected - Tap to speak";
  };

  const getStatusColor = () => {
    const vapiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!vapiKey) return "text-destructive";
    if (isLoading) return "text-warning-500";
    if (!isConnected) return "text-muted-foreground";
    if (isListening) return "text-success-500";
    if (isSpeaking) return "text-primary";
    return "text-muted-foreground";
  };

  return (
    <Card className={`${className || ""}`}>
      <CardHeader className="text-center">
        <CardTitle>Voice Chat with A.I.D.A.</CardTitle>
        <CardDescription id="voice-status" role="status" aria-live="polite">
          {getStatusText()}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative">
          <Button
            onClick={isConnected ? stopCall : startCall}
            disabled={isLoading || !import.meta.env.VITE_VAPI_PUBLIC_KEY}
            aria-label={isConnected ? "Stop voice conversation" : "Start voice conversation"}
            aria-describedby="voice-status"
            size="lg"
            className={`
              w-20 h-20 rounded-full transition-all duration-200 shadow-lg
              ${!import.meta.env.VITE_VAPI_PUBLIC_KEY
                ? 'bg-muted cursor-not-allowed'
                : isConnected 
                  ? 'bg-destructive hover:bg-destructive/90' 
                  : 'bg-primary hover:bg-primary/90'
              }
              ${isListening ? 'animate-pulse ring-4 ring-green-300' : ''}
              ${isSpeaking ? 'animate-pulse ring-4 ring-blue-300' : ''}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isConnected ? (
              <X className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>

          {/* Visual indicators */}
          {isListening && (
            <div className="absolute -inset-2 rounded-full border-4 border-success-400 animate-ping"></div>
          )}
          {isSpeaking && (
            <div className="absolute -inset-2 rounded-full border-4 border-primary animate-ping"></div>
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground max-w-xs">
          {!import.meta.env.VITE_VAPI_PUBLIC_KEY
            ? "Voice chat requires a Vapi API key. Please configure VITE_VAPI_PUBLIC_KEY in your environment."
            : !isConnected 
              ? "Click the microphone to start a voice conversation with A.I.D.A."
              : "Click the X to end the voice session"
          }
        </div>
        
        {/* Keyboard shortcuts help */}
        <div className="text-center text-xs text-muted-foreground max-w-xs">
          <p>Keyboard shortcuts:</p>
          <p>Space: Start/Stop • Escape: Stop</p>
        </div>

        {/* Show sources if available */}
        {lastResponse && lastResponse.sources.length > 0 && (
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Sources</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {lastResponse.sources.slice(0, 3).map((source, index) => (
                  <div key={index} className="text-xs text-muted-foreground truncate">
                    • {source}
                  </div>
                ))}
                {lastResponse.sources.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{lastResponse.sources.length - 3} more sources
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
