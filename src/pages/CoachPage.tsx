import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChatInterface } from "@/components/coach/ChatInterface";
import { InlineProfilePrompt } from "@/components/coach/InlineProfilePrompt";
import { Metadata } from "@/components/shared/Metadata";
import { Id } from "../../convex/_generated/dataModel";
import { spacing } from "@/lib/spacing";

export function CoachPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();

  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const startConversation = useMutation(api.promptCoach.startConversation);

  const handleStartNew = useCallback(async () => {
    const newId = await startConversation({ title: "New Coaching Session" });
    navigate(`/coach/${newId}`);
  }, [startConversation, navigate]);

  const handleSelectConversation = useCallback(
    (id: Id<"promptConversations">) => {
      navigate(`/coach/${id}`);
    },
    [navigate]
  );

  const typedConversationId = conversationId
    ? (conversationId as Id<"promptConversations">)
    : null;

  return (
    <div className="h-full flex flex-col">
      <Metadata
        title="Prompt Coach - Pelican AI"
        description="Get personalized AI coaching to generate Louisiana-aligned prompts for your lessons."
        url="/coach"
        noindex={true}
      />

      <div className={`${spacing.chartContainer} w-full flex-1 min-h-0 flex flex-col ${spacing.container} py-4`}>
        {/* Inline Profile Prompt - shows when profile is incomplete */}
        {userProfile && (!userProfile.gradeLevel || !userProfile.subject) && (
          <InlineProfilePrompt />
        )}

        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatInterface
            conversationId={typedConversationId}
            onStartNew={handleStartNew}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </div>
    </div>
  );
}
