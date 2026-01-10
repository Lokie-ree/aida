# Quick Refinement Buttons: Feature Proposal

## Overview

Quick Refinement Buttons provide one-click prompt modifications that eliminate the friction of manually re-typing refinement requests. Instead of users needing to know the "correct verbiage" to refine a prompt, Pelican AI surfaces contextually appropriate refinement options after each generated prompt.

**Core Filter Alignment:** This feature directly helps Louisiana teachers get better, more aligned prompts faster by:
- Reducing the cognitive load of knowing what to ask for
- Embedding LEADS-aligned refinement options into the natural workflow
- Transforming the "tedious refinement" experience into guided coaching

**Evaluation Score:** 23/25 (Priority)

---

## User Problem

From beta feedback:
> "refining prompts is tedious"
> "Having to use the correct verbiage to understand what I am trying to get out of it"

Teachers know the generated prompt isn't quite right, but they don't always know how to articulate what would make it better. The coaching layer should anticipate common refinement needs and offer them proactively.

---

## Proposed Refinement Buttons

### Tier 1: Universal Refinements
These appear after every generated prompt.

| Button | Prompt Modifier | Rationale |
|--------|-----------------|-----------|
| **Make it shorter** | "Condense this prompt to focus only on the essential elements. Remove any redundant instructions." | Most common refinement need; teachers are busy |
| **Make it more detailed** | "Expand this prompt with more specific instructions, examples, and scaffolding." | Opposite use case; some contexts need depth |
| **Simplify the language** | "Rewrite this prompt using simpler vocabulary and shorter sentences, appropriate for students who struggle with complex text." | Differentiation for struggling readers / ELL |
| **Add differentiation** | "Modify this prompt to include scaffolds for struggling learners, extensions for advanced learners, and accommodations for students with IEPs." | Direct LEADS alignment (Indicator 2c) |

### Tier 2: Context-Aware Refinements
These appear based on the prompt type or teaching context gathered during intake.

| Button | Appears When | Prompt Modifier |
|--------|--------------|-----------------|
| **Align to standard** | User hasn't specified a Louisiana standard | "Explicitly align this prompt to Louisiana Student Standards for [subject/grade]. Include the standard code and ensure the task directly addresses the standard's requirements." |
| **Add student choice** | Lesson planning prompts | "Incorporate options for student choice in how they demonstrate learning, while maintaining alignment to the learning objective." |
| **Include exit ticket** | Lesson planning prompts | "Add a brief formative assessment or exit ticket that checks for understanding of the key concept." |
| **Add rubric criteria** | Assessment prompts | "Include clear, measurable rubric criteria with performance level descriptions." |
| **Make it SPED-friendly** | User indicated SPED context | "Adapt this prompt to generate materials appropriate for students with IEPs, including simplified language, chunked information, and built-in supports." |
| **Add teacher talking points** | Lesson planning prompts | "Include suggested teacher language for introducing the activity, checking for understanding, and summarizing key takeaways." |

### Tier 3: LEADS-Aligned Refinements
These directly connect to Louisiana Educator Rubric indicators.

| Button | LEADS Connection | Prompt Modifier |
|--------|------------------|-----------------|
| **Increase rigor** | Domain 2: Instruction (2b) | "Elevate the cognitive demand of this task. Ensure students are required to analyze, evaluate, or create rather than just recall or apply." |
| **Add questioning strategies** | Domain 2: Instruction (2a) | "Include higher-order questioning strategies that promote student thinking, discussion, and deeper understanding." |
| **Build in student engagement** | Domain 2: Instruction (2d) | "Incorporate active learning strategies that require all students to participate, think, and respond." |
| **Connect to prior learning** | Domain 1: Planning (1c) | "Add explicit connections to prior knowledge and previously taught concepts." |

---

## UI/UX Specifications

### Placement
Refinement buttons appear immediately below the generated prompt output, before the copy/save actions.

```
┌─────────────────────────────────────────────────────┐
│  Generated Prompt                                   │
│  ─────────────────────────────────────────────────  │
│  [Full prompt text here...]                         │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Refine this prompt:                                │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐  │
│  │ Make shorter │ │ Add details  │ │ Simplify    │  │
│  └──────────────┘ └──────────────┘ └─────────────┘  │
│  ┌──────────────────┐ ┌────────────────────────┐    │
│  │ Add differentiation │ │ Align to standard   │    │
│  └──────────────────┘ └────────────────────────┘    │
├─────────────────────────────────────────────────────┤
│  [Copy to Clipboard]  [Save Prompt]  [Start Over]   │
└─────────────────────────────────────────────────────┘
```

### Interaction Flow

1. User completes conversational intake
2. Pelican generates initial prompt
3. Refinement buttons appear (Tier 1 always visible; Tier 2/3 based on context)
4. User clicks a refinement button
5. Pelican regenerates the prompt with the modifier applied
6. New refinement buttons appear (user can chain refinements)
7. User copies/saves when satisfied

