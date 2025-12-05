# EPIC-01: Setup & Infrastructure

**Epic ID:** EPIC-01
**Title:** Setup & Infrastructure
**Priority:** P0 - Critical
**Estimated Time:** 30 minutes
**Sprint:** Sprint 1

---

## Description

Prepare the development environment for the coach interface redesign. This includes creating feature branches, backing up current implementation, and installing all required @prompt-kit components.

## Acceptance Criteria

- [ ] Feature branch created and checked out
- [ ] Current coach components backed up to archive folder
- [ ] All @prompt-kit components installed successfully
- [ ] Existing shadcn/ui components verified
- [ ] No TypeScript errors after installation

---

## Tasks

### Task 1.1: Create Feature Branch
**Time:** 2 minutes
**Status:** [ ] Not Started

```bash
git checkout -b feature/coach-redesign-prompt-kit
```

### Task 1.2: Backup Current Implementation
**Time:** 3 minutes
**Status:** [ ] Not Started

```bash
# Create archive folder
mkdir -p src/components/_archived/coach-v1

# Copy current coach components
cp -r src/components/coach/* src/components/_archived/coach-v1/
```

**Files to backup:**
- `src/components/coach/PromptCoach.tsx`
- `src/components/coach/ChatInterface.tsx`
- `src/components/coach/PromptLibrary.tsx`
- Any other files in `src/components/coach/`

### Task 1.3: Install @prompt-kit Components (Core)
**Time:** 15 minutes
**Status:** [ ] Not Started

**Required components:**
```bash
# Core chat components
npx shadcn@latest add @prompt-kit/chat-container
npx shadcn@latest add @prompt-kit/message
npx shadcn@latest add @prompt-kit/prompt-input
npx shadcn@latest add @prompt-kit/markdown

# Empty state and interactions
npx shadcn@latest add @prompt-kit/prompt-suggestion
npx shadcn@latest add @prompt-kit/loader

# Utilities
npx shadcn@latest add @prompt-kit/scroll-button
```

**Note:** If registry format differs, check prompt-kit documentation for exact installation commands.

### Task 1.4: Verify Existing shadcn Components
**Time:** 5 minutes
**Status:** [ ] Not Started

**Verify these exist in `src/components/ui/`:**
- [ ] `sheet.tsx` - For library slide-out
- [ ] `button.tsx` - For actions
- [ ] `card.tsx` - For prompt cards in library
- [ ] `avatar.tsx` - For user/AI avatars in chat
- [ ] `scroll-area.tsx` - For scrollable areas
- [ ] `badge.tsx` - For metadata tags

### Task 1.5: Verify Build
**Time:** 5 minutes
**Status:** [ ] Not Started

```bash
pnpm lint
```

---

## Dependencies

- None (first epic to execute)

## Blockers

- Registry access for @prompt-kit components
- Node.js/pnpm environment setup

## Notes

- Keep backup of current implementation in case rollback needed
- If @prompt-kit installation fails, check for alternative installation methods
- Document any installation issues for future reference

---

## Completion Checklist

- [ ] Feature branch created
- [ ] Backup completed
- [ ] All 7 @prompt-kit components installed
- [ ] Existing components verified
- [ ] Build passes with no errors
- [ ] Ready for EPIC-02

**Completed:** [ ] Yes / [ ] No
**Completed Date:** ___________
**Notes:** 

