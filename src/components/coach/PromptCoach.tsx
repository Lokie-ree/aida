import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { ChatInterface } from "./ChatInterface";
import { PromptLibrary } from "./PromptLibrary";
import { InlineProfilePrompt } from "./InlineProfilePrompt";
import { AppHeader, type NavConfig } from "@/components/navigation";
import { Metadata } from "@/components/shared/Metadata";
import { Id } from "../../../convex/_generated/dataModel";
import { spacing } from "@/lib/spacing";
import { MessageSquare, Library, PlusCircle, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function PromptCoach() {
  const [activeView, setActiveView] = useState<"chat" | "library">("chat");
  const [currentConversationId, setCurrentConversationId] = useState<Id<"promptConversations"> | null>(null);
  const navigate = useNavigate();

  const startConversation = useMutation(api.promptCoach.startConversation);
  const renameConversation = useMutation(api.promptCoach.renameConversation);
  const deleteConversation = useMutation(api.promptCoach.deleteConversation);
  const savedPrompts = useQuery(api.promptCoach.getSavedPrompts);
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const conversations = useQuery(api.promptCoach.listConversations);

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

  const handleSelectConversation = useCallback(
    (id: Id<"promptConversations">) => {
      setCurrentConversationId(id);
      setActiveView("chat");
    },
    []
  );

  // Build recent sessions for mobile menu
  const recentSessions = useMemo(() => {
    if (!conversations) return [];
    return conversations.map((conv) => {
      const firstUserMessage = conv.messages?.find((m) => m.role === "user");
      const title = conv.title ||
        (firstUserMessage?.content
          ? firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? "…" : "")
          : "Untitled session");
      return {
        id: conv._id,
        title,
        timeAgo: formatDistanceToNow(conv.lastUpdated, { addSuffix: true }),
        isActive: currentConversationId === conv._id,
      };
    });
  }, [conversations, currentConversationId]);

  const handleMenuSelectSession = useCallback((id: string) => {
    setCurrentConversationId(id as Id<"promptConversations">);
    setActiveView("chat");
  }, []);

  const handleRenameSession = useCallback(async (id: string, newTitle: string) => {
    try {
      await renameConversation({
        conversationId: id as Id<"promptConversations">,
        title: newTitle,
      });
    } catch (error) {
      console.error("Failed to rename session:", error);
    }
  }, [renameConversation]);

  const handleDeleteSession = useCallback(async (id: string) => {
    try {
      // If we're deleting the current conversation, clear it
      if (currentConversationId === id) {
        setCurrentConversationId(null);
      }
      await deleteConversation({
        conversationId: id as Id<"promptConversations">,
      });
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  }, [deleteConversation, currentConversationId]);

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
      recentSessions,
      onSelectSession: handleMenuSelectSession,
      onRenameSession: handleRenameSession,
      onDeleteSession: handleDeleteSession,
    }),
    [activeView, handleStartNew, savedPrompts?.length, recentSessions, handleMenuSelectSession, handleRenameSession, handleDeleteSession]
  );

  return (
    <div className="h-dvh flex flex-col bg-background">
      <Metadata 
        title="Prompt Coach - Pelican AI"
        description="Get personalized AI coaching to generate Louisiana-aligned prompts for your lessons. Our conversational coach helps you create high-quality prompts for ChatGPT, Claude, Gemini, and more."
        url="/coach"
        noindex={true}
      />
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
                    onSelectConversation={handleSelectConversation}
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
