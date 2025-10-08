# Architecture

**Pelican AI - Technical Architecture**

*Last Updated: October 8, 2025*  
*Status: Phase 5 - Software Engineering (In Progress)*

---

## Overview

Pelican AI provides Louisiana educators with curated AI guidance frameworks through a platform-agnostic approach. Built on proven infrastructure, we focus on guidance rather than tools.

**Core Philosophy:** Navigate AI with confidence. We provide framework-based guidance that works with ANY AI tool educators already use, designed specifically for Louisiana standards.

---

## Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library

### Backend
- **Convex** - Real-time database + serverless functions
- **Better Auth** - Authentication (via @convex-dev/better-auth)
- **OpenAI API** - AI capabilities
- **Resend** - Email service

### Design System
- **Fonts:** Lexend (primary), Poppins (headings), JetBrains Mono (code)
- **Colors:** Pelican Blue (#0ea5e9), Louisiana Gold (#f59e0b), Deep Blue (#1e40af)
- **Standards:** WCAG 2.1 Level AA

---

## Core Concepts

### 1. Frameworks (Atomic Notes)
Self-contained guidance units with:
- **Challenge:** The educator's problem
- **Solution:** Step-by-step guidance
- **Sample Prompt:** Copy-paste ready
- **Ethical Guardrail:** Responsible use guidance

### 2. Two Hubs
- **AI Basics Hub:** For educators new to AI (productivity, communication)
- **Instructional Expert Hub:** For experienced educators (standards, differentiation)

### 3. Community Features
- **Innovations:** Educators sharing creative AI uses
- **Testimonials:** Success stories and impact
- **Time Tracking:** Measure efficiency gains

### 4. Beta Program
- 50 Louisiana educators
- 3-month structured onboarding
- Weekly engagement prompts
- Community building

---

## Data Model

### Core Tables

**Existing (from legacy codebase):**
- `users` - User accounts and profiles
- `authSessions` - Authentication sessions
- `documents` - Uploaded documents (legacy feature)
- `chatMessages` - Chat history (legacy feature)
- `spaces` - Collaborative spaces (legacy feature)

**New (for Pelican AI):**
- `frameworks` - Framework content and metadata
- `frameworkUsage` - Usage tracking and analytics
- `testimonials` - Educator testimonials
- `innovations` - Community innovations
- `innovationInteractions` - Likes, tries, comments
- `betaProgram` - Beta tester tracking

### Key Relationships
```
users
  ├─→ frameworks (created by)
  ├─→ frameworkUsage (tracks usage)
  ├─→ testimonials (submits)
  ├─→ innovations (shares)
  └─→ betaProgram (participates in)

frameworks
  ├─→ frameworkUsage (usage metrics)
  └─→ testimonials (related to)
```

---

## API Structure

### Existing Modules (Reused)
- `convex/auth.ts` - Authentication (Better Auth - migrated Oct 6, 2025)
- `convex/documents.ts` - Document management
- `convex/chat.ts` - Chat functionality (may refactor)

### New Modules
- `convex/frameworks.ts` - Framework CRUD, search, usage tracking
- `convex/testimonials.ts` - Testimonial submission and approval
- `convex/innovations.ts` - Innovation sharing and interactions
- `convex/betaProgram.ts` - Beta program management

---

## Frontend Architecture

### Component Hierarchy
```
App.tsx
├── shared/LandingPage (unauthenticated)
└── Authenticated
    ├── dashboard/Dashboard
    │   ├── StatsGrid
    │   ├── QuickStart (framework/FrameworkCard[])
    │   ├── CommunityPreview
    │   └── shared/TimeSavingsTracker
    ├── framework/FrameworkLibrary
    │   ├── SearchFilters
    │   └── framework/FrameworkCard[]
    ├── framework/FrameworkDetail
    │   ├── FrameworkContent
    │   ├── CopyPromptButton
    │   └── FeedbackModal
    ├── community/CommunityHub
    │   ├── InnovationsList
    │   └── community/TestimonialCard[]
    └── auth/AuthModal
```

### State Management
- **Convex Queries:** Real-time data fetching
- **React Context:** Theme, auth state
- **Local State:** UI interactions, forms

---

## Security & Privacy

### Authentication
- Email/password via Better Auth
- Session management with Better Auth
- Role-based access (user, admin)
- Migrated from Convex Auth (Oct 6, 2025 - see ADR 004)

### Data Protection
- **FERPA Compliant:** No student PII stored
- **Educator-Controlled:** Users own their data
- **Transparent:** Clear data usage policies

### API Security
- Authentication required for all mutations
- User-scoped queries (can only see own data)
- Admin checks for sensitive operations

---

## Performance

### Frontend
- Code splitting by route
- Lazy loading for components
- Image optimization
- Tailwind CSS purging

### Backend
- Convex real-time queries (efficient)
- Database indexes on common queries
- Pagination for large lists

### Targets
- **Page Load:** < 3 seconds
- **Time to Interactive:** < 5 seconds
- **Lighthouse Score:** > 90

---

## Deployment

### Environments
- **Development:** Local (Convex dev)
- **Staging:** Convex staging deployment
- **Production:** Convex production deployment

### CI/CD
- Frontend: Vercel/Netlify
- Backend: Convex CLI deployment
- Automated testing (future)

---

## Key Architectural Decisions

For detailed rationale, see Architecture Decision Records in `docs/decisions/`:

1. **Use Convex for Backend** - Real-time, serverless, simplified architecture (ADR 001)
2. **Extend A.I.D.A. Codebase** - Faster time to market, proven infrastructure (ADR 002)
3. **Framework-Based Content** - Scalable, modular, Louisiana-aligned (ADR 003)
4. **Migrate to Better Auth** - Modern auth solution with better DX (ADR 004 - Completed Oct 6, 2025)
5. **Beta-First Launch** - Validate with educators before scale
6. **Community-Driven** - Educators sharing with educators

---

## Migration from A.I.D.A.

### Keep & Reuse
- ✅ Convex setup and configuration
- ✅ Authentication system
- ✅ UI components (shadcn/ui)
- ✅ Design tokens and Tailwind config
- ✅ Document management (if needed)

### Refactor
- ✅ "Spaces" concept → Framework categories (completed - Oct 2025)
- ✅ Chat interface → Framework-focused (completed - Oct 2025)
- ✅ Landing page → New brand and messaging (completed - Oct 2025)
- ✅ Component organization → Feature-based folders (completed - Oct 2025)
- ✅ Authentication → Better Auth migration (completed - Oct 6, 2025)

### Remove
- ✅ Voice interface (Vapi) - Moved to legacy folder
- ✅ Complex space collaboration - Moved to legacy folder
- ✅ Unused features and dependencies - Cleaned up

---

## Future Enhancements (Post-Beta)

### Phase 2 Features
- AI-powered chat assistant (legacy components available)
- Voice interface (Vapi integration - legacy components available)
- Advanced RAG with document upload (legacy components available)
- PD session booking

### Scalability
- Multi-state expansion
- Advanced analytics dashboard
- Admin content management UI
- Mobile app (React Native)

---

## References

- **Detailed Planning:** `docs/planning/v0.4.0/`
- **Implementation Guide:** `docs/planning/v0.4.0/implementation-plan.md`
- **Design System:** `docs/planning/v0.4.0/design-documentation/`
- **Decision Records:** `docs/decisions/`

---

**For implementation details, see the comprehensive documentation in `docs/planning/v0.4.0/`**
