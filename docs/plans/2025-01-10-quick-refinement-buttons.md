# Quick Refinement Buttons - Implementation Plan

**Date:** 2025-01-10
**Status:** Draft
**Target:** MVP End of January, Full Release February

## Overview

Quick Refinement Buttons eliminate the friction of manually re-typing refinement requests by surfacing contextually appropriate one-click prompt modifications after each generated prompt. This directly addresses beta feedback: "refining prompts is tedious" and "having to use the correct verbiage."

**Core Filter:** Does this help a Louisiana teacher get a better, more aligned prompt faster? ✅ Yes - transforms tedious refinement into guided coaching.

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Button style | Pill/chip (not heavy buttons) | Lightweight feel, doesn't overwhelm |
| Visible limit | 4-5 buttons max, overflow into "More" | Avoid decision paralysis |
| Placement | Below generated prompt, above copy/save | Natural flow before final actions |
| Regeneration approach | Full regenerate with modifier appended | Simpler than diff-based; maintains context |
| State tracking | Local component state for MVP | No schema changes needed; analytics later |
| Context source | `userProfile` + conversation analysis | Use existing data, no new intake |
| Mobile behavior | Horizontal scroll on narrow screens | Touch-friendly, no truncation |

---

## Component Architecture

### New Files

```
src/components/coach/
├── RefinementButtons.tsx        # Main button row component
├── RefinementButton.tsx         # Individual button with tooltip
└── refinement-definitions.ts    # Button configs and modifiers
```

### Modified Files

```
src/components/coach/ChatInterface.tsx   # Add RefinementButtons after prompts
convex/promptCoach.ts                    # Add applyRefinement action
convex/schema.ts                         # (Phase 2) Add refinement tracking
```

---

## Data Model

### Phase 1: No Schema Changes

Refinements are applied by modifying the user message sent to `sendMessage`. State is local to the component.

```typescript
// src/components/coach/refinement-definitions.ts

export interface RefinementButton {
  id: string;
  label: string;
  shortLabel: string;         // For mobile/tight spaces
  promptModifier: string;
  tier: 'universal' | 'contextual' | 'leads';
  icon?: LucideIcon;
  showWhen?: (context: RefinementContext) => boolean;
  leadsIndicator?: string;    // e.g., "2c", "2b"
}

export interface RefinementContext {
  userProfile: {
    subject?: string;
    gradeLevel?: string;
    role?: string;
  } | null;
  conversationMessages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  currentPromptText: string;
}
```

### Phase 2: Analytics Schema (February)

```typescript
// convex/schema.ts addition

promptRefinements: defineTable({
  userId: v.string(),
  conversationId: v.id("promptConversations"),
  refinementId: v.string(),           // e.g., "make-shorter"
  originalPromptIndex: v.number(),    // Which message was refined
  appliedAt: v.number(),
}).index("by_user", ["userId"])
  .index("by_conversation", ["conversationId"])
  .index("by_refinement", ["refinementId"]),
```

---

## Tier 1: Universal Refinements (MVP)

These appear after every generated prompt.

| ID | Label | Icon | Prompt Modifier |
|----|-------|------|-----------------|
| `make-shorter` | Make shorter | `Minimize2` | See appendix |
| `make-detailed` | Add details | `ListPlus` | See appendix |
| `simplify-language` | Simplify | `FileText` | See appendix |
| `add-differentiation` | Differentiate | `Users` | See appendix |

### Button Visibility Logic

```typescript
// Always show first 4 universal buttons
// Don't show "Make shorter" if prompt is already under 150 words
// Don't show "Add details" if prompt is already over 400 words
```

---

## Tier 2: Context-Aware Refinements (Phase 2)

| ID | Label | Shows When | Prompt Modifier |
|----|-------|------------|-----------------|
| `align-standard` | Align to standard | No LA standard code detected | See appendix |
| `add-exit-ticket` | Add exit ticket | Prompt type is lesson planning | See appendix |
| `sped-friendly` | SPED-friendly | `userProfile.subject` includes "special ed" or message mentions IEP | See appendix |
| `add-rubric` | Add rubric | Prompt type is assessment | See appendix |

