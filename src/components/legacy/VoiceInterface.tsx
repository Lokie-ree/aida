import { useState, useEffect, useRef, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
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
import { Mic, MicOff, X, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { handleError, showErrorToast, showSuccessToast, ErrorCodes, withRetry } from "@/lib/error-handling";

interface VoiceInterfaceProps {
  onTranscription?: (text: string) => void;
  onResponse?: (text: string) => void;
  className?: string;
}

export function VoiceInterface({
  onTranscription,
  onResponse,
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
      const result = await withRetry(
        () => processAuthenticatedVoiceQuery({
          message,
        }),
        3,
        1000
      );

      setLastResponse(result);
      onResponse?.(result.response);

      // Show sources if available
      if (result.sources.length > 0) {
        showSuccessToast(`Found ${result.sources.length} relevant source(s)`, 
          result.sources.slice(0, 3).join(", ") + (result.sources.length > 3 ? "..." : "")
        );
      }

      return result.response;
    } catch (error) {
      const aidaError = handleError(error, {
        component: "VoiceInterface",
        action: "handleAuthenticatedQuery",
      });
      
      showErrorToast(aidaError);
      return "I'm sorry, I encountered an error processing your request. Please try again.";
    }
  };

  useEffect(() => {
    // Check if Vapi API key is configured
    const vapiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;

    if (!vapiKey) {
      const error = handleError(new Error("Vapi API key not configured"), {
        component: "VoiceInterface",
        action: "initialize",
      });
      showErrorToast(error);
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
          /district|policy|procedure|guideline|requirement|standard|curriculum|assessment|evaluation|rubric|syllabus|attendance|discipline|safety|emergency|grading|homework|field trip|professional development|communication|technology|accommodation|IEP|504|bullying|harassment|FERPA|privacy|SIS|testing|intervention|support|behavior|management|equity|diversity|cultural|bias|inclusive/i.test(
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
      const aidaError = handleError(error, {
        component: "VoiceInterface",
        action: "vapi_error",
      });
      
      showErrorToast(aidaError);
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
      const error = handleError(new Error("Vapi not initialized"), {
        component: "VoiceInterface",
        action: "startCall",
      });
      showErrorToast(error);
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

      await withRetry(
        () => vapiRef.current!.start({
          name: "A.I.D.A.",
          model: {
            provider: "openai",
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are A.I.D.A., the Intelligent Experience Platform for Education. You are the voice of this district's digital ecosystem, providing instant access to official policies, procedures, and information. You speak with authority and clarity, always citing official sources. You help parents, students, staff, and community members find accurate information quickly. Keep responses professional, concise, and always reference specific documents when available.",
              },
            ],
          },
          voice: {
            provider: "playht",
            voiceId: "jennifer",
          },
          firstMessage:
            "Hello! I'm A.I.D.A., your district's intelligent assistant. I can help you find information about policies, procedures, schedules, and any official district information. What would you like to know?",
          server: {
            url: webhookUrl,
          },
        }),
        2,
        1000
      );
    } catch (error) {
      const aidaError = handleError(error, {
        component: "VoiceInterface",
        action: "startCall",
      });
      
      showErrorToast(aidaError);
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
    if (!vapiKey) return "text-destructive";
    if (isLoading) return "text-destructive";
    if (!isConnected) return "text-muted-foreground";
    if (isListening) return "text-secondary";
    if (isSpeaking) return "text-primary";
    return "text-muted-foreground";
  };

  // Voice Orb State Management - Exact Brand Colors from Final Sprint Guide
  const getVoiceOrbColor = () => {
    if (!import.meta.env.VITE_VAPI_PUBLIC_KEY) {
      return "bg-muted"; // Setup required
    }
    if (isConnected && isListening) {
      return "bg-secondary"; // Listening: Purple light
    }
    if (isConnected) {
      return "bg-green-500"; // Success: Steady green
    }
    return "bg-primary"; // Idle: Calm blue glow
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
      return `${baseShadow}, 0 0 0 4px rgba(139, 92, 246, 0.2)`;
    }
    if (isConnected) {
      return `${baseShadow}, 0 0 0 4px rgba(16, 185, 129, 0.2)`;
    }
    return baseShadow;
  };

  return (
    <Card className={`${className || ""} overflow-hidden`}>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold text-foreground text-center">
          Voice Assistant
        </CardTitle>
        <CardDescription
          id="voice-status"
          role="status"
          aria-live="polite"
          className="text-xs mt-1 font-medium"
        >
          {getStatusText()}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-3 p-4">
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
            className={`w-16 h-16 rounded-full transition-all duration-300 shadow-lg hover:scale-105 transform ${getVoiceOrbColor()} ${isLoading ? "opacity-50" : ""} ${isLoading || !import.meta.env.VITE_VAPI_PUBLIC_KEY ? "cursor-not-allowed" : "cursor-pointer"}`}
            style={{
              animation: getVoiceOrbAnimation(),
              boxShadow: getVoiceOrbShadow()
            }}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isConnected ? (
              <X className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </Button>

          {/* Visual indicators with exact brand colors */}
          {isListening && (
            <div 
              className="absolute -inset-2 rounded-full border-2 animate-ping border-secondary"
            ></div>
          )}
          {isSpeaking && (
            <div 
              className="absolute -inset-2 rounded-full border-2 animate-ping border-primary"
            ></div>
          )}
        </div>

        {/* Compact Status */}
        <div className="text-center space-y-2">
          <div className="text-xs text-muted-foreground">
            {!import.meta.env.VITE_VAPI_PUBLIC_KEY
              ? "Setup required"
              : !isConnected
                ? "Ask me anything about your district"
                : "Listening..."}
          </div>

          {/* Quick Examples - Only when not connected */}
          {!isConnected && import.meta.env.VITE_VAPI_PUBLIC_KEY && (
            <div className="rounded-lg p-3 bg-muted/50">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="w-1.5 h-1.5 rounded-full mx-auto mb-1 bg-primary"></div>
                  <div className="text-muted-foreground">"Bullying policy?"</div>
                </div>
                <div className="text-center">
                  <div className="w-1.5 h-1.5 rounded-full mx-auto mb-1 bg-green-500"></div>
                  <div className="text-muted-foreground">"Bus schedule?"</div>
                </div>
                <div className="text-center">
                  <div className="w-1.5 h-1.5 rounded-full mx-auto mb-1 bg-secondary"></div>
                  <div className="text-muted-foreground">"Wellness goals?"</div>
                </div>
              </div>
            </div>
          )}

          {/* Trust Signals - Compact */}
          <div className="flex justify-center items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span>FERPA</span>
            </div>
            <div className="w-px h-2 bg-muted"></div>
            <div className="flex items-center gap-1">
              <div 
                className="w-1.5 h-1.5 rounded-full bg-primary"
              ></div>
              <span>Sources</span>
            </div>
            <div className="w-px h-2 bg-muted"></div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
              <span>&lt;2s</span>
            </div>
          </div>
        </div>

        {/* Sources - Only show when available */}
        {lastResponse && lastResponse.sources.length > 0 && (
          <div className="w-full rounded-lg p-3 bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <span className="text-sm font-medium text-foreground">
                Sources
              </span>
            </div>
            <div className="space-y-1">
              {lastResponse.sources.slice(0, 2).map((source, index) => (
                <div
                  key={index}
                  className="text-xs truncate flex items-start gap-2 text-foreground"
                >
                  <span className="font-semibold text-foreground">
                    {index + 1}.
                  </span>
                  <span className="flex-1">{source}</span>
                </div>
              ))}
              {lastResponse.sources.length > 2 && (
                <div className="text-xs text-muted-foreground">
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
