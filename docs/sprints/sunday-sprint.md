# A.I.D.A. Hackathon: Master Plan

This is the consolidated, actionable plan for the final days of the hackathon, integrating all feedback and strategic goals. The focus is on moving from core functionality and bug fixing to final polish and submission.

## Day 1: Friday - Foundation & Setup (Completed)

This phase was about establishing the project's technical and strategic groundwork.

- [x] **P0 - Environment & Repository Setup**: Initialize React/Vite project, set up GitHub repo.
- [x] **P0 - Backend Initialization**: Configure Convex project, define initial data schemas (users, documents).
- [x] **P1 - Documentation Framework**: Consolidate 14+ documents into the 5 core guides (master, technical, marketing, team, release).
- [x] **P1 - Initial UI Scaffolding**: Create basic layouts for the landing page and main dashboard.

## Day 2: Saturday - Core Build & Iteration (Completed)

This phase focused on implementing the core MVP features, which also surfaced the key issues to be resolved.

- [x] **P0 - Voice Interface Integration**: Implement Vapi for real-time speech-to-text and text-to-speech.
- [x] **P0 - RAG Pipeline**: Build initial document ingestion with Firecrawl and semantic search via Convex vector search.
- [x] **P1 - Landing Page V1**: Build out sections for hero, features, and tech stack.
- [x] **P1 - Dashboard V1**: Implement the main chat interface and lesson plan upload feature.

## Day 3: Sunday - Polish, Perfect, & Present

This is the final push. The day is structured by priority to ensure a stable, impressive final product.

### P0: Critical Bug Squashing & Stability
*(Must be completed first. A working demo is non-negotiable.)*

- [ ] **Fix Lesson Plan Feedback Failure**
  - **Issue**: The "Failed to generate feedback" toast error is a critical bug.
  - **Action**: Debug the associated Convex function. Check for OpenAI API key errors, invalid prompts, or issues parsing the response. Add robust try...catch logging.

- [ ] **Resolve AIDA Dashboard Layout**
  - **Issue**: The "Welcome" message and the chat controls are overlapping, making the UI unusable.
  - **Action**: Re-structure the dashboard component using Flexbox (flex, justify-between) or CSS Grid to create distinct, non-overlapping containers for the main content and the control panel.

### P1: High-Priority UI/UX Polish
*(These tasks address the specific critiques and will dramatically improve the user experience.)*

- [ ] **Unify Landing Page CTAs & Links**
  - **Issue**: Inconsistent button styles and broken links.
  - **Action**: Apply a single, consistent style to all primary buttons ("Try A.I.D.A. Now", "Get Started"). Make the "Introducing..." banner scroll smoothly to the features section.

- [ ] **Overhaul Mobile Navigation Menu**
  - **Issue**: Redundant links and poor alignment.
  - **Action**: Remove the extra "Get Started" link. Use Flexbox with space-around to evenly distribute the nav items.

- [ ] **Redesign Tech Stack / Integrations Section**
  - **Issue**: Floating icons are unclear and not transparent on how they work.
  - **Action**: Replace the floating icons with a clean, visually appealing grid of technology logos (Vapi, OpenAI, Convex, etc.). This is more professional and informative.

- [ ] **Fix and Clean Footer**
  - **Issue**: Broken links and missing social icons.
  - **Action**: Remove demo-irrelevant links like "Pricing." Add correct href attributes and SVG icons for GitHub and other relevant profiles.

- [ ] **Enhance Dashboard Onboarding**
  - **Issue**: The initial experience feels static.
  - **Action**: Make the onboarding more interactive. Fix the extra "x" button on the modal. Guide the user's first click or voice command.

- [ ] **Refine Voice Experience & Controls**
  - **Issue**: Voice prompts, button styles, and functionality need polish.
  - **Action**:
    - Refine the system prompts sent to Vapi/OpenAI for clearer, more natural voice responses.
    - Add a function to reliably stop an in-progress voice response.
    - Increase the border-radius on dashboard buttons to match the softer aesthetic of the Voice Orb.

- [ ] **Add Demo Data**
  - **Issue**: The app needs realistic content for the demo.
  - **Action**: Pre-load the database with legitimate, sample district documents and user data to make the demonstration feel authentic.

### P2: Strategic Prize Features & Final Submission
*(With a stable app, integrate these high-impact features.)*

- [ ] **Implement "AI Teaching Coach" (OpenAI Prize)**
  - **Action**: Upgrade the lesson feedback feature to use OpenAI's vision model for file uploads. Craft a conversational "coach" persona and stream the response through the voice interface.

- [ ] **Launch "A.I.D.A. Dev Hub" (Inkeep Prize)**
  - **Action**: Embed an Inkeep chat component in a "Project Hub" section of the app, connected to your five core documentation files. This allows judges to query your project's architecture and vision directly.

- [ ] **Final Submission Tasks**
  - **Action**:
    - Update the README file with a project summary, setup instructions, and a link to the live demo.
    - Ensure a LICENSE file is present in the repository.
    - Record a high-quality demo video showcasing the user journey and prize features.
    - Submit the project.
