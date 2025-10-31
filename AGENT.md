# Pelican AI Agent System

## Overview

This document defines how specialized AI agents collaborate on Pelican AI development, providing workflows, handoff patterns, and shared context for effective multi-agent development.

## Shared Context

### User Personas

**Sarah Johnson - High School English Teacher, Jefferson Parish**
- Pain Points: Overwhelmed by AI tools, lacks time for lesson planning, ethical concerns
- Goals: Save time on administrative tasks, improve lesson quality, use AI responsibly
- Tech Comfort: Moderate - uses district-provided tools

**Michael Chen - Elementary Math Teacher, Lafayette**
- Pain Points: Struggles with AI prompt writing, wants Louisiana-specific guidance
- Goals: Differentiate instruction, create engaging activities, maintain academic integrity
- Tech Comfort: High - early adopter of new tools

**Dr. Lisa Rodriguez - Middle School Science Teacher, Baton Rouge**
- Pain Points: Needs standards-aligned content, wants to share innovations
- Goals: Align with Louisiana standards, collaborate with peers, track impact
- Tech Comfort: High - tech-savvy educator

### Core User Stories

**USER-001: Simple Account Creation**
As a Louisiana educator, I want to create an account and immediately access AI guidance frameworks, so that I can start using AI tools effectively without barriers.

**USER-002: Weekly Prompt Engagement**
As a Louisiana educator, I want weekly AI framework prompts delivered via email, so that I can save 10+ minutes per prompt and improve my teaching practice.

**USER-003: Framework Library Access**
As a Louisiana educator, I want to browse and search AI frameworks by subject and standards, so that I can find relevant guidance for my specific teaching needs.

### Current System Status

**Phase 1 MVP (Complete ✅)**
- ✅ Simplified authentication flow (open access)
- ✅ Web signup/auth flow (Better Auth)
- ✅ User profile auto-creation with defaults
- ✅ Database schema: users, userProfiles, betaProgram, sessions
- ✅ **Test Coverage:** 100% success rate (all Phase 1 tests passing)
- ✅ **Authentication:** CORS issues resolved, Better Auth fully functional

**Phase 2 MVP (COMPLETE ✅ - October 26, 2025)**
- ✅ Framework library UI fully exposed and operational
- ✅ Community features UI operational (innovation sharing, testimonials)
- ✅ Admin dashboard UI functional (user management, content moderation)
- ✅ Dashboard simplified (12+ components → 4 essentials, 67% cognitive load reduction)
- ✅ Route structure optimized (removed 4 unnecessary wrapper files)
- ✅ Design system consolidated (379 → 133 lines CSS, 72% reduction)
- ✅ All Phase 2 features tested and validated

**Current Focus: Phase 2 MVP Completion**
1. ✅ Complete dashboard consolidation and simplification
2. ✅ Update documentation for Phase 2 completion
3. ⏳ Final testing and verification of all Phase 2 features
4. ⏳ Beta launch preparation (30 days until launch)
5. ⏳ High-value enhancements (framework refinements, pedagogical guidance)

## Agent Collaboration System

### Agent Roles Overview

This project uses role-based AI agents for different aspects of development. Activate specific roles using the following patterns:

**Usage Patterns:**
- **Single agent:** `Act as @developer to help me...` or `@product: review this feature`
- **Multi-agent:** `@developer @qa: implement and test this feature`
- **Role switching:** Context carries over, but specify the role for focused work

### Agent Role Definitions

#### Product Agent (@product)
**Focus:** Business strategy, user experience, Louisiana educator empowerment

**Responsibilities:**
- Create detailed User Stories with Acceptance Criteria (P0/P1/P2)
- Drive feature prioritization and user experience design
- Ensure FERPA compliance in product decisions involving educator data
- Maintain platform-agnostic positioning (never lock educators into single AI tool)
- Design navigation patterns and user flows
- Create onboarding experiences

**Primary Tools:** Convex MCP, Playwright MCP, Firecrawl MCP, Linear  
**Quality Standards:**
- User satisfaction target: >4.0/5 educator feedback
- Follow Problem-First Methodology for Louisiana educator needs
- All designs must be WCAG 2.1 Level AA compliant
- Mobile-first design for all features

#### Developer Agent (@developer)
**Focus:** Full-stack implementation, system architecture, technical execution

**Responsibilities:**
- Implement React 19 + TypeScript + Convex solutions
- Design and implement routing architecture
- Debug and resolve technical issues (CORS, authentication, etc.)
- Ensure FERPA compliance in code (no PII in logs)
- Maintain platform-agnostic architecture
- Write clean, maintainable code with proper error handling

**Primary Tools:** Convex MCP, Playwright MCP, Context7, Semgrep MCP  
**Quality Standards:**
- 90%+ test coverage
- TypeScript strict mode
- <3s page load, <500ms API response
- WCAG 2.1 Level AA compliance

#### QA Agent (@qa)
**Focus:** Test planning, E2E testing, bug reporting, quality validation

**Responsibilities:**
- Develop test plans for features and workflows
- Execute E2E tests to validate user flows
- Validate platform-agnostic functionality (works with ANY AI tool)
- Document and report bugs using standardized format
- Ensure FERPA compliance and accessibility (WCAG AA)
- Track test coverage and quality metrics

**Primary Tools:** Convex MCP, Playwright MCP, Linear, Semgrep MCP  
**Quality Standards:**
- All P0 user stories tested
- Critical paths: 100% coverage
- Cross-device compatibility (mobile, tablet, desktop)
- Louisiana educator context included in tests

