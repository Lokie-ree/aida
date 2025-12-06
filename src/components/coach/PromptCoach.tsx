import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { ChatInterface } from "./ChatInterface";
import { PromptLibrary } from "./PromptLibrary";
import { AppHeader, type NavConfig } from "@/components/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { spacing } from "@/lib/spacing";
import { MessageSquare, Library, PlusCircle, User, LogOut } from "lucide-react";

export default function PromptCoach() {
  const [activeView, setActiveView] = useState<"chat" | "library">("chat");
  const [currentConversationId, setCurrentConversationId] = useState<Id<"promptConversations"> | null>(null);
  const navigate = useNavigate();

  const startConversation = useMutation(api.promptCoach.startConversation);

  const handleStartNew = useCallback(async () => {
    const newId = await startConversation({ title: "New Coaching Session" });
    setCurrentConversationId(newId);
    setActiveView("chat");
  }, [startConversation]);

  const handleLogoClick = () => {
    setCurrentConversationId(null);
    setActiveView("chat");
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const navConfig: NavConfig = useMemo(
    () => ({
      navItems: [
        {
          label: "Coach",
          icon: MessageSquare,
          onClick: () => setActiveView("chat"),
          active: activeView === "chat",
        },
        {
          label: "My Prompts",
          icon: Library,
          onClick: () => setActiveView("library"),
          active: activeView === "library",
        },
        {
          label: "New Session",
          icon: PlusCircle,
          onClick: handleStartNew,
          variant: "ghost" as const,
        },
      ],
      actions: [
        {
          label: "Profile",
          icon: User,
          onClick: handleProfileClick,
          showLabel: false,
        },
        {
          label: "Sign Out",
          icon: LogOut,
          onClick: handleSignOut,
          showLabel: true,
        },
      ],
      showThemeToggle: true,
    }),
    [activeView, handleStartNew]
  );

  return (
    <div className="h-dvh flex flex-col bg-background">
      <AppHeader config={navConfig} onLogoClick={handleLogoClick} />

      <main className="flex-1 overflow-hidden flex flex-col">
        <div className={`${spacing.chartContainer} w-full flex-1 flex flex-col ${spacing.container} py-4`}>
          <div className="flex-1 overflow-hidden">
            {activeView === "chat" ? (
              <ChatInterface
                conversationId={currentConversationId}
                onStartNew={handleStartNew}
              />
            ) : (
              <PromptLibrary
                onSelectPrompt={(prompt) => {
                  console.log("Selected prompt", prompt);
                  setActiveView("chat");
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
