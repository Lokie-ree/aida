# AIDA: Saturday Night Task List (Hackathon Sprint)

This is a focused, high-priority list for this evening. The goal is to crush the most critical UI/UX fixes and functional gaps before tomorrow.

## P0: Critical Dashboard Fixes (The "App Feel")

These are the highest impact items that directly affect the demo experience.

### [ ] Tame the Layout Shift

**Action:** Wrap the AI Chat Voice Button in a container with a fixed height (`min-h-[value]`). This will prevent the component expansion from pushing down all other content.

**Verify with Playwright:** Write a quick test to assert that the position of elements below the button does not change during the voice animation.

### [ ] Implement Voice Stop Functionality

**Action:** In the voice interface component, add logic so that a second click on the Voice Orb while it's active calls `vapi.stop()` to end the session immediately.

### [ ] Add Legitimate Demo Data

**Action:** Create a `demo-data.json` file with 3-5 realistic district policy questions and answers.

**Action:** Ingest this data into the RAG pipeline so the demo feels authentic and directly addresses the use case.

### [ ] Fix App Header Width

**Action:** Apply a max-width utility class (e.g., `max-w-7xl`) and `mx-auto` to the main header container to constrain it on larger screens.

## P1: High-Impact UI/UX Polish

These items address the specific visual critiques from your notes.

### [ ] Round the Buttons

**Action:** Update the Tailwind CSS classes on all primary buttons to a higher border-radius (e.g., `rounded-full`) to match the Voice Orb's aesthetic.

### [ ] Refine Voice Prompts

**Action:** Go through the voice interaction flow and replace generic prompts ("Listening...", "Processing...") with more supportive, on-brand messages ("I'm listening...", "Analyzing your lesson plan now...").

### [ ] Fix Onboarding Modal

**Action:** Remove the duplicate/extra "x" close button from the onboarding component.

## P2: Landing Page Quick Wins

Get the marketing page ready for visuals tomorrow.

### [ ] Fix Footer Navigation

**Action:** Add `id` attributes to each major section of the landing page (e.g., `<section id="integrations">`).

**Action:** Update the `href` attributes in the footer links to point to these IDs (e.g., `<a href="#integrations">`).

### [ ] Draft Safety & Privacy Copy

**Action:** Write a short paragraph for the "Integrations" section that clearly explains how user data is handled, explicitly mentioning FERPA compliance and on-device processing where applicable.

## P3: Housekeeping

Final check to ensure the project is in a good state.

### [ ] Verify Foundational Docs

**Action:** Quickly review the Business, Technical, and Design documents to ensure they reflect the current state of the MVP. Make sure they are committed to the repository.