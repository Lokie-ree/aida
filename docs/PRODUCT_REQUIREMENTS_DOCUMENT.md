# Pelican AI - Product Requirements Document (PRD)

**Version:** 2.0  
**Date:** November 2025  
**Status:** Phase 2 MVP Complete, Pre-Beta Launch  

---

## Executive Summary

Pelican AI is a platform-agnostic AI guidance system designed specifically for Louisiana educators. The platform empowers teachers to use ANY AI tool effectively while maintaining ethical standards and saving 3-5 hours per week on administrative tasks.

**Current Status:** Phase 2 MVP is complete and fully operational. The system includes beta signup, authentication, email automation, framework library UI, community features, dashboard, and admin tools. All Phase 2 features are exposed and ready for end-to-end testing before beta launch.

---

## 1. Product Vision & Mission

### Vision
Navigate AI with Confidence - Every Louisiana educator equipped with practical, ethical, and platform-agnostic AI guidance.

### Mission
Empower Louisiana educators with practical, ethical, and platform-agnostic AI guidance that reclaims their time for high-impact teaching.

### Core Value Proposition
- **Platform-Agnostic:** Works with ANY AI tool (MagicSchool AI, Brisk, SchoolAI, Gemini, etc.)
- **Louisiana-Aligned:** Built for Louisiana state standards and educator rubric
- **Ethical Guardrails:** Responsible AI use is built-in
- **Time-Saving:** Immediate, practical solutions for common tasks (3-5 hours/week savings target)

---

## 2. Current System Architecture

**For complete technical architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md).**

### 2.1 System Overview

**Platform:** Platform-agnostic AI guidance system
**Tech Stack:** React 19 + TypeScript + Convex + Better Auth
**Design:** Louisiana-branded, WCAG 2.1 AA compliant, mobile-first

### 2.2 Current System Status

