# Development Roadmap

**Last Updated:** November 21, 2025

---

## 🚀 Current Sprint

### 1. Alignment Scorecard Completion
- **Status:** 🚧 Backend Complete, UI Pending
- **Backend:** ✅ Complete (workflows, mutations, queries)
- **Frontend:** 🚧 Needs UI components + connection to backend
- **Priority:** High

### 2. Unused UI Cleanup
- **Status:** 🚧 Planned
- **Goal:** Remove scope creep components from earlier iterations
- **Tasks:**
  - Identify unused/deprecated components
  - Remove dead code
  - Simplify component tree
- **Priority:** Medium

### 3. LER/LSS Data Structuring + RAG Refinements
- **Status:** 🚧 In Progress
- **Goal:** Structure Louisiana Educator Rubric (LER) and Louisiana Student Standards (LSS) for RAG system
- **Tasks:**
  - Structure LER data for embeddings
  - Align with LSS format
  - Optimize RAG search and retrieval
  - Test accuracy and relevance
- **Priority:** High

---

## 💡 Future Improvements (Post-Manual Testing - Nov 21, 2025)

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

## 🔮 Long-Term Considerations

### Test Suite Refinement
- **When:** After 30+ users
- **Goal:** Refine test coverage based on real-world usage patterns
- **Status:** ⏸️ Deferred

### Community Feature Enhancements
- **Status:** ✅ Available for testing
- **Future:** Enhance based on user feedback

### Analytics Dashboard Expansion
- **Status:** Basic analytics implemented
- **Future:** Add more granular insights as platform scales

---

## 📝 Notes

- This roadmap is a living document and will evolve based on user feedback
- Priority may shift based on actual usage patterns from the small group of Louisiana educators
- All improvements should align with grassroots "We're Not Waiting for LDOE" positioning
- Platform remains platform-agnostic (works with ANY AI tool)

---

*Roadmap reflects continuous improvement mindset - no code changes required for documentation updates*

