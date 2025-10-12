# Framework Strategy Update

## Strategic Decision: Replace AIB-001

**Date:** October 12, 2025  
**Status:** Implemented

---

## The Change

**Original Plan:**
- AIB-001: Parent Communication Framework (for all educators)
- AIB-002, AIB-003, AIB-004: District-specific frameworks

**Updated Plan:**
- **AIB-001: Lesson Objective Unpacker & Success Criteria Builder** (NEW - for all educators)
- AIB-002, AIB-003, AIB-004: District-specific frameworks (unchanged)
- Parent Communication Framework: Deferred to Phase 2

---

## Rationale

### Why Replace Parent Communication?

**Limited Universal Value:**
- Not all teachers write frequent parent emails
- Some teachers write 1-2 emails per month vs. teachers planning 5-10 lessons daily
- Use case is narrow: primarily behavioral/academic concerns, conference requests

**Misaligned with Core Value Proposition:**
- We're positioning Pelican AI as **academic rigor and planning support**
- Parent communication is administrative/logistical, not instructional
- Doesn't build foundational skills needed for subsequent frameworks

**Poor Entry Point:**
- Doesn't ease teachers into the more complex frameworks
- No skill progression from emails → curriculum planning
- Creates cognitive disconnect between Week 1 and Week 2

### Why Choose Lesson Objective Unpacker?

**Universal Daily Value:**
- EVERY teacher works with objectives/standards every single day
- Applicable across all content areas, grade levels, and districts
- Provides immediate classroom impact (success criteria students can use)

**Foundational Skill Building:**
- Teaches objective breakdown → used in AIB-002 (pacing) and AIB-003 (data analysis)
- Teaches misconception prediction → used in all 3 subsequent frameworks
- Teaches success criteria creation → referenced in AIB-004 (internalization)
- Creates natural progression of AI-assisted planning skills

**Perfect Entry Point:**
- Simple enough for AI beginners (one objective, clear outputs)
- High success rate (hard to "mess up" - just needs review)
- Immediately applicable (can use it tomorrow morning for any lesson)
- Builds confidence before tackling more complex frameworks

**Alignment with Academic Rigor:**
- Directly addresses instructional planning and student clarity
- Supports Louisiana Educator Rubric Domain 1 (Planning & Preparation)
- Demonstrates immediate ROI on instructional quality, not just time savings

---

## Framework Progression (New Strategy)

### Week 1: Foundation (AIB-001)
**Skill:** Breaking down objectives into component parts, predicting misconceptions, creating success criteria

**Why Start Here:**
- Teaches fundamental "unpacking" skill that all other frameworks require
- Every teacher can use it immediately regardless of district system
- Success builds confidence: "If I can do this, I can do more complex planning with AI"

### Week 2: Application to Pacing (AIB-002)
**Skill:** Applying Week 1 "unpacking" to weekly curriculum review

**Progression:**
- Week 1: Unpack ONE objective for ONE lesson
- Week 2: Unpack MULTIPLE objectives across a WEEK of lessons
- Same core skill, expanded timeframe

### Week 3: Application to Data Analysis (AIB-003)
**Skill:** Using component sub-skill analysis to diagnose assessment gaps

**Progression:**
- Week 1: Break objective into sub-skills for planning
- Week 3: Break objective into sub-skills to diagnose which students missed
- Same core skill, new context (post-assessment vs. pre-planning)

### Week 4: Application to Collaboration (AIB-004)
**Skill:** Facilitating group discussions about "ideal responses" and scaffolds

**Progression:**
- Week 1: Define ideal response and scaffold for YOUR lesson
- Week 4: Guide your TEAM to define ideal responses and scaffolds together
- Same core skill, collaborative context

---

## Impact on Beta Launch

### Messaging Changes Needed:

**Welcome Email:**
- ❌ OLD: "I'll help you write professional parent emails in 5 minutes..."
- ✅ NEW: "I'll help you unpack lesson objectives and create student-friendly success criteria in 3 minutes..."

