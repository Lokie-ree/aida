# Development Roadmap

**Last Updated:** November 26, 2025
**Beta Launch:** December 1, 2025

---

## 🚀 Current Sprint

### 1. Alignment Scorecard Completion
- **Status:** ✅ Complete
- **Backend:** ✅ Complete (workflows, mutations, queries, RAG integration)
- **Frontend:** ✅ Complete (UI components, route, navigation, and E2E tests complete)
- **Rubric Integration:** ✅ Validates content against specific rubric indicators (Standards and Objectives, Presenting Instructional Content, Student Work, Assessment) with performance level feedback
- **Priority:** High
- **Target:** Complete UI before beta launch to showcase core value proposition

### 2. Knowledge Base Cleanup & RAG Optimization
- **Status:** ✅ Knowledge Files Cleaned, Testing Infrastructure Complete
- **Completed:**
  - ✅ Removed HTML artifacts from all knowledge files (`la-science.md`, `la-ela.md`, `la-math.md`, `la-social-studies.md`, `la-cmps.md`, `la-ler-rubric.md`)
  - ✅ Cleaned markdown formatting for optimal RAG retrieval
  - ✅ Consolidated rubric integration details into `knowledge/la-ler-rubric.md` as single source of truth
  - ✅ **Test reorganization:** All test files moved to `convex/tests/` subdirectory (November 26, 2025)
  - ✅ **RAG test suite created:** `convex/tests/ragService.test.ts` with unit tests for RAG search validation
  - ✅ **Manual validation script:** `convex/ragValidation.ts` for testing against real deployments
  - ✅ **Removed unused files:** `convex/standardsScraper.ts` deleted, `populateSampleStandards` and `populateStandardsFromScraper` removed
- **Next Steps:**
  - **Current Focus:** Run manual RAG validation against real deployment
  - Test embedding quality with cleaned knowledge base
  - Validate rubric integration across all features
  - Alignment Scorecard UI completion enables end-to-end RAG testing
- **Priority:** High
- **Impact:** Clean knowledge base ensures accurate, relevant RAG responses for all platform features

### 3. LER/LSS Data Structuring + RAG Refinements
- **Status:** 🚧 In Progress - Testing Infrastructure Complete
- **Goal:** Structure Louisiana Educator Rubric (LER) and Louisiana Student Standards (LSS) for optimal RAG system performance
- **Completed:**
  - ✅ Knowledge base markdown cleanup (all files cleaned)
  - ✅ Rubric integration guide consolidated into `knowledge/la-ler-rubric.md`
  - ✅ **RAG test suite:** Unit tests for RAG search validation, integration tests prepared (require real deployment)
  - ✅ **Manual validation tools:** `convex/ragValidation.ts` ready for testing against real deployments
- **Remaining Tasks:**
  - **Current Focus:** Run manual RAG validation against real deployment with populated data
  - Test accuracy and relevance of embeddings with real standards data
  - Validate rubric indicator mapping across features
  - Ensure all four core features (Weekly Spark, Alignment Scorecard, Delta Generator, Innovation Remix Engine) properly reference rubric indicators
- **Priority:** High
- **Context:** Every feature must be rubric-infused—this is the platform's core differentiator

### 4. Unused UI Cleanup
- **Status:** 🚧 Planned
- **Goal:** Remove scope creep components from earlier iterations
- **Tasks:**
  - Identify unused/deprecated components
  - Remove dead code
  - Simplify component tree
- **Priority:** Medium
- **Timing:** Post-beta launch, based on user feedback

---

## 💡 Future Improvements (Post-Beta Launch - Dec 2025)

### 1. Email Flow Simplification
**Problem:** Users receive multiple emails (Welcome email → Magic Link email after approval). The "Ready to Dive In" email may be redundant.

**Questions to Explore:**
- Is admin dashboard functional for approving access + inviting users by email?
- Can we consolidate to a single, clear email flow?
- Should we remove "Ready to Dive In" and refine the email structure?

**Impact:** Reduces user confusion, simplifies onboarding experience

---