**For detailed database schema and implementation status, see [AGENT.md](../AGENT.md#current-system-status) and [ARCHITECTURE.md](ARCHITECTURE.md#database-schema).**

**Phase 1 MVP:** Complete ✅ (October 2025)
- Beta signup, authentication, email automation, user profiles
- 100% test success rate across all core functionality

**Phase 2 MVP:** Complete ✅ (October 26, 2025)
- Framework library (80+ operations, fully exposed UI)
- Community features (innovations, testimonials, fully operational)
- Dashboard (simplified, 67% cognitive load reduction)
- Admin dashboard (content moderation, beta program management)
- All UI components exposed and functional

---

## 3. User Personas & Journey

### 3.1 Primary Personas

**Sarah Johnson - High School English Teacher, Jefferson Parish**
- **Pain Points:** Overwhelmed by AI tools, lacks time for lesson planning, ethical concerns
- **Goals:** Save time on administrative tasks, improve lesson quality, use AI responsibly
- **Tech Comfort:** Moderate - uses district-provided tools

**Michael Chen - Elementary Math Teacher, Lafayette**
- **Pain Points:** Struggles with AI prompt writing, wants Louisiana-specific guidance
- **Goals:** Differentiate instruction, create engaging activities, maintain academic integrity
- **Tech Comfort:** High - early adopter of new tools

**Dr. Lisa Rodriguez - Middle School Science Teacher, Baton Rouge**
- **Pain Points:** Needs standards-aligned content, wants to share innovations
- **Goals:** Align with Louisiana standards, collaborate with peers, track impact
- **Tech Comfort:** High - tech-savvy educator

### 3.2 Current User Journey

**Phase 1 Journey (Email-First):**
1. **Discovery:** Landing page with clear value proposition
2. **Signup:** Beta signup form (name, email, school, subject)
3. **Approval:** Manual approval process (24-48 hours)
4. **Onboarding:** Welcome email with temporary password
5. **Engagement:** Weekly prompt emails with AI frameworks
6. **Feedback:** Email-based feedback collection

**Phase 2+ Journey (Full Platform):**
1. **Discovery:** Same landing page
2. **Signup:** Same beta signup process
3. **Dashboard:** Personalized dashboard with stats and quick start
4. **Framework Library:** Browse, search, and use AI frameworks
5. **Community:** Share innovations and read testimonials
6. **Analytics:** Track time savings and progress

---

## 4. Feature Requirements

### 4.1 Phase 1 MVP (Completed)

**Core Features:**
- [x] Beta invitation email system
- [x] Simple web signup/auth flow (Better Auth)
- [x] Automated welcome email
- [x] Automated weekly prompt email (cron job)
- [x] Database schema for core functionality
- [x] Mobile-responsive design
- [x] WCAG 2.1 AA accessibility compliance

**Success Metrics (Phase 1):**
- 20+ active beta testers
- 75%+ weekly email open rate over 4 weeks
- 80%+ report immediate time savings (10+ minutes per prompt)
- 90%+ satisfaction rating
- <3s page load times
- 99%+ uptime during MVP period

### 4.2 Phase 2 Features (Complete ✅)

**Framework Library:**
- [x] Framework CRUD operations (80+ functions)
- [x] Search and filtering by module, category, difficulty, tags
- [x] Louisiana standards alignment
- [x] Platform compatibility tracking
- [x] Usage analytics and tracking
- [x] Framework library UI fully exposed
- [x] One-click copy prompt functionality
- [x] Saved frameworks persistence

**Community Features:**
- [x] Innovation sharing system (submit, browse, filter, search)
- [x] Testimonial submission and approval workflow
- [x] Community interaction tracking (likes, views, shares)
- [x] Community UI fully exposed
- [x] Louisiana context encouraged throughout

**Dashboard:**
- [x] Personal progress tracking (frameworks tried, time saved, innovations shared)
- [x] Time savings tracker (weekly/monthly/total views)
- [x] Weekly engagement streak display
- [x] Quick start experience with personalized recommendations
- [x] Recently used frameworks
- [x] Dashboard UI simplified and exposed (67% cognitive load reduction)

**Admin Dashboard:**
- [x] Beta user management and approval workflow
- [x] Content moderation (testimonials, innovations)
- [x] Analytics and reporting
- [x] Admin dashboard UI functional
- [x] Access control and role-based permissions

**Time Tracking:**
- [x] Time savings recording
- [x] Analytics and progress tracking
- [x] Framework usage tracking
- [x] Time tracking UI integrated in dashboard

### 4.3 Phase 3+ Features (Future)

**Advanced Features:**
- [ ] RAG-powered document processing
- [ ] Voice interface integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Integration with district systems
- [ ] Professional development tracking

---

## 5. Technical Requirements

### 5.1 Performance Requirements
- **Page Load Time:** <3 seconds on 3G connection
- **Email Delivery:** <10 seconds for transactional emails
- **API Response:** <500ms for critical operations
- **Uptime:** 99%+ during MVP period

### 5.2 Security Requirements
- **FERPA Compliance:** All educator data protected
- **Authentication:** Secure session management via Better Auth
- **Data Privacy:** No data sharing without consent
- **Audit Logging:** Track sensitive operations

### 5.3 Accessibility Requirements
- **WCAG 2.1 Level AA:** Mandatory compliance
- **Keyboard Navigation:** Full keyboard support
- **Screen Reader:** Semantic HTML and ARIA labels
- **Color Contrast:** Minimum 4.5:1 for normal text

---

## 6. Current System Status

### 6.1 What's Working (Phase 2 Complete)
- **Authentication:** Better Auth integration functional (100% test success)
- **Email System:** Resend integration working with branded templates
- **Database:** All tables created and functional (14 tables total)
- **Backend APIs:** All CRUD operations implemented (80+ Convex functions)
- **Framework Library:** Fully exposed UI with search, filter, and copy functionality
- **Community Features:** Innovation sharing and testimonials UI operational
- **Dashboard:** Simplified design (4 essential components) with personalized stats
- **Admin Tools:** Content moderation and beta program management functional
- **UI Components:** Complete component library (40+ components)
- **Email Templates:** Professional, branded templates (4 templates)

### 6.2 Current Status
- **Test Coverage:** 100% success rate on all implemented features
- **UI Exposure:** All Phase 2 features fully exposed and operational
- **CORS Issues:** Resolved - all authentication endpoints working
- **Session Management:** Better Auth fully functional
- **Dashboard:** Successfully consolidated from 12+ components to 4 essentials
- **Design System:** Consolidated (379 → 133 lines CSS, 72% reduction)
- **Route Structure:** Optimized (removed 4 unnecessary wrapper files)

### 6.3 Pre-Launch Requirements
1. **E2E Testing:** Execute comprehensive test protocol (see [TESTING_PROTOCOL.md](TESTING_PROTOCOL.md))
2. **User Story Validation:** Test all 9 P0 user stories (USER-003 through USER-022)
3. **QA Sign-Off:** Complete QA validation before beta launch
4. **Beta Launch:** Soft launch to initial beta testers (30 days out)

---

## 7. Success Metrics & KPIs

### 7.1 Phase 1 Metrics (Historical)
- **Beta Testers:** Target 20+, Status: Ready for beta launch
- **Email Open Rate:** Target 75%+, Status: To be measured post-launch
- **Time Savings:** Target 80% report 10+ minutes saved, Status: To be measured post-launch
- **Satisfaction:** Target 90%+, Status: To be measured post-launch
- **Performance:** Target <3s load time, Status: ✅ Verified <3s on all pages

### 7.2 Phase 2 Metrics (Planned)
- **Framework Usage:** 50+ frameworks used per user per month
- **Community Engagement:** 25% of users share innovations
- **Time Tracking:** Average 3+ hours saved per week
- **Retention:** 80% monthly active users

### 7.3 Business Metrics
- **User Acquisition:** 100+ beta testers by end of Phase 2
- **Engagement:** 60% weekly active users
- **Growth:** 20% month-over-month user growth
- **Revenue:** TBD (monetization strategy pending)

---

## 8. Competitive Analysis

### 8.1 Direct Competitors
- **MagicSchool AI:** AI tool, not guidance
- **Brisk:** AI tool, not guidance
- **SchoolAI:** AI tool, not guidance

### 8.2 Competitive Advantages
- **Platform-Agnostic:** Works with any AI tool
- **Louisiana-Specific:** Aligned to state standards
- **Educator-Led:** Built by educators for educators
- **Ethical Focus:** Responsible AI use built-in

---

## 9. Risk Assessment

### 9.1 Technical Risks
- **Authentication Issues:** Better Auth HTTP endpoint problems (Medium)
- **Scalability:** Convex limits with high user growth (Low)
- **Email Deliverability:** Resend reputation management (Low)

### 9.2 Business Risks
- **User Adoption:** Slow beta signup rate (Medium)
- **Competition:** Large AI companies entering education (High)
- **Regulatory:** FERPA compliance requirements (Low)

### 9.3 Mitigation Strategies
- **Technical:** Regular testing, monitoring, and quick fixes
- **Business:** Strong value proposition, educator partnerships
- **Regulatory:** Built-in compliance from day one

---

## 10. Roadmap & Timeline

### 10.1 Immediate (Next 2 weeks) - Pre-Launch
- Execute comprehensive E2E testing (see [TESTING_PROTOCOL.md](TESTING_PROTOCOL.md))
- Validate all 9 P0 user stories (USER-003 through USER-022)
- QA sign-off for beta launch readiness
- Final bug fixes and polish

### 10.2 Short-term (Next 2 months) - Beta Launch
- Launch to initial beta testers (30 days out)
- Monitor user engagement and feedback
- Gather metrics on framework usage, community engagement, and time savings
- Iterate based on beta user feedback
- Prepare for general availability

### 10.3 Medium-term (Next 6 months)
- Launch full platform to beta users
- Implement advanced analytics
- Add RAG-powered features
- Scale to 100+ users

### 10.4 Long-term (Next 12 months)
- Public launch
- Mobile app development
- District partnerships
- Revenue generation

---

## 11. Appendices

### 11.1 Technical Architecture Diagram
```
Frontend (React 19 + TypeScript)
    ↓
Convex Backend (Database + Functions)
    ↓
External Services (Resend, OpenAI, Better Auth)
```

### 11.2 Database Schema Summary
- **Core Tables:** 6 tables for Phase 1 functionality
- **Extended Tables:** 8 additional tables for Phase 2+ features
- **Total Functions:** 80+ Convex functions implemented
- **API Endpoints:** 10+ HTTP endpoints for authentication

### 11.3 Component Library
- **UI Components:** 25+ shadcn/ui components
- **Custom Components:** 15+ Pelican AI-specific components
- **Email Templates:** 4 React Email templates
- **Accessibility:** WCAG 2.1 AA compliant throughout

---

**Document Owner:** Product Team  
**Last Updated:** November 2025  
**Next Review:** December 2025  
**Status:** Phase 2 Complete, Pre-Beta Launch  
**Next Milestone:** E2E Testing → QA Sign-Off → Beta Launch (30 days)
