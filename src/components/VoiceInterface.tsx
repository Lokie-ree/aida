import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";

interface VoiceInterfaceProps {
  onTranscription?: (text: string) => void;
  onResponse?: (text: string) => void;
}

export function VoiceInterface({ onTranscription, onResponse }: VoiceInterfaceProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const vapiRef = useRef<Vapi | null>(null);

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

    vapi.on("message", (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        onTranscription?.(message.transcript);
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
    if (!vapiKey) return "text-red-600";
    if (isLoading) return "text-yellow-600";
    if (!isConnected) return "text-gray-600";
    if (isListening) return "text-green-600";
    if (isSpeaking) return "text-blue-600";
    return "text-gray-600";
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-xs border">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Chat with A.I.D.A.</h3>
        <p className={`text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </p>
      </div>

      <div className="relative">
        <button
          onClick={isConnected ? stopCall : startCall}
          disabled={isLoading || !import.meta.env.VITE_VAPI_PUBLIC_KEY}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg
            ${!import.meta.env.VITE_VAPI_PUBLIC_KEY
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : isConnected 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
            ${isListening ? 'animate-pulse ring-4 ring-green-300' : ''}
            ${isSpeaking ? 'animate-pulse ring-4 ring-blue-300' : ''}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          ) : isConnected ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {/* Visual indicators */}
        {isListening && (
          <div className="absolute -inset-2 rounded-full border-4 border-green-400 animate-ping"></div>
        )}
        {isSpeaking && (
          <div className="absolute -inset-2 rounded-full border-4 border-blue-400 animate-ping"></div>
        )}
      </div>

      <div className="text-center text-xs text-gray-500 max-w-xs">
        {!import.meta.env.VITE_VAPI_PUBLIC_KEY
          ? "Voice chat requires a Vapi API key. Please configure VITE_VAPI_PUBLIC_KEY in your environment."
          : !isConnected 
            ? "Click the microphone to start a voice conversation with A.I.D.A."
            : "Click the X to end the voice session"
        }
      </div>
    </div>
  );
}
