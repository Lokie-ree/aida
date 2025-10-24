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

**Phase 2 Backend (Implemented, UI Not Exposed ✅/❌)**
- ✅ Framework library backend (convex/frameworks.ts, 80+ CRUD operations)
- ✅ Community features backend (convex/innovations.ts, testimonials.ts)
- ✅ Admin dashboard backend (convex/admin.ts)
- ✅ Time tracking backend (convex/timeTracking.ts)
- ✅ RAG system integration (@convex-dev/rag)
- ✅ UI components built (src/components/framework/, community/, admin/, dashboard/)
- ❌ UI not connected to user-facing routes or data flows

**Current Phase 2 Focus**
1. Fix critical UI bugs (WEB-47: Framework modal, WEB-48: Innovation form, WEB-49: Time tracking button)
2. Expose framework library UI to beta users (wire existing UI to backend)
3. Connect community features UI (add routing, data connections)
4. Comprehensive E2E testing of Phase 2 user flows
5. Beta user onboarding for Phase 2 feature testing

## Agent Collaboration System

### Available Agents

- **Product Agent** (`@.cursor/rules/product.mdc`) - Business strategy, user experience, Louisiana educator empowerment
- **Developer Agent** (`@.cursor/rules/developer.mdc`) - Full-stack implementation, system architecture, technical execution
- **QA Agent** (`@.cursor/rules/qa.mdc`) - Test planning, E2E testing, bug reporting, Phase 1 MVP validation
- **Security Agent** (`@.cursor/rules/security.mdc`) - Semgrep analysis, FERPA compliance, vulnerability detection

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
1. **Product Agent** creates user story and acceptance criteria
2. **Developer Agent** implements technical solution
3. **QA Agent** creates test cases and validates implementation
4. **Security Agent** reviews for vulnerabilities and FERPA compliance

### Bug Fix Workflow
1. **QA Agent** reports bug with reproduction steps
2. **Developer Agent** implements fix
3. **Security Agent** validates fix doesn't introduce vulnerabilities
4. **QA Agent** validates fix and regression testing

### Architecture Changes Workflow
1. **Developer Agent** designs solution and creates ADR
2. **Developer Agent** implements architecture
3. **Security Agent** reviews security implications
4. **QA Agent** validates architecture changes

## Agent Handoff Checklists

### Product → Developer
- [ ] User story with clear acceptance criteria
- [ ] Priority level (P0/P1/P2) assigned
- [ ] Louisiana educator context included
- [ ] Platform-agnostic requirements specified

### Developer → QA
- [ ] Implementation complete and tested locally
- [ ] Code follows Pelican AI standards
- [ ] Error handling implemented
- [ ] Accessibility considerations addressed

### QA → Security
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
- **[Design System](src/lib/design-system.ts)** - Design tokens and utilities
- **[Test Suite](scripts/README.md)** - Testing documentation and protocols

## Test User Credentials

**Test User for Manual Testing:**
- Email: rplapointjr@gmail.com
- Password: Password123!

*Note: This test user has been validated for manual testing of form submissions and UI functionality. Use for testing authentication flows, form submissions, and user-facing features.*