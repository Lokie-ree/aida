import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { ChatInterface } from "./ChatInterface";
import { PromptLibrary } from "./PromptLibrary";
import { InlineProfilePrompt } from "./InlineProfilePrompt";
import { AppHeader, type NavConfig } from "@/components/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { spacing } from "@/lib/spacing";
import { MessageSquare, Library, PlusCircle, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PromptCoach() {
  const [activeView, setActiveView] = useState<"chat" | "library">("chat");
  const [currentConversationId, setCurrentConversationId] = useState<Id<"promptConversations"> | null>(null);
  const navigate = useNavigate();

  const startConversation = useMutation(api.promptCoach.startConversation);
  const savedPrompts = useQuery(api.promptCoach.getSavedPrompts);
  const userProfile = useQuery(api.userProfiles.getUserProfile);

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
          badge: savedPrompts?.length || 0,
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
    [activeView, handleStartNew, savedPrompts?.length]
  );

  return (
    <div className="h-dvh flex flex-col bg-background">
      <AppHeader config={navConfig} onLogoClick={handleLogoClick} />

      <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className={`${spacing.chartContainer} w-full flex-1 min-h-0 flex flex-col ${spacing.container} py-4`}>
          {/* Inline Profile Prompt - shows when profile is incomplete */}
          {userProfile && (!userProfile.gradeLevel || !userProfile.subject) && (
            <InlineProfilePrompt />
          )}
          
          <div className="flex-1 min-h-0 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {activeView === "chat" ? (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="h-full"
                >
                  <ChatInterface
                    conversationId={currentConversationId}
                    onStartNew={handleStartNew}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="library"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="h-full"
                >
                  <PromptLibrary
                    onSelectPrompt={(prompt) => {
                      console.log("Selected prompt", prompt);
                      setActiveView("chat");
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