### Context Detection

```typescript
function detectPromptType(content: string): 'lesson' | 'assessment' | 'communication' | 'other' {
  const lower = content.toLowerCase();
  if (lower.includes('lesson') || lower.includes('activity') || lower.includes('unit')) {
    return 'lesson';
  }
  if (lower.includes('assessment') || lower.includes('quiz') || lower.includes('test') || lower.includes('rubric')) {
    return 'assessment';
  }
  if (lower.includes('parent') || lower.includes('email') || lower.includes('newsletter')) {
    return 'communication';
  }
  return 'other';
}

function hasLouisianaStandard(content: string): boolean {
  // Match patterns like RL.5.3, W.8.2, 4.NF.A.1, LSSS codes
  return /\b([A-Z]{1,4}\.\d+\.\d+|\d+\.[A-Z]{1,4}\.[A-Z]\.\d+)\b/i.test(content);
}
```

---

## Tier 3: LEADS-Aligned Refinements (Phase 3)

| ID | Label | LEADS | Shows When |
|----|-------|-------|------------|
| `increase-rigor` | Increase rigor | 2b | Always (universal) |
| `add-questioning` | Add questioning | 2a | Lesson prompts |
| `build-engagement` | Build engagement | 2d | Lesson prompts |
| `connect-prior` | Connect prior learning | 1c | Lesson prompts |

---

## UI Implementation

### RefinementButtons Component

```tsx
// src/components/coach/RefinementButtons.tsx

interface RefinementButtonsProps {
  promptText: string;
  conversationId: Id<"promptConversations">;
  messageIndex: number;
  onRefinementApplied: () => void;
  appliedRefinements: Set<string>;  // Track which have been used
}

export function RefinementButtons({
  promptText,
  conversationId,
  messageIndex,
  onRefinementApplied,
  appliedRefinements,
}: RefinementButtonsProps) {
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const sendMessage = useAction(api.promptCoach.sendMessage);
  const [isApplying, setIsApplying] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  const context: RefinementContext = {
    userProfile,
    conversationMessages: [], // Passed from parent or derived
    currentPromptText: promptText,
  };

  const visibleButtons = getVisibleRefinements(context);
  const primaryButtons = visibleButtons.slice(0, 4);
  const overflowButtons = visibleButtons.slice(4);

  const handleApplyRefinement = async (refinement: RefinementButton) => {
    setIsApplying(refinement.id);
    try {
      // Send refinement request as a message
      const refinementMessage = `Please refine the prompt above: ${refinement.promptModifier}`;
      await sendMessage({ conversationId, message: refinementMessage });
      onRefinementApplied();
    } finally {
      setIsApplying(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Wand2 className="h-3 w-3" />
        <span>Refine this prompt:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {primaryButtons.map((btn) => (
          <RefinementButton
            key={btn.id}
            refinement={btn}
            isApplying={isApplying === btn.id}
            wasApplied={appliedRefinements.has(btn.id)}
            onClick={() => handleApplyRefinement(btn)}
          />
        ))}
        
        {overflowButtons.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? 'Less' : `+${overflowButtons.length} more`}
          </Button>
        )}
      </div>
      
      {showMore && overflowButtons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap gap-2"
        >
          {overflowButtons.map((btn) => (
            <RefinementButton
              key={btn.id}
              refinement={btn}
              isApplying={isApplying === btn.id}
              wasApplied={appliedRefinements.has(btn.id)}
              onClick={() => handleApplyRefinement(btn)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
```

### Individual Button Component

