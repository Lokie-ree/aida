import { useCallback } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { MobileHeader } from "./MobileHeader";
import { Id } from "../../../convex/_generated/dataModel";

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId: string }>();

  // Data fetching
  const conversations = useQuery(api.promptCoach.listConversations);
  const savedPrompts = useQuery(api.promptCoach.getSavedPrompts);

  // Mutations
  const startConversation = useMutation(api.promptCoach.startConversation);
  const renameConversation = useMutation(api.promptCoach.renameConversation);
  const deleteConversation = useMutation(api.promptCoach.deleteConversation);

  // Handlers
  const handleNewChat = useCallback(async () => {
    const newId = await startConversation({ title: "New Coaching Session" });
    navigate(`/coach/${newId}`);
  }, [startConversation, navigate]);

  const handleRenameSession = useCallback(
    async (id: string, newTitle: string) => {
      try {
        await renameConversation({
          conversationId: id as Id<"promptConversations">,
          title: newTitle,
        });
      } catch (error) {
        console.error("Failed to rename session:", error);
      }
    },
    [renameConversation]
  );

  const handleDeleteSession = useCallback(
    async (id: string) => {
      try {
        // If deleting current conversation, navigate away first
        if (conversationId === id) {
          navigate("/coach");
        }
        await deleteConversation({
          conversationId: id as Id<"promptConversations">,
        });
      } catch (error) {
        console.error("Failed to delete session:", error);
      }
    },
    [deleteConversation, conversationId, navigate]
  );

  const handleSignOut = useCallback(async () => {
    await authClient.signOut();
    navigate("/");
  }, [navigate]);

  const promptCount = savedPrompts?.length ?? 0;

  // Get default sidebar state from localStorage
  const defaultOpen = typeof window !== "undefined"
    ? localStorage.getItem("sidebar_state") !== "false"
    : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        conversations={conversations}
        currentConversationId={conversationId}
        promptCount={promptCount}
        onNewChat={handleNewChat}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
        onSignOut={handleSignOut}
      />
      <SidebarInset className="flex flex-col h-dvh">
        <MobileHeader
          conversations={conversations}
          currentConversationId={conversationId}
          promptCount={promptCount}
          onNewChat={handleNewChat}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 min-h-0 overflow-hidden">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
