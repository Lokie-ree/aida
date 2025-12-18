# Chat Interface Cleanup Design

## Problem

The current chat interface has visual clutter from multiple competing elements:
- Conversation history cards embedded in the chat view
- Inconsistent mobile menu layout in the Account section
- Too many elements fighting for attention

## Solution Overview

1. Remove conversation history from ChatInterface
2. Add "Recent Sessions" section to the mobile menu
3. Clean up mobile menu Account section with footer theme toggle
4. Simplify desktop welcome state with text links

---

## Design Details

### 1. ChatInterface Cleanup

**Remove:**
- `renderConversationHistory()` function and all calls
- "Past coaching sessions" horizontal scroll cards (mobile)
- Vertical session list (desktop)

**Keep:**
- Welcome message (empty state) or Phase header (active conversation)
- Messages area (gains vertical space)
- Input area with tips

**Result:**
```
┌─────────────────────────┐
│ [Phase: In Conversation]│  ← Only shows when active
├─────────────────────────┤
│                         │
│   Messages Area         │
│   (full height now)     │
│                         │
├─────────────────────────┤
│ [Input] [Send]          │
│ Tip: Press Enter...     │
└─────────────────────────┘
```

### 2. Mobile Menu: Recent Sessions Section

Add new section between Navigation and Account actions:

```
┌─────────────────────────────┐
│ Menu                    [X] │
├─────────────────────────────┤
│ NAVIGATION                  │
│ ┌─────────────────────────┐ │
│ │ Coach               ✓   │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ My Prompts          (3) │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ New Session             │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ RECENT SESSIONS             │
│ ┌─────────────────────────┐ │
│ │ RL.5.3 character traits │ │
│ │ 2 hours ago             │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Math fractions lesson   │ │
│ │ Yesterday               │ │
│ └─────────────────────────┘ │
│         (max 5 shown)       │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Profile                 │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Sign Out                │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│        [Theme Toggle]       │  ← Footer element
└─────────────────────────────┘
```

**Behavior:**
- Show max 5 most recent sessions
- Tapping session closes menu and loads conversation
- Active session gets highlighted styling
- Section only appears when user has history

### 3. Account Section Cleanup

**Changes:**
- Remove "ACCOUNT" section header
- Profile and Sign Out as consistent ghost buttons
- Theme toggle moves to bottom as standalone footer element
- Centered toggle with subtle top border separator

### 4. Desktop Welcome State

Keep desktop header unchanged. Simplify welcome state:

```
┌─────────────────────────────────────┐
│                                     │
│         What are you teaching?      │
│    I'll help craft a prompt...      │
│                                     │
│    ─────── or continue ───────      │
│    RL.5.3 traits • Math fractions   │  ← Simple text links
│                                     │
│  [____________________________] [→] │
└─────────────────────────────────────┘
```

- No heavy card UI
- Recent sessions as subtle inline text links
- Clean, focused entry point

---

## Files to Modify

1. `src/components/coach/ChatInterface.tsx`
   - Remove `renderConversationHistory()` and calls
   - Update empty state to show simple text links for sessions

2. `src/components/navigation/MobileMenu.tsx`
   - Add Recent Sessions section
   - Remove "ACCOUNT" header
   - Move theme toggle to footer position
   - Fix spacing consistency

3. `src/components/coach/PromptCoach.tsx`
   - Pass conversations data to MobileMenu via navConfig
   - Add session selection handler for menu

---

# Phase 2: Conversation Titles + Save-on-Copy

## Problem 1: Conversation Titles + Management

### Auto-Generated Titles

**Current issue:** All conversations default to "New Coaching Session" — indistinguishable.

**Solution:** Generate meaningful titles from user's first message.

**Title extraction logic:**
1. Look for Louisiana standard codes (e.g., "RL.5.3" → "RL.5.3 Character Traits")
2. Look for grade + subject keywords (e.g., "5th grade fractions" → "5th Grade Fractions")
3. Fallback: First 40 characters of message, cleaned up

**Implementation:**
- Update `startConversation` mutation or `sendMessage` action
- On first user message, generate title and update conversation
- Title updates happen server-side, no user friction

### Rename/Delete Sessions

**Solution:** Add kebab menu (⋮) to session rows in mobile menu.

**UI:**
```
┌─────────────────────────────────┐
│ RL.5.3 character traits    [⋮] │
│ 2 hours ago                     │
└─────────────────────────────────┘
         ↓ tap ⋮
┌─────────────────────────────────┐
│ ✏️ Rename                        │
│ 🗑️ Delete                        │
└─────────────────────────────────┘
```

**Behavior:**
- Rename: Opens small dialog with text input, pre-filled with current title
- Delete: Confirms with dialog, then removes conversation

---

## Problem 2: Save-on-Copy

### Current Issue

Users generate high-quality prompts, copy them, and leave. The save action is optional friction after they've already gotten value. My Prompts library stays empty.

### Solution: Auto-Save on Copy

**New flow:**
```
Chat → Get prompt → Copy → Auto-saved to library
                           ↳ Toast: "Copied! Saved to My Prompts"
```

**Metadata inference:**
- `grade`: From user profile (fallback: infer from conversation)
- `subject`: From user profile (fallback: infer from conversation)
- `topic`: Extract from conversation context (standard code, keywords from first message)

**UI Changes:**

Remove:
- Save button (💾) from assistant messages
- Save dialog entirely

Keep:
- Copy button (📋) — now triggers save
- Thumbs up/down ratings — attach to saved prompt
- Delete from library for cleanup

**Toast behavior:**
```
┌──────────────────────────────────────┐
│ ✓ Copied! Saved to My Prompts        │
└──────────────────────────────────────┘
```

Simple confirmation, no actions needed.

---

## Files to Modify (Phase 2)

1. `convex/promptCoach.ts`
   - Add `generateConversationTitle()` helper function
   - Update `sendMessage` to generate title on first message
   - Add `renameConversation` mutation
   - Add `deleteConversation` mutation
   - Update `savePrompt` to accept inferred metadata

2. `src/components/coach/ChatInterface.tsx`
   - Remove Save button from assistant messages
   - Remove save dialog and related state
   - Update Copy handler to call save mutation
   - Update toast message

3. `src/components/navigation/MobileMenu.tsx`
   - Add kebab menu to session rows
   - Add rename/delete dropdown or popover
   - Wire up rename dialog
   - Wire up delete confirmation

4. `src/components/coach/PromptCoach.tsx`
   - Add handlers for rename/delete
   - Pass handlers to navConfig