```tsx
// src/components/coach/RefinementButton.tsx

interface RefinementButtonProps {
  refinement: RefinementButton;
  isApplying: boolean;
  wasApplied: boolean;
  onClick: () => void;
}

export function RefinementButton({
  refinement,
  isApplying,
  wasApplied,
  onClick,
}: RefinementButtonProps) {
  const Icon = refinement.icon || Sparkles;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={wasApplied ? "secondary" : "outline"}
          size="sm"
          className={cn(
            "h-7 px-3 text-xs rounded-full transition-all",
            wasApplied && "opacity-60",
            isApplying && "animate-pulse"
          )}
          onClick={onClick}
          disabled={isApplying}
        >
          {isApplying ? (
            <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
          ) : (
            <Icon className="h-3 w-3 mr-1.5" />
          )}
          <span className="hidden sm:inline">{refinement.label}</span>
          <span className="sm:hidden">{refinement.shortLabel}</span>
          {wasApplied && <Check className="h-3 w-3 ml-1.5 text-green-500" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <p className="text-xs">{refinement.promptModifier.slice(0, 100)}...</p>
        {refinement.leadsIndicator && (
          <Badge variant="outline" className="mt-1 text-[10px]">
            LEADS {refinement.leadsIndicator}
          </Badge>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
```

### Integration in ChatInterface

```tsx
// In ChatInterface.tsx, after the message content and before action buttons

{msg.role === "assistant" && isPrompt && (
  <RefinementButtons
    promptText={msg.content}
    conversationId={conversationId}
    messageIndex={idx}
    onRefinementApplied={() => {
      // Optionally track which refinement was applied
      setAppliedRefinements(prev => new Set(prev).add(refinementId));
    }}
    appliedRefinements={appliedRefinements}
  />
)}
```

---

## Responsive Design

### Desktop (≥768px)
- Full labels on buttons
- 4 visible, overflow into "More" popover
- Hover tooltips show full modifier text

### Mobile (<768px)
- Short labels on buttons
- Horizontal scroll if needed (min-width: 44px per button)
- Tap tooltip on long-press (future enhancement)

```css
/* Button row on mobile */
.refinement-row {
  @apply flex overflow-x-auto gap-2 pb-2 -mx-2 px-2;
  scrollbar-width: none; /* Hide scrollbar */
}

.refinement-row::-webkit-scrollbar {
  display: none;
}
```

---

## Implementation Phases

### Phase 1: MVP (Target: End of January)

**Scope:**
- [ ] Create `refinement-definitions.ts` with Tier 1 buttons
- [ ] Create `RefinementButton.tsx` component
- [ ] Create `RefinementButtons.tsx` container
- [ ] Integrate into `ChatInterface.tsx`
- [ ] Add refinement as a chat message (reuses existing `sendMessage`)
- [ ] Local state tracking for applied refinements
- [ ] Mobile-responsive button row

**Not in MVP:**
- No Tier 2/3 buttons
- No analytics tracking
- No undo functionality
- No custom refinements

### Phase 2: Context-Aware (Target: February)

**Scope:**
- [ ] Add Tier 2 context-aware buttons
- [ ] Implement `detectPromptType()` and `hasLouisianaStandard()`
- [ ] Add `showWhen` logic to button definitions
- [ ] Schema: Add `promptRefinements` table
- [ ] Track refinement usage (for analytics)
- [ ] Add "Undo" to revert to previous prompt version

### Phase 3: LEADS Integration (Target: March)

**Scope:**
- [ ] Add Tier 3 LEADS-aligned buttons
- [ ] Visual LEADS indicator badges on buttons
- [ ] Refinement analytics dashboard (admin view)
- [ ] Custom refinement buttons (user-defined)

---

## Backend Changes

### Phase 1: No New Endpoints

Refinements are sent as regular messages through the existing `sendMessage` action. The refinement modifier is prepended to the message:

```typescript
// When user clicks "Make shorter":
const message = `Please refine the prompt above: ${refinement.promptModifier}`;
await sendMessage({ conversationId, message });
```

This approach:
- Reuses existing conversation context
- Maintains full message history
- No new API endpoints needed
- RAG context still applied to refinement

### Phase 2: Analytics Mutation

```typescript
// convex/promptCoach.ts addition

export const trackRefinement = mutation({
  args: {
    conversationId: v.id("promptConversations"),
    refinementId: v.string(),
    originalPromptIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    await ctx.db.insert("promptRefinements", {
      userId: user._id,
      conversationId: args.conversationId,
      refinementId: args.refinementId,
      originalPromptIndex: args.originalPromptIndex,
      appliedAt: Date.now(),
    });
  },
});
```