**Value Proposition:**
- ❌ OLD: "Save 3-5 hours/week on parent communication and planning"
- ✅ NEW: "Save 3-5 hours/week on lesson planning and build skills that compound across the month"

**"Try This Right Now" CTA:**
- ❌ OLD: "Draft your next parent email"
- ✅ NEW: "Unpack tomorrow's lesson objective and create success criteria your students can actually use"

### Beta Welcome Kit Updates:

**Week 1 Content:**
- Framework: Lesson Objective Unpacker
- Focus: "This week, practice unpacking 3-5 different lesson objectives across different subjects"
- Success Metric: "Can you create student-friendly success criteria in under 5 minutes?"

**Looking Ahead Section:**
- "Next week, we'll apply this skill to weekly curriculum pacing..."
- "Week 3: Use the same component breakdown for data analysis..."
- "Week 4: Facilitate collaborative planning using these techniques..."

---

## Parent Communication Framework: Future Deployment

**Status:** Complete but deferred  
**File:** `AIB-001-parent-communication-framework.md` (will be renumbered)

### When to Deploy:

**Timing Options:**
1. **Phase 2 (After 4-week beta):** "Now that you're comfortable with AI for planning, let's extend it to communication"
2. **Conference Season (October-November):** Deploy as timely resource when parent communication peaks
3. **On-Demand:** Offer in resource library for teachers who specifically request it
4. **Teacher-Teacher Conference Support:** Bundle with report card comment generator

### Positioning Strategy:

**Context Setting:**
"You've been using AI to strengthen your instruction. Now let's make your parent communication just as efficient and professional..."

**Bundling Opportunity:**
- Parent Communication Framework
- Report Card Comment Assistant
- Conference Prep Notes Generator
- **Package as:** "Communication Toolkit" (separate from core planning tools)

### Value Retention:

The framework is excellent and well-crafted. We're not abandoning it—we're strategically timing its release for:
- Better audience fit (teachers already comfortable with AI)
- Seasonal relevance (conference season)
- Clear positioning (communication support, not planning support)

---

## Success Metrics (Updated)

### Week 1 (AIB-001 - Lesson Objective Unpacker):
- **Target:** 80% of beta testers use the framework at least once
- **Measure:** Post-Framework Survey completion rate
- **Quality Check:** "Success criteria were truly student-friendly" (4+ rating)
- **Time Savings:** Average 7-10 minutes saved per lesson planned

### Week 2-4 (AIB-002, AIB-003, AIB-004):
- **Target:** 60% of district partners use subsequent frameworks
- **Measure:** Weekly check-in survey responses
- **Quality Check:** "Framework output was immediately usable" (4+ rating)
- **Skill Transfer:** "I used skills from Week 1 in this framework" (yes/no tracking)

### Overall Program Success:
- **Progressive engagement:** Teachers who complete Week 1 are more likely to complete Week 2-4
- **Skill compounding:** Teachers report faster completion times as they master core skills
- **Confidence building:** "I feel more confident using AI for planning" (pre/post comparison)

---

## Files Updated

1. ✅ Created `AIB-001-lesson-objective-unpacker.md` (new foundation framework)
2. ✅ Updated `README.md` with new strategy, progressive framework approach, and deferred framework section
3. ✅ Created `FRAMEWORK-STRATEGY-UPDATE.md` (this document)
4. ⚠️ **TO-DO:** Update `src/emails/BetaWelcomeEmail.tsx` to reference lesson planning instead of parent communication
5. ⚠️ **TO-DO:** Update `beta-welcome-kit.md` to reference AIB-001 as Lesson Objective Unpacker
6. ⚠️ **TO-DO:** Ensure post-framework survey questions apply to objective unpacking (not parent emails)

---

## Implementation Checklist

Before beta launch:

