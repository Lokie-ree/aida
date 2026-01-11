# Quick Refinement Buttons - Implementation Plan

**Date:** 2025-01-10
**Status:** Draft
**Target:** MVP End of January, Full Release February

## Overview

Quick Refinement Buttons eliminate the friction of manually re-typing refinement requests by surfacing contextually appropriate one-click prompt modifications after each generated prompt. This directly addresses beta feedback: "refining prompts is tedious" and "having to use the correct verbiage."

**Core Filter:** Does this help a Louisiana teacher get a better, more aligned prompt faster? ✅ Yes - transforms tedious refinement into guided coaching.

**Secondary Goal:** Use refinement buttons as a teaching tool—showing users the value of profile completion through "locked" buttons that demonstrate what's possible when profile data is available.

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
| Profile-locked buttons | Show "locked" state for buttons requiring profile | Teaches value of profile completion |
| Library integration | Add refinement buttons to saved prompts | No hunting through chat history |

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
src/components/coach/PromptLibrary.tsx   # (Phase 2) Add refinement buttons to saved prompts
src/components/shared/ProfileSettings.tsx # (Phase 2) Add prompt preferences section
convex/promptCoach.ts                    # Add applyRefinement action, refineFromLibrary
convex/schema.ts                         # (Phase 2) Add refinement tracking, prompt preferences
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
  requiresProfile?: ('gradeLevel' | 'subject')[];  // Shows locked if missing
  lockedMessage?: string;     // Tooltip when locked
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

## Profile-Locked Buttons (Phase 1)

**Pedagogical Approach**: Instead of front-loading profile completion as a separate onboarding step, let users *discover* the value of profile data through locked refinement buttons. This is "I do → We do → You do" applied to product onboarding.

### How It Works

1. User generates their first prompt with incomplete profile
2. Refinement buttons appear, but some show a "locked" state:
   ```
   [Make shorter] [Add details] [🔒 Align to standard] [🔒 Differentiate]
   ```
3. Clicking a locked button shows a popover:
   > "Complete your grade level and subject to unlock Louisiana-aligned refinements"
   > [Complete Profile →]
4. After profile completion, buttons unlock immediately (reactive query)

### Locked Button Definition

```typescript
// Tier 2 buttons that require profile data
{
  id: 'align-standard',
  label: 'Align to standard',
  shortLabel: 'Standard',
  requiresProfile: ['gradeLevel', 'subject'],
  lockedMessage: 'Add your grade level and subject to align prompts with Louisiana standards',
  showWhen: (ctx) => !hasLouisianaStandard(ctx.currentPromptText),
  // ...
},
{
  id: 'add-differentiation',
  label: 'Differentiate',
  shortLabel: 'Diff',
  requiresProfile: ['gradeLevel'],  // Only needs grade level
  lockedMessage: 'Add your grade level to get age-appropriate differentiation tiers',
  // ...
}
```

### Locked Button UI

```tsx
// In RefinementButton.tsx
const isLocked = refinement.requiresProfile?.some(
  field => !userProfile?.[field]
);

if (isLocked) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-3 text-xs rounded-full opacity-50 cursor-pointer"
        >
          <Lock className="h-3 w-3 mr-1.5" />
          <span className="hidden sm:inline">{refinement.label}</span>
          <span className="sm:hidden">{refinement.shortLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <p className="text-sm text-muted-foreground mb-3">
          {refinement.lockedMessage}
        </p>
        <Button size="sm" onClick={() => navigate('/profile')}>
          Complete Profile →
        </Button>
      </PopoverContent>
    </Popover>
  );
}
```

### Why This Works

- **Shows value before asking for data**: Users see what they're missing
- **Progressive disclosure**: Advanced features revealed, not hidden
- **Zero separate onboarding**: The product teaches itself
- **Immediate payoff**: Profile completion → instant unlock (reactive)

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

## Refinement Buttons in PromptLibrary (Phase 2)

**Problem**: Users save prompts but then have to hunt through chat history to refine them later. Saved prompts become static text instead of living documents.

**Solution**: Add refinement buttons directly to saved prompt cards in the library.

### User Flow