---

## Open Questions

### Resolved

| Question | Decision |
|----------|----------|
| Regeneration delay tolerance? | Show inline loading state; users expect AI delay |
| Button limit A/B test? | Start with 4, gather feedback before testing |
| Prompt history retention? | Infinite (existing conversation model) |

### Still Open

1. **Undo UX**: Should "Undo" be a button or keyboard shortcut (Cmd+Z)?
2. **Chained refinements**: After refining, should we show different buttons based on what was already applied?
3. **Power user customization**: How do users create their own refinement buttons?

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Adoption | 40%+ of prompts refined at least once | Track `promptRefinements` |
| Satisfaction | Reduced "tedious refinement" complaints | Beta feedback |
| Efficiency | Faster time to "Worked in Classroom" | Compare before/after |
| Popular refinements | Identify top 3 most-used | Analytics dashboard |

---

## Appendix: Full Prompt Modifiers

### Make it shorter
```
Condense this prompt to focus only on the essential elements. Remove any 
redundant instructions, unnecessary context, or verbose language. The 
resulting prompt should be scannable and actionable while maintaining all 
critical requirements for the AI to generate useful output.
```

### Make it more detailed
```
Expand this prompt with more specific instructions, concrete examples, and 
additional scaffolding. Include explicit success criteria, potential edge 
cases to address, and detailed formatting expectations. The AI should have 
comprehensive guidance to produce exactly what the teacher needs.
```

### Simplify the language
```
Rewrite this prompt using simpler vocabulary, shorter sentences, and clearer 
structure. Assume the teacher may adapt the AI's output for students who 
struggle with complex text, English Language Learners, or younger grade 
levels. Avoid jargon and use accessible language throughout.
```

### Add differentiation
```
Modify this prompt to generate output that includes:
- Scaffolds for struggling learners (sentence starters, graphic organizers, 
  reduced complexity options)
- Extensions for advanced learners (deeper questions, additional challenges, 
  enrichment opportunities)  
- Accommodations for students with IEPs (modified expectations, alternative 
  formats, support structures)
Ensure the core learning objective remains consistent across all tiers.
```

### Align to standard
```
Explicitly align this prompt to the relevant Louisiana Student Standards. 
Include the specific standard code (e.g., CCSS.ELA-LITERACY.RL.5.2 or 
LSSS.5.MD.C.3). Ensure the task directly addresses the standard's 
requirements and that success on the task demonstrates mastery of the 
standard. If multiple standards apply, identify the primary standard and 
note supporting standards.
```

### Increase rigor
```
Elevate the cognitive demand of this task to higher levels of Bloom's 
Taxonomy or Webb's Depth of Knowledge. Ensure students are required to 
analyze, evaluate, synthesize, or create rather than simply recall, 
identify, or apply. The task should require students to grapple with 
complexity, defend positions with evidence, or produce original work.
```

### Add exit ticket
```
Add a brief formative assessment or exit ticket that checks for understanding 
of the key concept. The exit ticket should:
- Take 3-5 minutes for students to complete
- Assess the lesson's primary learning objective
- Provide actionable data for teacher decision-making
- Be easy to quickly scan for patterns in student understanding
```

### SPED-friendly
```
Adapt this prompt to generate materials appropriate for students with IEPs, 
including:
- Simplified language with shorter sentences
- Chunked information with clear visual breaks
- Built-in supports (word banks, sentence starters, graphic organizers)
- Multiple means of expression options
- Reduced cognitive load while maintaining learning objectives
```

---

## References

- [QUICK_REFINEMENT_BUTTONS.md](../../QUICK_REFINEMENT_BUTTONS.md) - Original feature proposal
- [2025-12-18-prompt-first-redesign.md](./2025-12-18-prompt-first-redesign.md) - Current prompt coach behavior
- Louisiana Educator Rubric (LER) - LEADS indicators referenced in Tier 3