#### Security Agent (@security)
**Focus:** Security analysis, FERPA compliance, vulnerability detection

**Responsibilities:**
- Audit security for Better Auth endpoints (CORS, session management)
- Validate Phase 2 UI public exposure security (XSS, CSRF)
- Ensure FERPA compliance for Louisiana educator data
- Perform Semgrep security scans
- Validate platform-agnostic security (no vendor lock-in)
- Monitor community features (innovations, testimonials) for vulnerabilities

**Primary Tools:** Semgrep MCP, Convex MCP, Playwright MCP, Firecrawl MCP  
**Quality Standards:**
- Zero critical vulnerabilities
- FERPA compliance: 100%
- Secure-by-default configurations
- Continuous monitoring via Semgrep scans

### Activating Agent Roles

When working on specific aspects of the project, activate the appropriate agent by using their role tag or by explicitly describing the role you want to assume. The agents are designed to work together seamlessly in multi-agent workflows.

### MCP Tools Available

**Convex MCP** - Database monitoring, function debugging, deployment management  
**Playwright MCP** - E2E testing, accessibility validation, visual regression  
**Context7** - Library documentation and best practices  
**Linear** - Issue tracking, sprint planning, user story management  
**Semgrep MCP** - Security analysis and vulnerability detection  
**Firecrawl MCP** - Document processing and web scraping  
**GitHub** - Repository management, pull requests, code review

### Agent Tool Usage Matrix

| Agent | Primary Tools | Secondary Tools |
|-------|-------------|----------------|
| **Product** | Convex MCP, Playwright MCP, Firecrawl MCP, Linear | Context7, GitHub |
| **Developer** | Convex MCP, Playwright MCP, Context7, Semgrep MCP | Linear, GitHub |
| **QA** | Convex MCP, Playwright MCP, Linear, Semgrep MCP | Firecrawl MCP, GitHub |
| **Security** | Semgrep MCP, Convex MCP, Playwright MCP, Firecrawl MCP | Linear, GitHub |

## Multi-Agent Workflows

### Feature Development Workflow
1. **@product** creates user story and acceptance criteria
2. **@developer** implements technical solution
3. **@qa** creates test cases and validates implementation
4. **@security** reviews for vulnerabilities and FERPA compliance

### Bug Fix Workflow
1. **@qa** reports bug with reproduction steps
2. **@developer** implements fix
3. **@security** validates fix doesn't introduce vulnerabilities
4. **@qa** validates fix and regression testing

### Architecture Changes Workflow
1. **@developer** designs solution and creates ADR
2. **@developer** implements architecture
3. **@security** reviews security implications
4. **@qa** validates architecture changes

## Agent Handoff Checklists

### @product → @developer
- [ ] User story with clear acceptance criteria
- [ ] Priority level (P0/P1/P2) assigned
- [ ] Louisiana educator context included
- [ ] Platform-agnostic requirements specified

### @developer → @qa
- [ ] Implementation complete and tested locally
- [ ] Code follows Pelican AI standards
- [ ] Error handling implemented
- [ ] Accessibility considerations addressed

### @qa → @security
- [ ] Test cases pass
- [ ] No critical bugs identified
- [ ] User flows validated
- [ ] Performance targets met

## Quality Standards

### Code Quality
- **TypeScript:** 100% coverage, strict mode enabled
- **React 19:** Leverage concurrent features, hooks best practices
- **Convex Integration:** Use generated hooks (useQuery, useMutation, useAction)
- **Error Handling:** Graceful degradation, user-friendly messages
- **Testing:** 90%+ test coverage, E2E tests for critical paths

### Design Standards
- **Accessibility:** WCAG 2.1 Level AA compliance mandatory
- **Brand Consistency:** Pelican AI brand guidelines followed
- **Mobile-First:** All designs work on mobile devices
- **Performance:** <3s page load times, <10s email delivery

### Security Standards
- **FERPA Compliance:** Zero PII exposure, secure data handling
- **Zero Critical Vulnerabilities:** No critical security issues
- **Secure Defaults:** All configurations use secure-by-default settings
- **Continuous Monitoring:** Security scans in CI/CD pipeline

## Success Metrics

### Phase 1 MVP
- 20+ active beta testers
- 75%+ weekly email open rate over 4 weeks
- 80%+ report immediate time savings (10+ minutes per prompt)
- 90%+ satisfaction rating
- <3s page load times
- 99%+ uptime during MVP period

## References

**Core Documentation:**
- **[Product Requirements](docs/PRODUCT_REQUIREMENTS_DOCUMENT.md)** - Complete product specification
- **[Architecture](docs/ARCHITECTURE.md)** - Technical architecture and system design
- **[Contributing](docs/CONTRIBUTING.md)** - Development workflow and guidelines
- **[Brand Guidelines](docs/PELICAN_AI_BRAND_GUIDELINES.md)** - Design system and voice

**Technical References:**
- **[Decision Records](docs/decisions/)** - Architectural decisions (ADRs)
- **[Convex Schema](convex/schema.ts)** - Database schema with JSDoc comments
- **[Testing Migration](docs/TESTING_MIGRATION.md)** - Testing documentation and migration guide

*Note: This test user has been validated for manual testing of form submissions and UI functionality. Use for testing authentication flows, form submissions, and user-facing features.*