1. User views their saved prompts in `PromptsPage` / `PromptLibrary`
2. Each prompt card shows a "Refine" row with quick-action buttons
3. Clicking a refinement button:
   - Creates a new conversation (or continues existing one)
   - Pre-loads the saved prompt as context
   - Automatically sends the refinement request
   - Navigates to the Coach page to show the refined result

### UI in PromptLibrary

```tsx
// In PromptLibrary.tsx, inside each prompt card

<CardFooter className="pt-0 flex flex-col gap-3 p-3 mt-auto">
  {/* Existing buttons: Worked, Copy, Delete */}
  <div className="flex justify-between items-center">
    {/* ... existing footer content ... */}
  </div>
  
  {/* New: Refinement row */}
  <div className="flex items-center gap-2 pt-2 border-t">
    <span className="text-xs text-muted-foreground flex items-center gap-1">
      <Wand2 className="h-3 w-3" />
      Refine:
    </span>
    <div className="flex gap-1.5 overflow-x-auto">
      {quickRefinements.map((ref) => (
        <Button
          key={ref.id}
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs rounded-full hover:bg-primary/10"
          onClick={() => handleRefineFromLibrary(prompt, ref)}
        >
          <ref.icon className="h-3 w-3 mr-1" />
          {ref.shortLabel}
        </Button>
      ))}
    </div>
  </div>
</CardFooter>
```

### Backend: Refine from Library Action

```typescript
// convex/promptCoach.ts

export const refineFromLibrary = action({
  args: {
    promptId: v.id("generatedPrompts"),
    refinementId: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"promptConversations">> => {
    // Get the saved prompt
    const prompt = await ctx.runQuery(api.promptCoach.getSavedPrompt, { 
      promptId: args.promptId 
    });
    if (!prompt) throw new Error("Prompt not found");

    // Get refinement definition
    const refinement = getRefinementById(args.refinementId);
    if (!refinement) throw new Error("Invalid refinement");

    // Create new conversation with context
    const conversationId = await ctx.runMutation(
      api.promptCoach.startConversation,
      { title: `Refining: ${prompt.context.topic || 'Saved prompt'}` }
    );

    // Send the refinement request with original prompt as context
    const message = `I have this prompt I'd like to refine:\n\n---\n${prompt.promptText}\n---\n\n${refinement.promptModifier}`;
    
    await ctx.runAction(api.promptCoach.sendMessage, {
      conversationId,
      message,
    });

    return conversationId;
  },
});
```

### Navigation After Refinement

```tsx
// In PromptLibrary.tsx

const navigate = useNavigate();
const refineFromLibrary = useAction(api.promptCoach.refineFromLibrary);

