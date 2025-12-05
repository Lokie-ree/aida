# Sprint 2: Implementation

**Sprint ID:** SPRINT-02
**Duration:** 2-3 hours
**Goal:** Complete all code changes for the coach interface redesign

---

## Sprint Overview

| Attribute | Value |
|-----------|-------|
| Start Date | December 4, 2024 |
| Epic(s) | EPIC-02: Core Interface Redesign |
| Total Tasks | 5 |
| Estimated Time | 2-3 hours |

---

## Sprint Backlog

### High Priority (Must Complete)

#### Task 1: Update App.tsx - Simplified Routing
**Time:** 15 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done
**File:** `src/App.tsx`

**Changes Required:**
1. Remove Dashboard route import and route definition
2. Remove Profile route (keep component for future)
3. Remove CoachActionsContext (if exists)
4. Set `/coach` as default authenticated route
5. Add redirect from `/` to `/coach` for authenticated users

**Key Code:**
```typescript
// Authenticated routes - /coach is the main route
<Route path="/coach" element={
  <Authenticated>
    <PromptCoach />
  </Authenticated>
} />

// Redirect authenticated users from / to /coach
<Route path="/" element={
  <Authenticated>
    <Navigate to="/coach" replace />
  </Authenticated>
} />

// Catch-all redirect
<Route path="*" element={<Navigate to="/" replace />} />
```

**Definition of Done:**
- [ ] Dashboard route removed
- [ ] Profile route removed
- [ ] CoachActionsContext removed (if existed)
- [ ] `/coach` is default for authenticated users
- [ ] Redirects work correctly
- [ ] No TypeScript errors

---

#### Task 2: Redesign PromptCoach.tsx
**Time:** 45 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done
**File:** `src/components/coach/PromptCoach.tsx`

**Changes Required:**
1. Add minimal header (56px height)
   - Logo + "Pelican AI" text
   - AnimatedThemeToggler
   - Sign Out button
2. Remove page-level tabs
3. Remove FAB (if exists)
4. Add Sheet component for Library
5. Integrate ChatContainer from @prompt-kit
6. Add ScrollButton component
7. Add fixed "My Prompts" button (bottom-right)

**Component Structure:**
```
<div className="flex flex-col h-screen bg-background">
  {/* Header - 56px */}
  <header className="h-14 border-b px-4 flex items-center justify-between">
    {/* Left: Logo + Title */}
    {/* Right: Theme Toggle + Sign Out */}
  </header>
  
  {/* Main Content */}
  <main className="flex-1 overflow-hidden relative">
    <ChatContainer>
      <ChatInterface />
      <ScrollButton />
    </ChatContainer>
    
    {/* Library Trigger - Fixed Position */}
    <motion.div className="fixed bottom-6 right-6 z-40">
      <Sheet>
        <SheetTrigger>My Prompts</SheetTrigger>
        <SheetContent>
          <PromptLibrary />
        </SheetContent>
      </Sheet>
    </motion.div>
  </main>
</div>
```

**Definition of Done:**
- [ ] Minimal header implemented (56px)
- [ ] Tabs removed
- [ ] FAB removed
- [ ] Sheet for Library integrated
- [ ] ChatContainer wrapping chat interface
- [ ] ScrollButton added
- [ ] "My Prompts" button positioned correctly
- [ ] No TypeScript errors

---

#### Task 3: Refactor ChatInterface.tsx with @prompt-kit
**Time:** 60 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done
**File:** `src/components/coach/ChatInterface.tsx`

**@prompt-kit Components to Import:**
```typescript
import { Message } from "@/components/ui/message";
import { PromptInput } from "@/components/ui/prompt-input";
import { PromptSuggestion } from "@/components/ui/prompt-suggestion";
import { Loader } from "@/components/ui/loader";
import { Markdown } from "@/components/ui/markdown";
```

**Changes Required:**

**1. Props Interface:**
```typescript
interface ChatInterfaceProps {
  conversationId: string | null;
  onStartNew: () => void;
}
```

**2. STEM Starter Prompts:**
```typescript
const starterPrompts = [
  {
    icon: FlaskConical,
    text: "Help me internalize Louisiana Science standards for my 8th grade unit on chemical reactions",
    category: "Curriculum Internalization"
  },
  {
    icon: GraduationCap,
    text: "I need to analyze LEAP assessment data for my Algebra 1 class and identify learning gaps",
    category: "Assessment Analysis"
  },
  {
    icon: Lightbulb,
    text: "Generate a differentiated lesson plan for IEP students in my physics class",
    category: "Differentiation"
  },
  {
    icon: Sparkles,
    text: "Collect evidence for TKS (Teacher Knowledge of Students) indicator for my LEADS observation",
    category: "LER Evidence"
  }
];
```

