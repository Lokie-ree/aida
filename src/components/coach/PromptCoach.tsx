import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ChatInterface } from "./ChatInterface";
import { PromptLibrary } from "./PromptLibrary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, MessageSquare, Library } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

export default function PromptCoach() {
  const [activeTab, setActiveTab] = useState<"chat" | "library">("chat");
  const [currentConversationId, setCurrentConversationId] = useState<Id<"promptConversations"> | null>(null);

  const startConversation = useMutation(api.promptCoach.startConversation);
  
  const handleStartNew = async () => {
    const newId = await startConversation({ title: "New Coaching Session" });
    setCurrentConversationId(newId);
    setActiveTab("chat");
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prompt Coach</h1>
          <p className="text-muted-foreground">
            Your Louisiana-aligned instructional design partner.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === "chat" ? "default" : "outline"}
            onClick={() => setActiveTab("chat")}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Coach
          </Button>
          <Button 
            variant={activeTab === "library" ? "default" : "outline"}
            onClick={() => setActiveTab("library")}
            className="gap-2"
          >
            <Library className="h-4 w-4" />
            My Prompts
          </Button>
          <Button onClick={handleStartNew} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Session
          </Button>
        </div>
      </div>

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

