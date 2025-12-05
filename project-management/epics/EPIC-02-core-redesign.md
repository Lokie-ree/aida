# EPIC-02: Core Interface Redesign

**Epic ID:** EPIC-02
**Title:** Core Interface Redesign
**Priority:** P0 - Critical
**Estimated Time:** 2-3 hours
**Sprint:** Sprint 2

---

## Description

Complete overhaul of the coach interface using @prompt-kit components. This includes simplifying routing, redesigning the main PromptCoach component, refactoring ChatInterface with new components, and updating the PromptLibrary for Sheet integration.

## Acceptance Criteria

- [ ] Simplified routing (remove Dashboard, default to /coach)
- [ ] Minimal header (56px height, logo + theme + sign out)
- [ ] Chat interface using @prompt-kit components
- [ ] Library accessible via Sheet (slide-out from right)
- [ ] STEM-focused starter prompts displayed
- [ ] Mobile-responsive design
- [ ] All existing functionality preserved

---

## Tasks

### Task 2.1: Update App.tsx - Simplified Routing
**Time:** 15 minutes
**Status:** [ ] Not Started
**File:** `src/App.tsx`

**Changes:**
- Remove Dashboard route
- Remove Profile route (keep for future)
- Remove CoachActionsContext (if exists)
- Set `/coach` as default authenticated route
- Redirect authenticated users from `/` to `/coach`

**New Route Structure:**
```
/ → Landing page (public)
/coach → Prompt Coach (authenticated, default)
* → Redirect to /
```

**Key Implementation Points:**
```typescript
// Authenticated routes
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
```

### Task 2.2: Redesign PromptCoach.tsx
**Time:** 45 minutes
**Status:** [ ] Not Started
**File:** `src/components/coach/PromptCoach.tsx`

**Changes:**
- Add inline minimal header (56px)
- Remove page-level tabs
- Remove FAB (Floating Action Button)
- Add Sheet for library
- Integrate ChatContainer from @prompt-kit
- Add ScrollButton component

**New Component Structure:**
```
PromptCoach
├── Header (inline, 56px)
│   ├── Logo + Title
│   ├── Theme Toggle
│   └── Sign Out Button
├── Main Content
│   ├── ChatContainer
│   │   ├── ChatInterface
│   │   └── ScrollButton
│   └── Library Trigger Button (fixed position)
└── Sheet (for Library)
    └── PromptLibrary
```

**Key Implementation Points:**
- Header: `h-14 border-b px-4 flex items-center justify-between`
- Main: `flex-1 overflow-hidden relative`
- Library button: `fixed bottom-6 right-6 z-40`
- Sheet: `side="right" className="w-full sm:max-w-lg"`

### Task 2.3: Refactor ChatInterface.tsx with @prompt-kit
**Time:** 60 minutes
**Status:** [ ] Not Started
**File:** `src/components/coach/ChatInterface.tsx`

**@prompt-kit Components to Use:**
- `Message` - Chat message bubbles with avatar support
- `PromptInput` - Auto-resizing input with submit handling
- `PromptSuggestion` - Interactive starter prompts
- `Loader` - Typing indicator for AI thinking
- `Markdown` - Renders AI responses with formatting

**Changes:**
1. Replace custom message components with `<Message>`
2. Replace custom input with `<PromptInput>`
3. Add `<PromptSuggestion>` for STEM starter prompts
4. Add `<Loader variant="typing">` for thinking state
5. Use `<Markdown>` for AI response content

**STEM Starter Prompts (for beta testers):**
1. Curriculum Internalization - Louisiana Science standards
2. Assessment Analysis - LEAP data for Algebra 1
3. Differentiation - IEP students in physics
4. LER Evidence - TKS indicator for LEADS observation

**Props Interface:**
```typescript
interface ChatInterfaceProps {
  conversationId: string | null;
  onStartNew: () => void;
}
```

### Task 2.4: Update PromptLibrary.tsx
**Time:** 15 minutes
**Status:** [ ] Not Started
**File:** `src/components/coach/PromptLibrary.tsx`

**Changes:**
- Add `onClose` prop for Sheet integration
- Update empty state with "Start Coaching Session" button
- Remove redundant navigation elements
- Ensure styling works in Sheet context

**Props Interface:**
```typescript
interface PromptLibraryProps {
  onClose?: () => void;
}
```

### Task 2.5: Clean Up / Archive Old Files
**Time:** 15 minutes
**Status:** [ ] Not Started

**Files to Archive/Delete:**

```bash
# Move to archive (may need later)
mkdir -p src/components/_archived
mv src/components/dashboard src/components/_archived/
mv src/components/shared/Navigation.tsx src/components/_archived/
```

**Files to Keep:**
- `src/components/dashboard/ProfileSettings.tsx` - Move to new location if needed

**Update Imports:**
- Check all files importing from deleted/moved components
- Update or remove imports as needed

---

## Dependencies

- **Depends on:** EPIC-01 (Setup & Infrastructure)
- All @prompt-kit components must be installed

## Technical Notes

### @prompt-kit Component Props

**Message:**
```typescript
<Message
  role="user" | "assistant"
  avatar={<Avatar>...</Avatar>}
  actions={<div>...</div>}
>
  {content}
</Message>
```

**PromptInput:**
```typescript
<PromptInput
  value={string}
  onChange={(e) => setInput(e.target.value)}
  onSubmit={(e) => handleSubmit()}
  placeholder={string}
  disabled={boolean}
/>
```

**PromptSuggestion:**
```typescript
<PromptSuggestion onClick={() => handleClick()}>
  {content}
</PromptSuggestion>
```

**Loader:**
```typescript
<Loader variant="typing" | "dots" | "pulse" />
```

**Markdown:**
```typescript
<Markdown content={string} />
```

---

## Completion Checklist

- [ ] App.tsx routing simplified
- [ ] PromptCoach.tsx redesigned with minimal header
- [ ] ChatInterface.tsx using @prompt-kit components
- [ ] PromptLibrary.tsx updated for Sheet
- [ ] Old files archived
- [ ] All imports updated
- [ ] Build passes (`pnpm lint`)
- [ ] No TypeScript errors
- [ ] Ready for EPIC-03 (Testing)

**Completed:** [ ] Yes / [ ] No
**Completed Date:** ___________
**Notes:**