**3. Empty State (no messages):**
- Bot icon with animation
- Welcome message
- PromptSuggestion grid for starter prompts

**4. Message Rendering:**
```typescript
<Message
  role={msg.role}
  avatar={<Avatar>...</Avatar>}
>
  {msg.role === "assistant" ? (
    <Markdown content={msg.content} />
  ) : (
    <p>{msg.content}</p>
  )}
</Message>
```

**5. Loading State:**
```typescript
{isLoading && (
  <div className="flex items-center gap-2">
    <Loader variant="typing" />
    <span>Thinking...</span>
  </div>
)}
```

**6. Input Area:**
```typescript
<PromptInput
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onSubmit={(e) => {
    e.preventDefault();
    handleSubmit(input);
  }}
  placeholder="Describe what you're teaching..."
  disabled={isLoading}
/>
```

**Definition of Done:**
- [ ] @prompt-kit imports added
- [ ] Props interface updated
- [ ] STEM starter prompts defined
- [ ] Empty state with PromptSuggestion
- [ ] Message component for chat bubbles
- [ ] Markdown rendering for AI responses
- [ ] Loader for thinking indicator
- [ ] PromptInput for message input
- [ ] Auto-scroll to bottom
- [ ] "Start New Conversation" button
- [ ] No TypeScript errors

---

#### Task 4: Update PromptLibrary.tsx
**Time:** 15 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done
**File:** `src/components/coach/PromptLibrary.tsx`

**Changes Required:**
1. Add `onClose` prop to interface
2. Update empty state with "Start Coaching Session" button
3. Ensure styling works in Sheet context
4. Remove any redundant navigation elements

**Props Interface:**
```typescript
interface PromptLibraryProps {
  onClose?: () => void;
}
```

**Empty State Update:**
```typescript
if (!savedPrompts || savedPrompts.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
      <p className="text-muted-foreground">
        No saved prompts yet. Generate your first Louisiana-aligned prompt!
      </p>
      {onClose && (
        <Button onClick={onClose}>
          Start Coaching Session
        </Button>
      )}
    </div>
  );
}
```

**Definition of Done:**
- [ ] `onClose` prop added
- [ ] Empty state updated with CTA button
- [ ] Styling works in Sheet context
- [ ] Copy/delete functionality preserved
- [ ] No TypeScript errors

---

#### Task 5: Clean Up / Archive Old Files
**Time:** 15 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done

**Files to Archive:**
```bash
mkdir -p src/components/_archived

# Dashboard components
mv src/components/dashboard src/components/_archived/dashboard

# Old navigation (if exists)
mv src/components/shared/Navigation.tsx src/components/_archived/Navigation.tsx
```

**Import Cleanup:**
- [ ] Check `App.tsx` for removed imports
- [ ] Check any components importing Dashboard
- [ ] Check any components importing Navigation
- [ ] Remove or update all affected imports

**Files to Keep:**
- `ProfileSettings.tsx` - Save for future profile feature

**Definition of Done:**
- [ ] Dashboard folder archived
- [ ] Navigation.tsx archived (if existed)
- [ ] All imports updated/removed
- [ ] No broken imports
- [ ] Build passes

---

## End-of-Sprint Verification

```bash
# Run after all tasks complete
pnpm lint
```

**Expected:** No TypeScript errors, clean build

---

## Sprint Notes

### Blockers Encountered
| Blocker | Resolution | Status |
|---------|------------|--------|
| | | |

### Technical Decisions
| Decision | Rationale |
|----------|-----------|
| | |

### Code Review Notes
| File | Notes |
|------|-------|
| App.tsx | |
| PromptCoach.tsx | |
| ChatInterface.tsx | |
| PromptLibrary.tsx | |

---

## Sprint Retrospective

**What went well:**
- 

**What could be improved:**
- 

**Carry-over items:**
- 

---

## Completion Summary

| Metric | Value |
|--------|-------|
| Tasks Completed | /5 |
| Actual Time | hours |
| Variance | hours |
| TypeScript Errors | 0 |

**Sprint Status:** [ ] Complete / [ ] Incomplete

**Signed Off By:** ___________
**Date:** ___________