const handleRefineFromLibrary = async (
  prompt: GeneratedPrompt, 
  refinement: RefinementButton
) => {
  try {
    const newConversationId = await refineFromLibrary({
      promptId: prompt._id,
      refinementId: refinement.id,
    });
    
    // Navigate to the new conversation
    navigate(`/coach/${newConversationId}`);
    toast.success(`Refining prompt: ${refinement.label}`);
  } catch (error) {
    toast.error("Failed to start refinement. Please try again.");
  }
};
```

### Which Buttons to Show in Library

Show a curated subset (3-4 most useful) to avoid clutter:

```typescript
const libraryRefinements = [
  refinements['make-shorter'],
  refinements['make-detailed'],
  refinements['add-differentiation'],
  refinements['align-standard'],
].filter(r => !r.requiresProfile || isProfileComplete);
```

### Refinement Badges on Cards (Phase 2+)

After refinement tracking is in place, show badges indicating which refinements were applied:

```tsx
{prompt.appliedRefinements?.length > 0 && (
  <div className="flex gap-1 mt-2">
    {prompt.appliedRefinements.map((refId) => (
      <Badge key={refId} variant="secondary" className="text-[10px]">
        {getRefinementById(refId)?.shortLabel}
      </Badge>
    ))}
  </div>
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

## Smart Profile Defaults from First Prompt (Phase 2)

**Problem**: Profile completion rate is low because users don't see immediate value. The `InlineProfilePrompt` feels like a form, not a conversation.

**Solution**: Parse grade/subject from the user's first message and offer to save it—zero extra effort required.

### User Flow

1. New user types: *"I'm teaching 5th grade math fractions"*
2. System detects "5th grade" and "math" in the message
3. After AI responds, show a toast or inline prompt:
   > **We noticed you're teaching 5th Grade Math**
   > Save this to your profile for better-aligned prompts?
   > [Save to Profile] [Not now]
4. If saved, profile is complete without visiting ProfileSettings

### Detection Logic

```typescript
// src/lib/profile-detection.ts

interface DetectedProfile {
  gradeLevel?: string;
  subject?: string;
  confidence: 'high' | 'medium' | 'low';
}

export function detectProfileFromMessage(message: string): DetectedProfile | null {
  const lower = message.toLowerCase();
  
  // Grade detection patterns
  const gradePatterns = [
    { pattern: /\b(pre-?k|prek)\b/i, value: 'Pre-K' },
    { pattern: /\bkindergarten\b/i, value: 'K' },
    { pattern: /\b(\d+)(?:st|nd|rd|th)?\s*grade\b/i, extract: true },
    { pattern: /\bgrade\s*(\d+)\b/i, extract: true },
    { pattern: /\b(elementary|primary)\b/i, value: 'K-5' },
    { pattern: /\b(middle\s*school)\b/i, value: '6-8' },
    { pattern: /\b(high\s*school)\b/i, value: '9-12' },
  ];
  
  // Subject detection patterns
  const subjectPatterns = [
    { pattern: /\b(math|mathematics|algebra|geometry|calculus)\b/i, value: 'Mathematics' },
    { pattern: /\b(ela|english|reading|writing|literacy|language\s*arts)\b/i, value: 'ELA' },
    { pattern: /\b(science|biology|chemistry|physics)\b/i, value: 'Science' },
    { pattern: /\b(social\s*studies|history|geography|civics)\b/i, value: 'Social Studies' },
    { pattern: /\b(sped|special\s*ed|special\s*education)\b/i, value: 'Special Education' },
  ];
  
  let gradeLevel: string | undefined;
  let subject: string | undefined;
  
  for (const { pattern, value, extract } of gradePatterns) {
    const match = message.match(pattern);
    if (match) {
      gradeLevel = extract ? match[1] : value;
      break;
    }
  }
  
  for (const { pattern, value } of subjectPatterns) {
    if (pattern.test(message)) {
      subject = value;
      break;
    }
  }
  
  if (!gradeLevel && !subject) return null;
  
  return {
    gradeLevel,
    subject,
    confidence: (gradeLevel && subject) ? 'high' : 'medium',
  };
}
```

### Integration in ChatInterface

```tsx
// After first user message is sent and AI responds

useEffect(() => {
  if (
    conversation?.messages.length === 2 && // User + AI response
    !userProfile?.gradeLevel &&
    !userProfile?.subject &&
    !hasOfferedProfileSave
  ) {
    const firstUserMessage = conversation.messages[0];
    const detected = detectProfileFromMessage(firstUserMessage.content);
    
    if (detected && detected.confidence !== 'low') {
      setDetectedProfile(detected);
      setShowProfileSavePrompt(true);
    }
  }
}, [conversation?.messages.length]);

// Render inline prompt
{showProfileSavePrompt && detectedProfile && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-primary/5 border border-primary/20 rounded-lg p-3 my-3"
  >
    <p className="text-sm font-medium">
      We noticed you're teaching {detectedProfile.gradeLevel} {detectedProfile.subject}
    </p>
    <p className="text-xs text-muted-foreground mt-1">
      Save this to your profile for better-aligned prompts and refinements
    </p>
    <div className="flex gap-2 mt-3">
      <Button size="sm" onClick={handleSaveDetectedProfile}>
        Save to Profile
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setShowProfileSavePrompt(false)}>
        Not now
      </Button>
    </div>
  </motion.div>
)}
```

### Why This Works

- **Zero extra effort**: They already typed the info
- **Feels magical**: The system understands them
- **Removes bureaucracy**: No separate form to fill
- **High conversion**: Offering to save is easier than asking to enter

---

## Prompt Preferences in ProfileSettings (Phase 2-3)

**Problem**: Power users want to set default refinement behaviors. Some teachers always want differentiation, others prefer concise prompts.

**Solution**: Add an "Advanced: Prompt Preferences" section to ProfileSettings with progressive disclosure.

### User Flow

1. User visits ProfileSettings (after completing basic info)
2. They see a collapsed "Prompt Preferences" section
3. Expanding reveals checkboxes for default refinements
4. Selected preferences affect refinement button behavior:
   - Pre-checked refinements auto-apply to new prompts
   - Or: pre-selected refinements appear first in the button row

### UI in ProfileSettings

```tsx
// In ProfileSettings.tsx, after the main profile form

<Card className="shadow-sm">
  <CardHeader className="border-b cursor-pointer" onClick={() => setShowPreferences(!showPreferences)}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-base">Prompt Preferences</CardTitle>
        <Badge variant="secondary" className="text-[10px]">Optional</Badge>
      </div>
      {showPreferences ? <ChevronUp /> : <ChevronDown />}
    </div>
    <CardDescription>
      Customize how your prompts are generated
    </CardDescription>
  </CardHeader>
  
  <AnimatePresence>
    {showPreferences && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
      >
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Default prompt style</Label>
            <div className="flex gap-2">
              <Button
                variant={preferences.style === 'concise' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreferences(p => ({ ...p, style: 'concise' }))}
              >
                Concise
              </Button>
              <Button
                variant={preferences.style === 'balanced' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreferences(p => ({ ...p, style: 'balanced' }))}
              >
                Balanced
              </Button>
              <Button
                variant={preferences.style === 'detailed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreferences(p => ({ ...p, style: 'detailed' }))}
              >
                Detailed
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium">Always include</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={preferences.alwaysDifferentiate}
                  onCheckedChange={(checked) => 
                    setPreferences(p => ({ ...p, alwaysDifferentiate: !!checked }))
                  }
                />
                Differentiation tiers (scaffolds + extensions)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={preferences.alwaysSped}
                  onCheckedChange={(checked) => 
                    setPreferences(p => ({ ...p, alwaysSped: !!checked }))
                  }
                />
                SPED accommodations
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={preferences.alwaysExitTicket}
                  onCheckedChange={(checked) => 
                    setPreferences(p => ({ ...p, alwaysExitTicket: !!checked }))
                  }
                />
                Exit ticket suggestions
              </label>
            </div>
          </div>
        </CardContent>
      </motion.div>
    )}
  </AnimatePresence>
</Card>
```

### Schema Addition

```typescript
// convex/schema.ts

userProfiles: defineTable({
  // ... existing fields ...
  promptPreferences: v.optional(v.object({
    style: v.optional(v.union(
      v.literal('concise'),
      v.literal('balanced'),
      v.literal('detailed')
    )),
    alwaysDifferentiate: v.optional(v.boolean()),
    alwaysSped: v.optional(v.boolean()),
    alwaysExitTicket: v.optional(v.boolean()),
  })),
}),
```

### How Preferences Affect Refinement Buttons

```typescript
// In getVisibleRefinements()

function getVisibleRefinements(context: RefinementContext): RefinementButton[] {
  const { userProfile } = context;
  const prefs = userProfile?.promptPreferences;
  
  let buttons = [...universalRefinements];
  
  // If user prefers detailed, don't show "Add details" (already their default)
  if (prefs?.style === 'detailed') {
    buttons = buttons.filter(b => b.id !== 'make-detailed');
  }
  
  // If user always wants differentiation, mark it as "suggested" or pre-applied
  if (prefs?.alwaysDifferentiate) {
    const diffButton = buttons.find(b => b.id === 'add-differentiation');
    if (diffButton) {
      diffButton.suggested = true; // Show with highlight
    }
  }
  
  return buttons;
}
```

---

## Implementation Phases

### Phase 1: MVP (Target: End of January)

**Scope:**
- [ ] Create `refinement-definitions.ts` with Tier 1 buttons + `requiresProfile` field
- [ ] Create `RefinementButton.tsx` component with locked state
- [ ] Create `RefinementButtons.tsx` container
- [ ] Integrate into `ChatInterface.tsx`
- [ ] Add refinement as a chat message (reuses existing `sendMessage`)
- [ ] Local state tracking for applied refinements
- [ ] Mobile-responsive button row
- [ ] **Locked button UI with profile completion popover**

**Not in MVP:**
- No Tier 2/3 buttons (but locked buttons preview them)
- No analytics tracking
- No undo functionality
- No custom refinements
- No library integration
- No smart profile detection

### Phase 2: Context-Aware + Profile Intelligence (Target: February)

**Scope:**
- [ ] Add Tier 2 context-aware buttons
- [ ] Implement `detectPromptType()` and `hasLouisianaStandard()`
- [ ] Add `showWhen` logic to button definitions
- [ ] Schema: Add `promptRefinements` table
- [ ] Track refinement usage (for analytics)
- [ ] Add "Undo" to revert to previous prompt version
- [ ] **Refinement buttons in PromptLibrary**
- [ ] **`refineFromLibrary` action + navigation**
- [ ] **Smart profile detection from first message**
- [ ] **Prompt preferences section in ProfileSettings (collapsed by default)**

### Phase 3: LEADS Integration + Power Features (Target: March)

**Scope:**
- [ ] Add Tier 3 LEADS-aligned buttons
- [ ] Visual LEADS indicator badges on buttons
- [ ] Refinement analytics dashboard (admin view)
- [ ] Custom refinement buttons (user-defined)
- [ ] **Prompt preferences affect refinement button ordering/defaults**
- [ ] **Refinement badges on saved prompt cards**

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
| Profile completion friction? | Use locked buttons to show value; smart detection from first message |
| Refinement from saved prompts? | Yes - add buttons to PromptLibrary, creates new conversation |
| Power user preferences? | Collapsible "Prompt Preferences" in ProfileSettings (Phase 2) |

### Still Open

1. **Undo UX**: Should "Undo" be a button or keyboard shortcut (Cmd+Z)?
2. **Chained refinements**: After refining, should we show different buttons based on what was already applied?
3. **Custom refinements**: How do users create their own refinement buttons? (Phase 3)
4. **Preference auto-apply**: Should preferences auto-apply refinements, or just highlight suggested buttons?

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Adoption | 40%+ of prompts refined at least once | Track `promptRefinements` |
| Satisfaction | Reduced "tedious refinement" complaints | Beta feedback |
| Efficiency | Faster time to "Worked in Classroom" | Compare before/after |
| Popular refinements | Identify top 3 most-used | Analytics dashboard |
| **Profile completion** | 80%+ profiles complete (up from current) | Track `userProfiles` with grade+subject |
| **Locked button clicks** | Track how often locked buttons are clicked | Indicates interest in profile features |
| **Library refinements** | 20%+ of refinements start from library | Track `refineFromLibrary` usage |
| **Smart detection acceptance** | 60%+ accept detected profile data | Track save vs dismiss |

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

---

## Appendix: Pedagogical Design Notes

### Why "Locked Buttons" Beat Traditional Onboarding

Traditional approach (what we had):
```
Sign up → Fill out profile form → Start using app
```

Problems:
- Users don't see value before being asked for data
- Form feels like bureaucracy, not conversation
- High abandonment at profile step

New approach (progressive disclosure via locked buttons):
```
Sign up → Start using app → See locked features → Complete profile to unlock
```

Benefits:
- Users experience the product before committing data
- Locked buttons show *what they're missing*
- Profile completion has immediate, visible payoff
- Aligns with "I do → We do → You do" scaffolded instruction

### Teaching Philosophy Applied to Product

As educators, we know:
1. **Context before content**: Don't front-load information; let users discover needs
2. **Scaffolded release**: Start with universal buttons, reveal advanced features progressively
3. **Immediate feedback**: Profile completion instantly unlocks features (reactive queries)
4. **Multiple entry points**: Smart detection, locked buttons, and ProfileSettings all lead to completion

This plan treats the product itself as a teaching tool—not just for prompt generation, but for onboarding users into the system.