### Visual Design Principles

- Buttons should feel lightweight, not overwhelming
- Use pill/chip style rather than heavy buttons
- Limit visible buttons to 5-6 maximum; overflow into "More refinements..." expandable
- Subtle icons can accompany labels (optional)
- Hover states should preview what the refinement does

### Mobile Considerations

- Buttons should wrap naturally on narrow screens
- Touch targets minimum 44px
- Consider horizontal scroll for button row on mobile

---

## Technical Implementation Notes

### Stack Context
- React 19 with TypeScript
- Convex serverless backend
- Existing conversational intake flow

### Data Model Considerations

```typescript
// Refinement button definition
interface RefinementButton {
  id: string;
  label: string;
  promptModifier: string;
  tier: 'universal' | 'contextual' | 'leads';
  showWhen?: (context: ConversationContext) => boolean;
  leadsIndicator?: string; // e.g., "2c", "2b"
}

// Track which refinements users apply (for future analytics)
interface PromptRefinement {
  promptId: string;
  refinementId: string;
  appliedAt: timestamp;
}
```

### Context-Aware Button Logic

The `showWhen` function evaluates the conversation context to determine which Tier 2/3 buttons to display:

```typescript
// Example: Show "Make it SPED-friendly" when user indicated SPED context
{
  id: 'sped-friendly',
  label: 'Make it SPED-friendly',
  promptModifier: '...',
  tier: 'contextual',
  showWhen: (ctx) => ctx.teachingContext.includes('special-education')
}
```

### Refinement Chaining

Users should be able to apply multiple refinements sequentially. The system should:
1. Maintain the full prompt history (original → refinement 1 → refinement 2)
2. Allow "undo" to previous version
3. Show which refinements have been applied (visual indicator on used buttons)

### API Considerations

Refinements can use the same prompt generation endpoint with the modifier appended:

```typescript
async function applyRefinement(
  originalPrompt: string, 
  refinement: RefinementButton,
  context: ConversationContext
): Promise<string> {
  return generatePrompt({
    basePrompt: originalPrompt,
    additionalInstructions: refinement.promptModifier,
    context
  });
}
```

---

## LEADS Alignment Mapping

This feature supports multiple LEADS domains:

| LEADS Domain | Indicator | How This Feature Helps |
|--------------|-----------|------------------------|
| Domain 1: Planning | 1a, 1c | Standards alignment button ensures prompts connect to Louisiana standards |
| Domain 2: Instruction | 2a, 2b, 2c, 2d | Rigor, questioning, differentiation, and engagement buttons |
| Domain 4: Professionalism | 4a | Supports teacher reflection and continuous improvement of practice |

---

## Acceptance Criteria

### Must Have (MVP)
- [ ] Tier 1 universal buttons appear after every generated prompt
- [ ] Clicking a button regenerates the prompt with the refinement applied
- [ ] User can chain multiple refinements
- [ ] Refinement buttons are visually distinct from primary actions (copy/save)
- [ ] Mobile-responsive layout

### Should Have (Full Release)
- [ ] At least 3 Tier 2 context-aware buttons implemented
- [ ] Visual indicator showing which refinements have been applied
- [ ] "Undo" returns to previous prompt version
- [ ] Refinement usage tracked for future analytics

### Could Have (Future)
- [ ] Custom refinement buttons (user-defined)
- [ ] Refinement suggestions based on user's past patterns
- [ ] LEADS indicator badges on relevant buttons

---

## Success Metrics

After launch, validate with beta testers:

1. **Adoption:** What % of prompt generations include at least one refinement?
2. **Satisfaction:** Does this reduce the "tedious refinement" feedback?
3. **Efficiency:** Are users reaching "Worked in Classroom" status faster?
4. **LEADS Alignment:** Which LEADS-connected buttons get the most use?

---

## Implementation Phases

### Phase 1: MVP (Target: End of January)
- Implement Tier 1 universal buttons only
- Basic regeneration flow
- No context-awareness yet

### Phase 2: Context-Aware (February)
- Add Tier 2 buttons based on teaching context
- Implement `showWhen` logic
- Add refinement chaining with undo

### Phase 3: LEADS Integration (March)
- Add Tier 3 LEADS-aligned buttons
- Visual LEADS indicator badges
- Refinement analytics

---

## Open Questions

1. **Button limit:** How many buttons are too many? Should we A/B test 4 vs 6 visible buttons?
2. **Regeneration speed:** Will users tolerate a regeneration delay, or do we need optimistic UI?
3. **Customization:** Should power users be able to create their own refinement buttons?
4. **Prompt history:** How long do we retain the refinement chain for a given prompt?

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