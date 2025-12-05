import React, { useState, useEffect, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ChatInterface } from "./ChatInterface";
import { PromptLibrary } from "./PromptLibrary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, MessageSquare, Library, Sparkles } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { motion } from "framer-motion";
import { useCoachActions } from "../../App";

export default function PromptCoach() {
  const [activeTab, setActiveTab] = useState<"chat" | "library">("chat");
  const [currentConversationId, setCurrentConversationId] = useState<Id<"promptConversations"> | null>(null);

  const startConversation = useMutation(api.promptCoach.startConversation);
  const { setCoachActionHandler } = useCoachActions();

  const handleStartNew = useCallback(async () => {
    const newId = await startConversation({ title: "New Coaching Session" });
    setCurrentConversationId(newId);
    setActiveTab("chat");
  }, [startConversation]);

  // Register action handler for mobile menu
  useEffect(() => {
    if (setCoachActionHandler) {
      setCoachActionHandler((action) => {
        if (action === 'newSession') {
          handleStartNew();
        } else if (action === 'viewLibrary') {
          setActiveTab('library');
        }
      });
    }
  }, [setCoachActionHandler, handleStartNew]);

  return (
    <div className="container mx-auto p-3 md:p-6 max-w-7xl min-h-[calc(100dvh-4rem)] flex flex-col">
      {/* Mobile: Title only, no action buttons */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3 mb-3 md:mb-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Prompt Coach</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Your Louisiana-aligned instructional design partner.
          </p>
        </div>

        {/* Mobile: Simple tab switcher below title */}
        <div className="flex gap-2 md:hidden">
          <Button
            variant={activeTab === "chat" ? "default" : "outline"}
            onClick={() => setActiveTab("chat")}
            className="gap-2 flex-1"
            size="sm"
          >
            <MessageSquare className="h-4 w-4" />
            Coach
          </Button>
          <Button
            variant={activeTab === "library" ? "default" : "outline"}
            onClick={() => setActiveTab("library")}
            className="gap-2 flex-1"
            size="sm"
          >
            <Library className="h-4 w-4" />
            My Prompts
          </Button>
        </div>

        {/* Desktop: Action buttons in header */}
        <div className="hidden md:flex gap-2 justify-end">
          <Button
            variant={activeTab === "chat" ? "default" : "outline"}
            onClick={() => setActiveTab("chat")}
            className="gap-2"
            size="sm"
          >
            <MessageSquare className="h-4 w-4" />
            Coach
          </Button>
          <Button
            variant={activeTab === "library" ? "default" : "outline"}
            onClick={() => setActiveTab("library")}
            className="gap-2"
            size="sm"
          >
            <Library className="h-4 w-4" />
            My Prompts
          </Button>
          <Button
            onClick={handleStartNew}
            className="gap-2"
            size="sm"
          >
            <PlusCircle className="h-4 w-4" />
            New Session
          </Button>
        </div>
      </motion.div>

      {/* Floating Action Button - Mobile only */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
        onClick={handleStartNew}
        className="md:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        aria-label="Start new coaching session"
      >
        <PlusCircle className="h-6 w-6" />
      </motion.button>

      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" ? (
          <ChatInterface conversationId={currentConversationId} onStartNew={handleStartNew} />
        ) : (
          <PromptLibrary onSelectPrompt={(prompt) => console.log("Selected prompt", prompt)} />
        )}
      </div>
    </div>
  );
}