- [ ] Test AIB-001 prompt with 3+ different content areas (ELA, Math, Science, Social Studies)
- [ ] Test with 3+ different grade levels (elementary, middle, high school)
- [ ] Verify success criteria output is genuinely kid-friendly
- [ ] Confirm misconception predictions are realistic
- [ ] Test in at least 2 different AI platforms
- [ ] Update welcome email copy to reference lesson planning
- [ ] Update beta welcome kit to reference AIB-001 correctly
- [ ] Create sample "before/after" showing success criteria transformation
- [ ] Prepare Week 2 email template connecting AIB-001 to AIB-002

---

## Communication to Stakeholders

**For Beta Testers:**
"We're starting with the most universally valuable skill: unpacking lesson objectives and creating student-friendly success criteria. This foundation will make everything else easier."

**For District Partners:**
"Week 1 is for everyone—it builds the core skill. Weeks 2-4 are customized for your specific systems (Tier I curriculum, OnCourse data, cluster meetings)."

**For Team:**
"We pivoted from parent communication to lesson objective unpacking because it provides universal daily value, builds foundational AI planning skills, and creates a natural progression into the district-specific frameworks."

---

## Lessons Learned

**Strategic Insight:**
The first framework must:
1. Work for 100% of the target audience (not 40-50%)
2. Build skills needed for subsequent frameworks (skill progression, not random tools)
3. Align with core value proposition (academic rigor, not administrative tasks)
4. Provide daily use cases (not weekly or monthly)

**Framework Design Principle:**
"Universal entry point → Progressive complexity → Specialized applications"

Not: "Specialized tool → Different specialized tool → Different specialized tool"

---

*Decision made: October 12, 2025*  
*Status: Implemented, ready for testing*  
*Next review: After Week 1 beta feedback*

---

## Addendum: Beta Cohort Strategy Shift (October 12, 2025)

### New Context: 8-Person Beta Cohort

After finalizing the actual beta cohort composition, we made a significant strategic adjustment to the framework deployment strategy.

**Beta Cohort:**
- **Size:** 8 educators (not district-wide deployment)
- **Composition:** 6 math/STEM teachers + 2 master teachers
- **Context:** No formal district partnerships initially

### Strategic Pivot: From 4 Frameworks to Co-Creation Model

**Original Beta Plan (as documented above):**
- Week 1: AIB-001 (Lesson Objective Unpacker) - Universal
- Week 2: AIB-002 (Curriculum Fidelity Check) - District-specific
- Week 3: AIB-003 (CDA Data Summarizer) - District-specific
- Week 4: AIB-004 (Internalization Alignment Scrutiny) - District-specific

**Problem Identified:**
AIB-002, AIB-003, and AIB-004 were too district-specific:
- Referenced "Tier I curriculum," "2nd 9 Weeks," "pacing chart"
- Referenced "OnCourse" platform and "CDA" assessments
- Referenced "cluster meetings" and "internalization guides"
- Assumed structured district systems that the 8-person beta cohort doesn't necessarily have

**Revised Beta Plan:**
- **Weeks 1-4:** Focus ONLY on AIB-001 (Lesson Objective Unpacker)
- **Weeks 3-4:** Gather pain point feedback through weekly surveys
- **Weeks 5-6:** Analyze patterns and prototype NEW frameworks based on actual beta tester needs
- **Weeks 7-8:** Test prototypes with beta testers
- **Weeks 9-12:** Deploy finalized frameworks co-created with beta cohort

### Documented Pain Points from Beta Cohort

Through conversations with the 8 beta testers, we identified 3 major pain points:

**Pain Point #1: Lesson Plan Internalization & Differentiation**
- Challenge: Copy/paste from curriculum providers, need efficient adaptation
- Teachers want to differentiate without straying from approved curriculum
- Desire to map math/STEM topics to student interests

