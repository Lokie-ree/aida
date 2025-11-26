

# **Pelican AI**

Founder's Strategic Guide

*Educator-Centered Decision Making*

**"We're Not Waiting for LDOE"**

A living document for solo founder decision-making  
based on what Louisiana educators actually need

Last Updated: November 25, 2025

# **1\. Current State Analysis**

## **Platform Overview**

Pelican AI is an educational SaaS platform providing Louisiana educators with platform-agnostic AI guidance. Rather than replacing existing AI tools, it serves as an "intelligent coaching layer" that works with any AI tool (ChatGPT, Gemini, MagicSchool AI, Claude, etc.).

### **Development Status Summary**

| Component | Status | Notes |
| :---- | :---- | :---- |
| Framework Library | ✅ Complete | 10 platform-agnostic frameworks |
| Alignment Scorecard Backend | ✅ Complete | Workflow, RAG, DB ready |
| Alignment Scorecard UI | 🚧 In Progress | Priority before Dec 1 launch |
| User Dashboard | ✅ Complete | Time tracking, analytics |
| Community Features | ⏸️ Hidden for MVP | Enable at 30-100 users |
| Weekly Email Automation | ⏸️ Feature-Flagged | Personal check-ins preferred |

## **Technical Architecture**

* **Frontend:** React 19 \+ TypeScript \+ Vite \+ Tailwind CSS \+ shadcn/ui  
* **Backend:** Convex (serverless real-time database) with \~27 modules  
* **AI Integration:** GPT-4o for content analysis, RAG for Louisiana Standards  
* **Authentication:** Better Auth with session-based authentication  
* **Email:** Resend API for transactional emails

# **2\. The Educator-First Decision Framework**

This framework replaces traditional board-driven product decisions with a systematic approach to gathering and acting on educator feedback. Every feature decision should pass through these filters.

## **Decision Filter Questions**

Before building or prioritizing any feature, ask:

1. **Did a real educator request this?** If not, is there evidence educators need it?  
2. **Does this solve a time problem?** Louisiana teachers are overwhelmed—does this save minutes?  
3. **Does this align with the Louisiana Educator Rubric?** Every feature must be rubric-infused.  
4. **Is this platform-agnostic?** It must work with any AI tool, not lock users in.  
5. **Can I explain this in teacher-to-teacher language?** No corporate jargon.

## **Feedback Collection Cadence**

| Timeframe | Activity | Purpose |
| :---- | :---- | :---- |
| Daily (Week 1\) | Personal check-ins with each beta user | Rapid friction identification |
| Weekly (Month 1\) | "Did this save you time?" conversations | Value validation |
| Bi-weekly (Ongoing) | Feature request compilation | Roadmap prioritization |
| Monthly | "What's missing?" open-ended feedback | Gap identification |

# **3\. Key Differentiators to Protect**

These are non-negotiable elements that make Pelican AI different from corporate EdTech solutions. Any feature that compromises these should be rejected.

## **Louisiana-Specific Alignment**

* Every feature references the Louisiana Educator Rubric (LER) indicators  
* Content validates against Louisiana Student Standards (LSS)  
* Examples use Louisiana contexts, parish references, and local challenges  
* Builds teacher capacity for rubric understanding, not dependency on the tool

## **Platform-Agnostic Philosophy**

* Frameworks work with ChatGPT, Gemini, MagicSchool AI, Claude, or any AI tool  
* No vendor lock-in—teachers choose their preferred AI platform  
* Guidance focuses on pedagogical practice, not specific tool mechanics

## **Teacher-Built Authenticity**

* Founder is an active Louisiana classroom teacher (not a tech company)  
* Communication is teacher-to-teacher, not corporate marketing  
* Growth is organic and word-of-mouth, not paid acquisition  
* Honest numbers: "small group of educators" not fake social proof

## **Quality Over Speed**

* AI-generated content goes through alignment validation (Alignment Scorecard)  
* Frameworks emphasize ethical guardrails and responsible AI use  
* FERPA compliance is non-negotiable—no PII in logs, ever

# **4\. Launch Timeline & Milestones**

## **Phase 1: Beta Launch (December 1, 2025\)**

1. **Complete Alignment Scorecard UI** — Core value proposition for beta users  
2. **Launch with committed colleagues** — Small group, authentic relationships  
3. **Daily personal check-ins Week 1** — Real conversations, not automated emails  
4. **Gather initial feedback** — "Did this help or waste your time?"

## **Phase 2: Proof of Concept (Dec 2025 \- Spring 2026\)**

* Accumulate authentic user testimonials demonstrating real value  
* Document concrete time savings and rubric alignment improvements  
* Organic growth to 30-50 users through word-of-mouth  
* Enable community features when user base reaches 30-100

