import { Minimize2, ListPlus, FileText, Users, Target, type LucideIcon } from "lucide-react";

/**
 * Configuration for a refinement button.
 */
export interface RefinementButton {
  /** Unique identifier for the refinement */
  id: string;
  /** Full label shown on desktop */
  label: string;
  /** Short label shown on mobile */
  shortLabel: string;
  /** The prompt modifier text sent to the AI */
  promptModifier: string;
  /** Tier determines when the button appears */
  tier: "universal" | "contextual" | "leads";
  /** Lucide icon component */
  icon: LucideIcon;
  /** Profile fields required for this refinement (shows locked if missing) */
  requiresProfile?: ("gradeLevel" | "subject")[];
  /** Message shown in locked popover */
  lockedMessage?: string;
}

/**
 * Context passed to visibility logic functions.
 */
export interface RefinementContext {
  userProfile: {
    subject?: string;
    gradeLevel?: string;
    role?: string;
  } | null | undefined;
  currentPromptText: string;
}

/**
 * Counts words in a text string.
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Checks if a refinement button should be locked based on user profile.
 */
export function isRefinementLocked(
  refinement: RefinementButton,
  userProfile: RefinementContext["userProfile"]
): boolean {
  if (!refinement.requiresProfile || refinement.requiresProfile.length === 0) {
    return false;
  }
  return refinement.requiresProfile.some(
    (field) => !userProfile?.[field]
  );
}

/**
 * Returns the list of refinement buttons to display based on context.
 * Includes word-count visibility logic for universal buttons.
 */
export function getVisibleRefinements(context: RefinementContext): RefinementButton[] {
  const wordCount = countWords(context.currentPromptText);
  const buttons: RefinementButton[] = [];

  // Universal buttons with word-count logic
  // Hide "Make shorter" if prompt is already short (<150 words)
  if (wordCount >= 150) {
    buttons.push(REFINEMENTS["make-shorter"]);
  }

  // Hide "Add details" if prompt is already long (>400 words)
  if (wordCount <= 400) {
    buttons.push(REFINEMENTS["make-detailed"]);
  }

  // Simplify is always shown
  buttons.push(REFINEMENTS["simplify-language"]);

  // Locked preview buttons (always shown, locked state determined by profile)
  buttons.push(REFINEMENTS["add-differentiation"]);
  buttons.push(REFINEMENTS["align-standard"]);

  return buttons;
}

/**
 * Get a refinement by ID.
 */
export function getRefinementById(id: string): RefinementButton | undefined {
  return REFINEMENTS[id];
}

// =============================================================================
// Prompt Modifiers (full text sent to AI)
// =============================================================================

const PROMPT_MODIFIERS = {
  "make-shorter": `Condense this prompt to focus only on the essential elements. Remove any redundant instructions, unnecessary context, or verbose language. The resulting prompt should be scannable and actionable while maintaining all critical requirements for the AI to generate useful output.`,

  "make-detailed": `Expand this prompt with more specific instructions, concrete examples, and additional scaffolding. Include explicit success criteria, potential edge cases to address, and detailed formatting expectations. The AI should have comprehensive guidance to produce exactly what the teacher needs.`,

  "simplify-language": `Rewrite this prompt using simpler vocabulary, shorter sentences, and clearer structure. Assume the teacher may adapt the AI's output for students who struggle with complex text, English Language Learners, or younger grade levels. Avoid jargon and use accessible language throughout.`,

  "add-differentiation": `Modify this prompt to generate output that includes:
- Scaffolds for struggling learners (sentence starters, graphic organizers, reduced complexity options)
- Extensions for advanced learners (deeper questions, additional challenges, enrichment opportunities)
- Accommodations for students with IEPs (modified expectations, alternative formats, support structures)
Ensure the core learning objective remains consistent across all tiers.`,

  "align-standard": `Explicitly align this prompt to the relevant Louisiana Student Standards. Include the specific standard code (e.g., CCSS.ELA-LITERACY.RL.5.2 or LSSS.5.MD.C.3). Ensure the task directly addresses the standard's requirements and that success on the task demonstrates mastery of the standard. If multiple standards apply, identify the primary standard and note supporting standards.`,
} as const;

// =============================================================================
// Refinement Button Definitions
// =============================================================================

export const REFINEMENTS: Record<string, RefinementButton> = {
  "make-shorter": {
    id: "make-shorter",
    label: "Make shorter",
    shortLabel: "Shorter",
    icon: Minimize2,
    tier: "universal",
    promptModifier: PROMPT_MODIFIERS["make-shorter"],
  },

  "make-detailed": {
    id: "make-detailed",
    label: "Add details",
    shortLabel: "Details",
    icon: ListPlus,
    tier: "universal",
    promptModifier: PROMPT_MODIFIERS["make-detailed"],
  },

  "simplify-language": {
    id: "simplify-language",
    label: "Simplify",
    shortLabel: "Simplify",
    icon: FileText,
    tier: "universal",
    promptModifier: PROMPT_MODIFIERS["simplify-language"],
  },

  "add-differentiation": {
    id: "add-differentiation",
    label: "Differentiate",
    shortLabel: "Diff",
    icon: Users,
    tier: "contextual",
    requiresProfile: ["gradeLevel"],
    lockedMessage: "Add your grade level to get age-appropriate differentiation tiers",
    promptModifier: PROMPT_MODIFIERS["add-differentiation"],
  },

  "align-standard": {
    id: "align-standard",
    label: "Align to standard",
    shortLabel: "Standard",
    icon: Target,
    tier: "contextual",
    requiresProfile: ["gradeLevel", "subject"],
    lockedMessage: "Add your grade level and subject to align prompts with Louisiana standards",
    promptModifier: PROMPT_MODIFIERS["align-standard"],
  },
};

// =============================================================================
// Library Refinements (Phase 2)
// =============================================================================

/**
 * Refinement buttons to show in the PromptLibrary.
 * Curated subset - most useful for iterating on saved prompts.
 * These are always unlocked since we're refining existing prompts.
 */
export const LIBRARY_REFINEMENTS = [
  REFINEMENTS["make-shorter"],
  REFINEMENTS["make-detailed"],
  REFINEMENTS["simplify-language"],
] as const;