**Pain Point #2: Data Analysis for Cluster Meetings**
- Teachers need help turning data into meaningful talking points
- Master teachers need facilitation structures for productive discussions
- Challenge: Meetings drift off-topic or stay surface-level

**Pain Point #3: Tedious Task Automation**
- All beta testers want time back from repetitive tasks
- Examples: Creating problem variations, formatting materials, routine communications
- 30-60 minutes daily consumed by automatable work

### Decision: Co-Creation Over Pre-Building

**Instead of deploying district-specific frameworks that may not fit:**
1. Focus on mastering ONE universal foundation framework (AIB-001)
2. Use weekly check-in survey Question #5: "What's your biggest pain point this week that AI could help with?"
3. Let beta testers tell us what they actually need through 4 weeks of feedback
4. Build frameworks based on revealed patterns, not assumptions
5. Test prototypes with 2-3 beta testers before wider deployment

### What Happened to AIB-002, AIB-003, AIB-004?

**Archived for Future Use:**
- Original district-specific versions moved to `archive/`
- Simplified, universal versions created in `archive/future-frameworks/`
- Ready to deploy IF beta tester pain points align with these frameworks
- May inform Phase 2 framework development
- Can be customized for future district partnerships

**Deployment Criteria:**
- Wait for beta tester confirmation through weekly surveys (Weeks 3-4)
- Test with 2-3 beta testers before full deployment
- Refine based on their specific systems and contexts
- Only deploy if pain points truly align

### Key Insight

**Original Assumption:** "Build frameworks for common district systems, then find teachers who use those systems"

**Revised Understanding:** "Build trust with ONE excellent framework, then let actual beta testers guide what comes next"

**Rationale:**
- 8-person cohort without district partnerships needs a different approach than district-wide deployment
- Co-creation builds stronger frameworks that solve real problems
- Beta testers become invested partners, not just testers
- Reduces risk of building frameworks nobody uses
- Allows for unexpected pain points we haven't anticipated

### Impact on Messaging

**Beta Welcome Kit:** Updated to emphasize co-creation, removed Week 2-4 framework descriptions

**Weekly Check-In Survey:** Added Question #5 as the KEY question for gathering pain points

**README.md:** Updated to reflect single-framework Phase 1 strategy and co-creation model

**Email Templates:** Will be updated to remove references to multiple frameworks and emphasize co-creation

**Landing Page:** Will be updated to describe beta as "co-creation model" not "4-week framework progression"

### Success Metrics Shift

**Old Metrics:**
- Adoption rate of 4 frameworks
- Time savings across 4 different workflows
- Completion of 4-week progression

**New Metrics:**
- Mastery of AIB-001 (75%+ usage rate over 4 weeks)
- Quality of pain point feedback (specific, actionable insights)
- Co-creation engagement (beta testers excited to help build next frameworks)
- Prototype testing participation (2-3 volunteers eager to test new frameworks)
- Final framework adoption (frameworks built from pain points get 75%+ adoption)

### Next Steps

1. ✅ Archive AIB-002, AIB-003, AIB-004 (district-specific versions)
2. ✅ Create simplified versions in `archive/future-frameworks/`
3. ✅ Update beta-welcome-kit.md to remove Week 2-4 frameworks
4. ✅ Update weekly-check-in-survey.md with pain point question
5. ✅ Create BETA-TESTER-PAIN-POINTS.md documentation
6. ✅ Update README.md to reflect co-creation strategy
7. ⏳ Update email templates (BetaWelcomeEmail, WeeklyPromptEmail)
8. ⏳ Update LandingPage.tsx
9. ⏳ Test end-to-end beta flow with new messaging
10. ⏳ Launch beta with AIB-001 only, begin gathering pain point feedback

---

*Addendum added: October 12, 2025*  
*Status: Strategy pivot implemented, ready for Phase 1 launch*  
*Next review: After Week 4 (analyze pain point patterns from weekly surveys)*