## **Phase 3: Conference Presentations (Summer 2026\)**

* APEL LEADS conference — Louisiana educators (primary audience)  
* ISTE conference in Orlando — National audience, grassroots model showcase  
* Leverage Spring 2026 testimonials for credibility

# **5\. Feature Prioritization Matrix**

Use this matrix when educators request new features or when deciding development priorities.

## **Priority Scoring System**

| Criteria | Scoring Guide |
| :---- | :---- |
| **Educator Demand** | 3=Multiple requests, 2=Single request, 1=Founder idea, 0=No demand |
| **Time Savings Impact** | 3=Significant daily time saved, 2=Weekly impact, 1=Occasional use, 0=No time savings |
| **Rubric Alignment** | 3=Directly addresses rubric indicators, 2=Indirect support, 1=Tangential, 0=Unrelated |
| **Implementation Effort** | 3=Quick win (\<1 week), 2=Medium (1-2 weeks), 1=Large (2-4 weeks), 0=Major (\>1 month) |

*Priority Score \= (Educator Demand × 2\) \+ Time Savings \+ Rubric Alignment \+ Implementation*  
Features scoring 8+ are high priority. Features scoring 4-7 are medium priority. Features scoring \<4 should be deferred or reconsidered.

## **Current Feature Backlog (Scored)**

| Feature | Demand | Time | Rubric | Effort | Score |
| :---- | :---: | :---: | :---: | :---: | :---: |
| Alignment Scorecard UI | 3 | 3 | 3 | 2 | **14** |
| Weekly Spark (Pacing Prompts) | 2 | 3 | 3 | 1 | **11** |
| Delta Generator (Differentiation) | 2 | 3 | 3 | 1 | **11** |
| Dashboard Simplification | 1 | 1 | 1 | 2 | **6** |

# **6\. Educator Feedback Tracking**

Use this template to systematically capture and act on educator feedback. Every piece of feedback should be documented and considered.

## **Feedback Log Template**

| Date | Educator | Feedback | Category | Action |
| :---- | :---- | :---- | :---- | :---- |
| \[Example\] | Sarah J., JP | Saved 20 min on lesson planning | Testimonial | Documented |
|  |  |  |  |  |
|  |  |  |  |  |

## **Feedback Categories**

* **Testimonial:** Positive feedback for marketing/credibility  
* **Bug:** Something broken that needs immediate fix  
* **Feature Request:** New capability educators want  
* **UX Issue:** Confusion or friction in existing features  
* **Content Gap:** Missing frameworks or guidance

# **7\. Anti-Patterns to Avoid**

These are decisions or behaviors that would undermine the educator-first mission. When in doubt, refer back to this list.

## **Never Do**

* **Use fake social proof** — No "Join 10,000+ educators" until you have 10,000 educators  
* **Prioritize features educators didn't ask for** — Founder ideas come second  
* **Use corporate jargon** — "Leverage synergies" is death for authenticity  
* **Lock users into specific AI tools** — Platform-agnostic is non-negotiable  
* **Automate before personal relationships** — Check-ins \> email sequences at this stage  
* **Build without rubric alignment** — Every feature must connect to LER indicators  
* **Log PII** — FERPA compliance is absolute  
* **Scale before validating** — Testimonials first, then growth

## **Warning Signs**

If you notice any of these patterns, pause and re-evaluate:

1. Building features no educator has requested  
2. More time on code than on educator conversations  
3. Feeling pressure to grow faster than organic allows  
4. Neglecting personal check-ins in favor of automation  
5. Adding complexity without educator demand

# **8\. Success Metrics (Educator-Defined)**

Traditional startup metrics (MAU, retention curves, ARR) matter less than educator-defined success. These are the metrics that matter for Pelican AI.

## **Primary Metrics**

| Metric | Why It Matters | Target |
| :---- | :---- | :---- |
| Time Saved Per Week | Core value proposition for teachers | 30+ min/week average |
| Testimonials Collected | Social proof for organic growth | 10+ by Spring 2026 |
| Word-of-Mouth Referrals | Validates authentic value | Each user refers 1+ |
| Rubric Understanding Improved | Builds capacity, not dependency | Self-reported improvement |

## **Milestone Checkpoints**

* **December 2025:** Beta launch with 4-10 committed educators  
* **January 2026:** First 5 authentic testimonials collected  
* **Spring 2026:** 30-50 users, wealth of testimonials for conference prep  
* **Summer 2026:** APEL LEADS and ISTE presentations delivered

# **9\. The Core Question**

*Before every decision, ask:*

**"Does this help a Louisiana teacher save time while improving their practice?"**

If yes, do it.

If no, reconsider.

*This document is a living guide. Update it as you learn from educators. Their voice is the only board of directors that matters.*