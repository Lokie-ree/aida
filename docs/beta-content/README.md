# Beta Welcome Experience Content

This directory contains all the content needed for your Welcome Experience as outlined in the one-week beta launch plan.

---

## 🚀 Quick Start

**New here?** Start with these 3 steps:

1. **Read:** [Beta Strategy](#beta-strategy-single-framework-with-co-creation) below to understand the co-creation approach
2. **Create:** Follow [Implementation Sequence](#implementation-sequence) to build Google Doc and Forms
3. **Test:** Use [Testing Checklist](#testing-checklist) before launching to beta testers

**Active Files for Phase 1 Beta:**
- `AIB-001-lesson-objective-unpacker.md` → The ONLY framework for Phase 1 (universal foundation)
- `beta-welcome-kit.md` → Beta tester onboarding guide (emphasizes co-creation)
- `post-framework-survey.md` → Feedback collection (single framework)
- `weekly-check-in-survey.md` → Weekly engagement tracking + pain point gathering
- `BETA-TESTER-PAIN-POINTS.md` → Documented challenges to guide future framework development

**Strategic docs:**
- `FRAMEWORK-STRATEGY-UPDATE.md` → Why we chose AIB-001 and the co-creation model

**Archive:** `archive/` folder contains:
- Deferred parent communication framework (AIB-001 original)
- District-specific frameworks (AIB-002, AIB-003, AIB-004 original versions)
- Simplified universal versions in `archive/future-frameworks/` for post-beta deployment
- Source research and superseded documentation

---

## Beta Strategy: Single Framework with Co-Creation

**Phase 1 Approach:** Focus on ONE foundation framework, then co-create additional frameworks based on beta tester pain points.

### AIB-001: Lesson Objective Unpacker (Universal Foundation)

**Why This Framework:**
- Entry point for ALL educators regardless of district or curriculum
- Provides immediate daily value (teachers plan lessons every week)
- Teaches transferable skills: Breaking down objectives, identifying misconceptions, creating success criteria
- Builds confidence with AI-assisted planning before introducing more complex frameworks
- 3 minutes per lesson, beginner-friendly

**Time Commitment:** Weeks 1-4 (entire Phase 1 beta)

### Co-Creation Model

**Weeks 1-2:** Beta testers master AIB-001 using it with multiple lessons  
**Weeks 3-4:** Beta testers share detailed pain point feedback via weekly surveys  
**Weeks 5-6:** We analyze patterns and prototype 1-2 NEW frameworks addressing actual needs  
**Weeks 7-8:** Beta testers test prototypes and provide refinement feedback  
**Weeks 9-12:** Deploy finalized frameworks solving problems beta testers identified

### Beta Cohort Context

**Size:** 8 educators  
**Composition:** 6 math/STEM teachers (MS Math/Science, STEM/Career Tech, HS Math, MS Math, Tech Facilitator, Media Specialist) + 2 master teachers

**Documented Pain Points:**
1. **Lesson Plan Internalization & Differentiation:** Copy/paste from curriculum providers, need efficient adaptation, want to map STEM topics to student interests
2. **Data Analysis for Cluster Meetings:** Teachers need talking points, master teachers need facilitation structure
3. **Tedious Task Automation:** Repetitive tasks consuming 30-60 minutes daily

**Decision:** Don't assume which pain points matter most. Let weekly survey data reveal priorities, then build accordingly.

### Why NOT Multiple Frameworks in Phase 1

**Original Plan:** Deploy 4 frameworks (AIB-001 through AIB-004) in 4 weeks  
**Problem:** AIB-002, AIB-003, AIB-004 were too district-specific (referenced Tier I curriculum, OnCourse platform, cluster meetings, internalization guides)  
**Solution:** Archive district-specific frameworks, focus on universal foundation, co-create based on actual beta tester needs

**Key Insight:** 8-person beta cohort without district partnerships needs a different approach than district-wide deployment. Build trust with ONE excellent framework, then let beta testers guide what comes next.

## Files in This Directory

### 1. AIB-001-lesson-objective-unpacker.md
Complete content for the Lesson Objective Unpacker & Success Criteria Builder (Week 1 foundation framework).

**Target Audience:** ALL educators (universal foundation for the program)  
**Time Savings:** 3 minutes per lesson (vs. 10-15 minutes manually)  
**Skill Building:** Teaches objective breakdown, misconception analysis, and success criteria creation—foundational skills for all subsequent frameworks

**Action Required:**
- [ ] Create a new Google Doc
- [ ] Copy all content from this file
- [ ] Add Pelican AI logo at the top (https://pelicanai.org/primary-logo.png)
- [ ] Format headers in Pelican Blue (#0ea5e9)
- [ ] Set sharing to "Anyone with link can view"
- [ ] Copy the shareable link
- [ ] Test the framework yourself with 2-3 different objectives across content areas
- [ ] Update the welcome email template with the actual Google Doc link

### 2. BETA-TESTER-PAIN-POINTS.md
Documentation of the 3 major pain points identified from the 8-person beta cohort.

**Purpose:** Guide future framework development based on actual needs  
**Contents:** Detailed breakdown of each pain point with context, examples, and potential framework directions

**Action Required:**
- [ ] Review pain points to understand beta tester context
- [ ] Reference when analyzing weekly survey responses
- [ ] Update after Week 4 based on actual survey data patterns

### 3. beta-welcome-kit.md
Complete content for your Beta Welcome Kit document.

**Action Required:**
- [ ] Create a new Google Doc
- [ ] Copy all content from this file
- [ ] Add Pelican AI logo at the top
- [ ] Format with Pelican AI brand colors
- [ ] Replace all [Insert link] placeholders with actual URLs:
  - Lesson Objective Unpacker Framework link (AIB-001)
  - Post-Framework Survey link
  - Weekly Check-In Survey link
  - Office hours Zoom link (when scheduled)
- [ ] Set sharing to "Anyone with link can view"
- [ ] Copy the shareable link
- [ ] Update the email template with the actual Google Doc link

### 4. post-framework-survey.md
Complete questions and setup instructions for the Post-Framework Survey Google Form (updated for single framework).

**Action Required:**
- [ ] Go to forms.google.com
- [ ] Create new form
- [ ] Copy form title and description
- [ ] Add all questions with specified types and options
- [ ] Mark required questions as required
- [ ] Configure settings as specified
- [ ] Test by submitting a response
- [ ] Copy the shareable link
- [ ] Add link to Lesson Objective Unpacker framework document
- [ ] Add link to Beta Welcome Kit document

### 5. weekly-check-in-survey.md
Complete questions and setup instructions for the Weekly Check-In Google Form (updated with pain point question).

**Action Required:**
- [ ] Go to forms.google.com
- [ ] Create new form
- [ ] Copy form title and description
- [ ] Add all questions with specified types and options
- [ ] **Note:** Question 5 asks "What's your biggest pain point this week?" - this is KEY for co-creation
- [ ] Set up conditional logic for question 2
- [ ] Configure settings as specified
- [ ] Test by submitting a response
- [ ] Copy the shareable link
- [ ] Add link to Beta Welcome Kit document
- [ ] Plan automated Friday email reminder (manual or automated via Convex cron)

---

## Future Frameworks (Phase 2+)

### Co-Creation Based on Beta Feedback

**Phase 2 Strategy:** Don't pre-build frameworks. Let beta testers tell us what they need through weekly pain point feedback (Question 5 in weekly check-in survey).

**Decision Framework:**
1. **Frequency:** How often do beta testers encounter this pain point?
2. **Impact:** How much time would solving it save?
3. **Alignment:** Does it fit with "academic rigor and planning" value proposition?
4. **Feasibility:** Can we create an effective AI prompt for this in 2 weeks?

### Archived Frameworks Available for Adaptation

**Location:** `archive/future-frameworks/`

These simplified, universal frameworks are ready if beta tester pain points align:

1. **AIB-002: Curriculum Pacing Assistant** - May address Pain Point #1 (lesson internalization)
2. **AIB-003: Assessment Data Analyzer** - Directly addresses Pain Point #2 (data analysis for teachers)
3. **AIB-004: Collaborative Planning Facilitator** - Directly addresses Pain Point #2 (facilitation for master teachers)

**Deployment Criteria:**
- Wait for beta testers to confirm pain point through weekly surveys (Weeks 3-4)
- Test with 2-3 beta testers before full deployment
- Refine based on their specific systems and contexts

### Deferred Parent Communication Framework

**File:** `archive/AIB-001-parent-communication-framework.md`

**Why Deferred:**
- Not all teachers write frequent parent emails
- Less universally applicable than objective unpacking
- Doesn't build foundation for academic rigor and planning skills
- Better suited for later phase when teachers are comfortable with AI

**When to Deploy:**
- Phase 2 or 3 after core planning frameworks are established
- As an optional "communication toolkit" addition
- For teachers who specifically request parent communication support
- Could be strong for parent-teacher conference season (October-November)

**Value Proposition:**
- 5 minutes per email (vs. 20-30 minutes manually)
- Professional, empathetic tone assistance
- Works for academic updates, behavioral concerns, positive news

**Potential Future Positioning:**
"Now that you're using AI for planning and instruction, let's extend it to parent communication..."

## Updated Files

### src/emails/BetaWelcomeEmail.tsx
The Beta Welcome Email template has been updated with:
- ✅ Opening paragraph acknowledging educator pain points
- ✅ Specific 3-5 hour/week time-saving promise
- ✅ Prominent "Try This Right Now" action box with framework link
- ✅ "What Happens Next" timeline section
- ✅ Beta Welcome Kit link with benefits
- ✅ Clear time commitment explanation
- ✅ New visual styles (actionBox and ctaLink)

**Action Required:**
- [ ] Update line 68: Replace placeholder URL with actual Lesson Objective Unpacker Framework link (AIB-001)
- [ ] Update line 122: Replace placeholder URL with actual Beta Welcome Kit link
- [ ] Update email copy to reference "lesson planning" and "success criteria" (not parent emails)
- [ ] Test the email by sending to yourself
- [ ] Verify all links work
- [ ] Check email rendering in multiple email clients if possible

## Implementation Sequence

Follow this order for best results:

### Step 1: Create Lesson Objective Unpacker Framework (30-45 minutes)
1. Create Google Doc
2. Copy content from `AIB-001-lesson-objective-unpacker.md`
3. Format with branding (logo, Pelican Blue headers)
4. Set sharing permissions to "Anyone with link can view"
5. Get shareable link
6. **Test the framework yourself** - Use the prompt with 2-3 different lesson objectives (try different grade levels and subjects) in at least 2 AI platforms to verify it works

### Step 2: Create Feedback Forms (20-30 minutes)
1. Create Post-Framework Survey from `post-framework-survey.md`
2. Create Weekly Check-In Survey from `weekly-check-in-survey.md`
3. Test both forms
4. Get shareable links

### Step 3: Create Beta Welcome Kit (45-60 minutes)
1. Create Google Doc
2. Copy content from `beta-welcome-kit.md`
3. Format with branding
4. Replace all [Insert link] placeholders with actual URLs:
   - Framework link (from Step 1)
   - Both survey links (from Step 2)
   - Office hours link (schedule this when ready)
5. Set sharing permissions
6. Get shareable link

### Step 4: Update Email Templates and Landing Page (15-20 minutes)
1. Update `src/emails/BetaWelcomeEmail.tsx`:
   - Change pain point paragraph from "parent emails" to "lesson planning and differentiation"
   - Update framework link to Lesson Objective Unpacker
   - Change "Try This Right Now" CTA from "draft parent email" to "unpack a lesson objective"
   - Update "What Happens Next" to remove Week 2-4 frameworks, add co-creation messaging
2. Update `src/emails/WeeklyPromptEmail.tsx`:
   - Default frameworkTitle to "Lesson Objective Unpacker & Success Criteria Builder"
   - Add co-creation messaging about sharing pain points
3. Update `src/components/shared/LandingPage.tsx`:
   - Change framework references from plural to singular where appropriate
   - Update beta program description to emphasize co-creation model
4. Deploy to Convex
5. Test by triggering a beta signup

### Step 5: Testing & Validation (15-30 minutes)
1. Send test welcome email to yourself
2. Click all links in the email
3. Navigate through the Welcome Kit
4. Try the Lesson Objective Unpacker Framework with 2-3 real lesson objectives from different content areas
5. Complete both feedback forms to test user experience
6. Time yourself - does it take under 5 minutes to use the framework per objective?
7. Verify the success criteria are truly student-friendly
8. Make any necessary adjustments

## Testing Checklist

Before launching to beta testers:

**Framework Testing:**
- [ ] Prompt works with ELA objectives
- [ ] Prompt works with Math objectives
- [ ] Prompt works with different grade levels (elementary, middle, high school)
- [ ] Tested in MagicSchool AI
- [ ] Tested in Gemini or Claude/ChatGPT
- [ ] Success criteria are genuinely student-friendly (appropriate reading level)
- [ ] Misconception predictions are realistic and helpful
- [ ] Scaffold suggestions are practical and actionable
- [ ] Time from start to usable output is under 5 minutes
- [ ] Instructions are clear for someone who's never used AI

**Email Testing:**
- [ ] Welcome email sends successfully
- [ ] All links are clickable
- [ ] Email renders correctly on desktop
- [ ] Email renders correctly on mobile
- [ ] Links open to correct documents
- [ ] Documents are viewable without sign-in

**Document Testing:**
- [ ] Lesson Objective Unpacker Framework is readable and well-formatted
- [ ] Beta Welcome Kit is readable and well-formatted
- [ ] All internal links work within documents
- [ ] Logo displays correctly in all documents
- [ ] Documents can be viewed on mobile devices
- [ ] Code blocks (prompts) are clearly formatted and copy-pasteable

**Form Testing:**
- [ ] Post-Framework Survey accepts responses
- [ ] Weekly Check-In Survey accepts responses
- [ ] Conditional logic works in Weekly Check-In
- [ ] Form confirmation messages display correctly
- [ ] Email notifications work for form responses

## URL Tracking

Keep track of all your shareable links here for easy reference:

```
AIB-001: Lesson Objective Unpacker Framework:
https://docs.google.com/document/d/[YOUR-DOC-ID]/edit

Beta Welcome Kit:
https://docs.google.com/document/d/[YOUR-DOC-ID]/edit

Post-Framework Survey:
https://forms.google.com/[YOUR-FORM-ID]

Weekly Check-In Survey:
https://forms.google.com/[YOUR-FORM-ID]

Office Hours Zoom Link:
https://zoom.us/j/[YOUR-MEETING-ID]

---
Week 2+ Frameworks (for district partners):

AIB-002: Curriculum Fidelity Check:
https://docs.google.com/document/d/[YOUR-DOC-ID]/edit

AIB-003: OnCourse CDA Data Summarizer:
https://docs.google.com/document/d/[YOUR-DOC-ID]/edit

AIB-004: Internalization Alignment Scrutiny:
https://docs.google.com/document/d/[YOUR-DOC-ID]/edit
```

## Next Steps After Implementation

Once everything is set up and tested:

1. **Launch to First Beta Testers**
   - Start with 3-5 trusted colleagues
   - Get their feedback on the entire experience
   - Refine based on their input

2. **Scale to Full Beta Group**
   - Recruit 30-50 beta testers per recruitment plan
   - Monitor engagement in first week
   - Be ready to provide support

3. **Monitor & Iterate**
   - Check form responses weekly
   - Identify common issues or confusion
   - Update documents as needed (Google Docs make this easy!)

4. **Deliver Frameworks Progressively**
   - ✅ Week 1: Lesson Objective Unpacker (AIB-001) - Universal foundation, all beta testers
   - ✅ Week 2: Curriculum Fidelity Check (AIB-002) - District partners with structured curriculum
   - ✅ Week 3: CDA Data Summarizer (AIB-003) - District partners using OnCourse/similar platforms
   - ✅ Week 4: Internalization Alignment (AIB-004) - District partners with cluster meetings
   - Future Phase 2: Parent Communication Framework (deferred), additional frameworks based on beta feedback

## Questions or Issues?

If you encounter any issues during implementation:
- Check that all links are using "Anyone with link can view" permissions
- Verify links are using the shareable format (not the editing format)
- Test in incognito/private browsing to simulate user experience
- Make sure Google Docs are not requiring sign-in to view

## Success Metrics to Track

Once launched, monitor these metrics weekly:

- Number of beta signups
- Welcome email open rate
- Framework click-through rate
- Post-Framework Survey response rate
- Weekly Check-In Survey response rate
- Average time saved reported
- Framework clarity ratings
- User feedback themes

Good luck with your launch! 🚀

---

## 📁 File Organization Summary

### Active Implementation Files (Use These)
```
docs/beta-content/
├── README.md                                    ← Start here (you're reading it!)
├── AIB-001-lesson-objective-unpacker.md        ← Week 1 framework
├── AIB-002-curriculum-fidelity-check.md        ← Week 2 framework (district)
├── AIB-003-oncourse-cda-data-summarizer.md     ← Week 3 framework (district)
├── AIB-004-internalization-alignment-scrutiny.md ← Week 4 framework (district)
├── beta-welcome-kit.md                         ← Beta tester onboarding
├── post-framework-survey.md                    ← Feedback form setup
├── weekly-check-in-survey.md                   ← Weekly survey setup
├── FRAMEWORK-STRATEGY-UPDATE.md                ← Strategy docs (why this approach)
└── archive/                                    ← Old/superseded files
    ├── README.md                               ← What's archived and why
    ├── AIB-001-parent-communication-framework.md (deferred to Phase 2)
    ├── ipsb-pain-points.md (source research)
    └── [other superseded files]
```

### What to Ignore
- Anything in `archive/` folder (kept for reference only)
- Files not listed above (if you find any, they're outdated)

### Quick File Finder
**Need to create the welcome experience?** → Start with README.md (this file)  
**Need framework content?** → AIB-001 through AIB-004 `.md` files  
**Need to understand strategy?** → FRAMEWORK-STRATEGY-UPDATE.md  
**Looking for old parent communication framework?** → `archive/AIB-001-parent-communication-framework.md`  
**Need source research?** → `archive/ipsb-pain-points.md`

