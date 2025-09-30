import { useState, useEffect, useRef, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, X, Loader2 } from "lucide-react";
import { designTokens } from "@/lib/design-tokens";

interface VoiceInterfaceProps {
  onTranscription?: (text: string) => void;
  onResponse?: (text: string) => void;
  currentSpaceId?: Id<"spaces"> | null;
  className?: string;
}

export function VoiceInterface({
  onTranscription,
  onResponse,
  currentSpaceId,
  className,
}: VoiceInterfaceProps) {
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

  const processAuthenticatedVoiceQuery = useAction(
    api.vapi.processAuthenticatedVoiceQuery
  );

  // Handle authenticated voice queries with RAG
  const handleAuthenticatedQuery = async (message: string) => {
    try {
      const result = await processAuthenticatedVoiceQuery({
        message,
        spaceId: currentSpaceId || undefined,
      });

      setLastResponse(result);
      onResponse?.(result.response);

      // Show sources if available
      if (result.sources.length > 0) {
        toast.success(`Found ${result.sources.length} relevant source(s)`, {
          description:
            result.sources.slice(0, 3).join(", ") +
            (result.sources.length > 3 ? "..." : ""),
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
      toast.error(
        "Voice chat is not configured. Please set up your Vapi API key."
      );
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
        const isPolicyQuery =
          /district|policy|procedure|guideline|requirement|standard|curriculum|assessment|evaluation|rubric|syllabus/i.test(
            message.transcript
          );

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
      toast.error(
        "Voice chat is not configured. Please set up your Vapi API key."
      );
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
      if (webhookUrl.startsWith("http://")) {
        webhookUrl = webhookUrl.replace("http://", "https://");
      }

      await vapiRef.current.start({
        name: "A.I.D.A.",
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are A.I.D.A. (AI Instructional Design Assistant), a supportive and knowledgeable colleague who helps K-12 educators succeed. You provide district-specific policy guidance, lesson plan feedback, and teaching strategies with empathy and expertise. Keep responses conversational and encouraging, focusing on practical solutions that reduce teacher workload and improve student outcomes.",
            },
          ],
        },
        voice: {
          provider: "playht",
          voiceId: "jennifer",
        },
        firstMessage:
          "Hi there! I'm A.I.D.A., your supportive teaching assistant. I'm here to help you with district policies, lesson planning, and teaching strategies. What can I help you with today?",
        server: {
          url: webhookUrl,
        },
      });
    } catch (error: any) {
      console.error("Failed to start call:", error);

      let errorMessage =
        "Failed to start voice session. Please check your microphone permissions.";
      if (error?.message?.includes("API key")) {
        errorMessage = "Invalid API key. Please check your Vapi configuration.";
      } else if (error?.message?.includes("microphone")) {
        errorMessage =
          "Microphone access denied. Please allow microphone permissions and try again.";
      } else if (error?.message) {
        errorMessage = `Voice error: ${error.message}`;
      }

      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const stopCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  }, []);

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Space bar to start/stop voice (when focused on the button)
      if (event.code === "Space" && event.target === document.activeElement) {
        event.preventDefault();
        if (isConnected) {
          stopCall();
        } else {
          startCall();
        }
      }

      // Escape to stop voice
      if (event.code === "Escape" && isConnected) {
        stopCall();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isConnected, startCall, stopCall]);

  const getStatusText = () => {
    const vapiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!vapiKey) return "Setup required";
    if (isLoading) return "Connecting...";
    if (!isConnected) return "Ready to help";
    if (isListening) return "Listening...";
    if (isSpeaking) return "Speaking...";
    return "Ready";
  };

  const getStatusColor = () => {
    const vapiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!vapiKey) return "text-aida-voice-error-500";
    if (isLoading) return "text-aida-voice-error-500";
    if (!isConnected) return "text-aida-voice-idle-500";
    if (isListening) return "text-aida-voice-listening-500";
    if (isSpeaking) return "text-aida-voice-speaking-500";
    return "text-aida-voice-idle-500";
  };

  // Voice Orb State Management - Exact Brand Colors from Final Sprint Guide
  const getVoiceOrbColor = () => {
    if (!import.meta.env.VITE_VAPI_PUBLIC_KEY) {
      return designTokens.colors.neutral[300]; // Setup required
    }
    if (isConnected && isListening) {
      return designTokens.colors.secondary.purple; // Listening: Purple light (#8B5CF6)
    }
    if (isConnected) {
      return designTokens.colors.primary.green; // Success: Steady green (#10B981)
    }
    return designTokens.colors.primary.blue; // Idle: Calm blue glow (#3B82F6)
  };

  const getVoiceOrbAnimation = () => {
    if (!import.meta.env.VITE_VAPI_PUBLIC_KEY) return "none";
    if (isConnected && isListening) {
      return "pulse 1s ease-in-out infinite"; // Active pulsing animation
    }
    if (isConnected) {
      return "pulse 2s ease-in-out 1"; // Confirmation pulse animation for 1-2 seconds
    }
    return "pulse 3s ease-in-out infinite"; // Gentle pulsing animation
  };

  const getVoiceOrbShadow = () => {
    const baseShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)";
    if (isConnected && isListening) {
      return `${baseShadow}, 0 0 0 4px ${designTokens.colors.secondary.purple}30`;
    }
    if (isConnected) {
      return `${baseShadow}, 0 0 0 4px ${designTokens.colors.primary.green}30`;
    }
    return baseShadow;
  };

  return (
    <Card className={`${className || ""} overflow-hidden`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-aida-primary-600 text-center">
          The Voice of Your District
        </CardTitle>
        <CardDescription
          id="voice-status"
          role="status"
          aria-live="polite"
          className="text-sm mt-2 font-medium"
        >
          {getStatusText()}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4 p-6">
        {/* Main Voice Button - The Voice Orb with Exact Brand Colors */}
        <div className="relative">
          <Button
            onClick={isConnected ? stopCall : startCall}
            disabled={isLoading || !import.meta.env.VITE_VAPI_PUBLIC_KEY}
            aria-label={
              isConnected
                ? "Stop voice conversation"
                : "Start voice conversation"
            }
            aria-describedby="voice-status"
            size="lg"
            className="w-24 h-24 rounded-full transition-all duration-300 shadow-xl hover:scale-105 transform"
            style={{
              backgroundColor: getVoiceOrbColor(),
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading || !import.meta.env.VITE_VAPI_PUBLIC_KEY ? "not-allowed" : "pointer",
              animation: getVoiceOrbAnimation(),
              boxShadow: getVoiceOrbShadow()
            }}
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isConnected ? (
              <X className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>

          {/* Visual indicators with exact brand colors */}
          {isListening && (
            <div 
              className="absolute -inset-2 rounded-full border-2 animate-ping"
              style={{ borderColor: designTokens.colors.secondary.purple }}
            ></div>
          )}
          {isSpeaking && (
            <div 
              className="absolute -inset-2 rounded-full border-2 animate-ping"
              style={{ borderColor: designTokens.colors.primary.blue }}
            ></div>
          )}
        </div>

        {/* Compact Status */}
        <div className="text-center space-y-3">
          <div className="text-sm text-muted-foreground">
            {!import.meta.env.VITE_VAPI_PUBLIC_KEY
              ? "Setup required"
              : !isConnected
                ? "Ask me anything about your district"
                : "Listening..."}
          </div>

          {/* Quick Examples - Only when not connected */}
          {!isConnected && import.meta.env.VITE_VAPI_PUBLIC_KEY && (
            <div 
              className="rounded-lg p-3"
              style={{ backgroundColor: `${designTokens.colors.neutral[100]}50` }}
            >
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div 
                    className="w-1.5 h-1.5 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: designTokens.colors.primary.blue }}
                  ></div>
                  <div className="text-muted-foreground">"Bullying policy?"</div>
                </div>
                <div className="text-center">
                  <div 
                    className="w-1.5 h-1.5 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: designTokens.colors.primary.green }}
                  ></div>
                  <div className="text-muted-foreground">"Bus schedule?"</div>
                </div>
                <div className="text-center">
                  <div 
                    className="w-1.5 h-1.5 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: designTokens.colors.secondary.purple }}
                  ></div>
                  <div className="text-muted-foreground">"Wellness goals?"</div>
                </div>
              </div>
            </div>
          )}

          {/* Trust Signals - Compact */}
          <div className="flex justify-center items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: designTokens.colors.primary.green }}
              ></div>
              <span>FERPA</span>
            </div>
            <div 
              className="w-px h-2"
              style={{ backgroundColor: designTokens.colors.neutral[300] }}
            ></div>
            <div className="flex items-center gap-1">
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: designTokens.colors.primary.blue }}
              ></div>
              <span>Sources</span>
            </div>
            <div 
              className="w-px h-2"
              style={{ backgroundColor: designTokens.colors.neutral[300] }}
            ></div>
            <div className="flex items-center gap-1">
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: designTokens.colors.secondary.purple }}
              ></div>
              <span>&lt;2s</span>
            </div>
          </div>
        </div>

        {/* Sources - Only show when available */}
        {lastResponse && lastResponse.sources.length > 0 && (
          <div 
            className="w-full rounded-lg p-3"
            style={{
              backgroundColor: `${designTokens.colors.primary.blue}10`,
              border: `1px solid ${designTokens.colors.primary.blue}20`
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: designTokens.colors.primary.blue }}
              ></div>
              <span 
                className="text-sm font-medium"
                style={{ color: designTokens.colors.primary.blue }}
              >
                Sources
              </span>
            </div>
            <div className="space-y-1">
              {lastResponse.sources.slice(0, 2).map((source, index) => (
                <div
                  key={index}
                  className="text-xs truncate flex items-start gap-2"
                  style={{ color: designTokens.colors.neutral[700] }}
                >
                  <span 
                    className="font-semibold"
                    style={{ color: designTokens.colors.primary.blue }}
                  >
                    {index + 1}.
                  </span>
                  <span className="flex-1">{source}</span>
                </div>
              ))}
              {lastResponse.sources.length > 2 && (
                <div 
                  className="text-xs"
                  style={{ color: designTokens.colors.neutral[500] }}
                >
                  +{lastResponse.sources.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
