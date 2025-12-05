---
name: Email Simplification & Refinement Plan
overview: ""
todos: []
---

# Email Simplification & Refinement Plan

**Objective:** Align all email correspondence with the minimal, clean aesthetic of the Pelican AI landing page and coach interface (`shadcn/ui` style), ensuring consistent branding and a professional "teacher-to-teacher" tone.

## 1. Aesthetic Alignment (Base Template)

We will overhaul `src/emails/BaseEmailTemplate.tsx` to match the application's design system found in `src/index.css` and `tailwind.config.js`.

- **Color Palette Update:**
- **Primary:** Change from `#0ea5e9` (Sky-500) to `#0284c7` (Pelican Blue) to match app primary.
- **Headers:** Keep `#1e40af` (Deep Blue) as it matches `var(--deep-blue)`.
- **Background:** Change `#f6f9fc` to `#ffffff` or a very subtle gray (`#f8fafc`) to match the clean app background.
- **Text:** Use `#374151` (Gray-700) for body text for readability.

- **Component Refactoring:**
- **Remove:** `InfoBox`, `HighlightBox`, `ActionBox` (too heavy/marketing-like).
- **Add:** `Card` component.
  - Style: White background, 1px solid `#e2e8f0` (border), `8px` radius, `24px` padding.
  - Usage: For highlighting actions, frameworks, or key information.
- **Footer:** Simplify to match Landing Page footer ("Created with 💙 by educators for educators").

- **Typography:**
- Ensure headings use `Poppins` and body uses `Lexend` (consistent with app).

## 2. Content Refinement (Specific Emails)

We will refactor each email to use the new `Card` component and simplified layout.

### `src/emails/BetaWelcomeEmail.tsx`

- **Simplification:**
- Replace the "Immediate Action Box" with a clean `Card` titled "Try This Now".
- Replace "What Happens Next" `InfoBox` with a simple numbered list under a heading.
- Replace "What You're Getting" `HighlightBox` with a simple bulleted list.
- **Tone:** Keep the authentic "Grassroots" text but present it with less visual noise.

### `src/emails/WeeklyPromptEmail.tsx`

- **Simplification:**
- Update "Framework Card" to use the new `Card` component style.
- Remove the colored badges if they look too busy; use simple text labels or subtle gray badges.
- Ensure the prompt text box uses a monospace font and a subtle gray background (`#f8fafc`) instead of a heavy border.

### `src/emails/PlatformAccessEmail.tsx` (and others)

- **Simplification:**
- Ensure the "Login Button" is the primary visual element.
- Wrap login credentials/instructions in a clean `Card` if necessary.

### `src/emails/OutreachEmail.tsx`

- **Simplification:**
- Convert the three value proposition boxes into a single list or grid within the main content flow.
- Focus on the personal message from "The Pelican AI Team".

## 3. Implementation Steps

1.  **Update `src/emails/BaseEmailTemplate.tsx`**:

  - Define new color constants matching `tailwind.config.js`.
  - Create the `Card` styled component.
  - Remove old box components.
  - Update Footer.

2.  **Refactor `BetaWelcomeEmail.tsx`**:

  - Remove imports of old boxes.
  - Implement new structure using `Card` and clean lists.

3.  **Refactor `WeeklyPromptEmail.tsx`**:

  - Update framework display to use `Card`.

4.  **Refactor remaining emails**:

  - `PlatformAccessEmail.tsx`, `OutreachEmail.tsx`, `FollowupEmail.tsx`, `NetworkPartnerEmail.tsx`.
  - Apply the same minimal principles.

5.  **Verification**:

  - Verify that all emails build and render correctly (using preview mode if available or manual review of code structure).