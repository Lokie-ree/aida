import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { RefinementButton } from "./RefinementButton";
import {
  getVisibleRefinements,
  isRefinementLocked,
  type RefinementButton as RefinementButtonType,
  type RefinementContext,
} from "./refinement-definitions";

interface RefinementButtonsProps {
  /** The prompt text to refine */
  promptText: string;
  /** The conversation ID to send refinement messages to */
  conversationId: Id<"promptConversations">;
  /** Index of this message in the conversation (for tracking) */
  messageIndex: number;
  /** User profile data (null/undefined if not loaded or incomplete) */
  userProfile: {
    subject?: string;
    gradeLevel?: string;
    role?: string;
  } | null | undefined;
  /** Callback when a refinement is applied */
  onRefinementApplied: (refinementId: string) => void;
  /** Set of refinement IDs that have already been applied */
  appliedRefinements: Set<string>;
}

/**
 * Container component for refinement buttons.
 * Displays a row of quick-action buttons below generated prompts.
 * Handles visibility logic, locked states, and refinement application.
 */
export function RefinementButtons({
  promptText,
  conversationId,
  messageIndex,
  userProfile,
  onRefinementApplied,
  appliedRefinements,
}: RefinementButtonsProps) {
  const sendMessage = useAction(api.promptCoach.sendMessage);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  // Build context for visibility logic
  const context: RefinementContext = {
    userProfile,
    currentPromptText: promptText,
  };

  // Get visible buttons based on context (word count, etc.)
  const visibleButtons = getVisibleRefinements(context);

  /**
   * Apply a refinement by sending a message with the modifier.
   */
  const handleApplyRefinement = async (refinement: RefinementButtonType) => {
    setApplyingId(refinement.id);
    try {
      // Send refinement request as a message
      const refinementMessage = `Please refine the prompt above: ${refinement.promptModifier}`;
      await sendMessage({ conversationId, message: refinementMessage });
      onRefinementApplied(refinement.id);
    } catch (error) {
      console.error("Failed to apply refinement:", error);
      // Error handling is done via toast in ChatInterface
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="flex flex-col gap-1.5 sm:gap-2 mt-2 sm:mt-3"
    >
      {/* Label */}
      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
        <Wand2 className="h-3 w-3" />
        <span>Refine:</span>
      </div>

      {/* Button row - compact on mobile, spaced on desktop */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {visibleButtons.map((btn) => (
          <RefinementButton
            key={btn.id}
            refinement={btn}
            isLocked={isRefinementLocked(btn, userProfile)}
            isApplying={applyingId === btn.id}
            wasApplied={appliedRefinements.has(btn.id)}
            onApply={() => handleApplyRefinement(btn)}
          />
        ))}
      </div>
    </motion.div>
  );
}