### 2. Beta Signup Data Management
**Problem:** Users can log in to dashboard while still "pending" in `betaSignups` table. Two separate tables managing beta data may be unnecessary.

**Questions to Explore:**
- Do we need 2 separate tables (`users` + `betaSignups`) to manage beta data?
- What happens when platform moves out of beta to full production?
- Is backend simplification warranted now or later?

**Impact:** Simpler architecture, easier to scale post-beta

---

### 3. Onboarding UX Issues
**Problem:** Grade level select items are difficult to see in onboarding modal. After onboarding completion, role is unset and `betaSignup` has unused fields.

**Issues Identified:**
- Poor visibility of grade level select items
- Role data not persisting after onboarding
- Unused fields in `betaSignup` table

**Impact:** Smoother onboarding, better data integrity

---

### 4. Dashboard Personalization + Simplification
**Problem:** Dashboard has too many touchpoints causing cognitive overload at current stage. Could do better job personalizing for each user.

**Opportunities:**
- Simplify dashboard (reduce information density)
- Better personalization based on user role/grade level
- Progressive disclosure (show features as users need them)

**Impact:** Less overwhelming for new users, better engagement

---

## 🔮 Long-Term Vision & Milestones

### Year One: Proof of Concept (Dec 2025 - Spring 2026)
- **Beta Launch:** December 1, 2025 with small group of Louisiana educators
- **Goal:** Gather wealth of user testimonials by end of Spring 2026
- **Focus:** Organic, word-of-mouth growth
- **Key Metrics:** User engagement, feature adoption, testimonial quality
- **Status:** 🚧 In Progress

### Year Two: Organic Expansion (Summer 2026 - 2027)
- **Conference Presentations:**
  - APEL LEADS conference (Louisiana educators)
  - ISTE conference in Orlando (end of Summer 2026)
- **Leverage:** Spring 2026 testimonials for credibility
- **Goal:** Expand reach while maintaining grassroots authenticity
- **Status:** ⏸️ Planned

### Year Three and Beyond: Ecosystem Development
- **Recognition:** Establish as trusted resource for Louisiana educators
- **Growth:** Continue organic expansion based on educator recommendations
- **Innovation:** Enhance features based on accumulated user feedback
- **Status:** 🔮 Future

### Technical Improvements

#### Test Suite Refinement
- **When:** After 30+ users
- **Goal:** Refine test coverage based on real-world usage patterns
- **Status:** ⏸️ Deferred

#### Community Feature Enhancements
- **Status:** ✅ Available for testing
- **Future:** Enhance based on user feedback from beta group

#### Analytics Dashboard Expansion
- **Status:** Basic analytics implemented
- **Future:** Add more granular insights as platform scales
- **Timing:** Post-Spring 2026, based on user growth patterns

---

## 📝 Notes

### Core Principles
- **Rubric-Infused:** Every feature, every interaction, every suggestion is grounded in the Louisiana Educator Rubric—the same framework used in evaluations
- **Platform-Agnostic:** Works with ANY AI tool (ChatGPT, Gemini, MagicSchool AI, Brisk, SchoolAI, etc.)
- **Louisiana-Aligned:** Built specifically for Louisiana state standards and educator rubric
- **Grassroots Growth:** Organic, word-of-mouth expansion starting with small group of committed Louisiana educators

### Roadmap Philosophy
- This roadmap is a living document and will evolve based on user feedback
- Priority may shift based on actual usage patterns from the small group of Louisiana educators
- All improvements should align with grassroots "We're Not Waiting for LDOE" positioning
- Beta launch (December 1, 2025) focuses on core value: rubric-infused, standards-aligned AI guidance

### Key Context
- **Beta Launch Date:** December 1, 2025
- **Target Users:** Small group of Louisiana educators (organic growth)
- **Core Features:** Weekly Spark, Alignment Scorecard, Delta Generator, Innovation Remix Engine
- **Differentiator:** Rubric integration—every feature explicitly references rubric indicators and performance levels

---

*Roadmap reflects continuous improvement mindset - no code changes required for documentation updates*

