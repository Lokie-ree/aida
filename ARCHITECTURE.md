# Architecture

**AI for LA Educators - Technical Architecture**

*Last Updated: October 5, 2025*

---

## Overview

AI for LA Educators extends the existing A.I.D.A. codebase to provide Louisiana educators with curated AI guidance through a framework-based approach.

**Core Philosophy:** Evolution, not revolution. We build upon proven infrastructure while adding new features aligned with our educator empowerment mission.

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
- **Convex Auth** - Authentication (Better Auth)
- **OpenAI API** - AI capabilities
- **Resend** - Email service

### Design System
- **Fonts:** Lexend (primary), Poppins (headings), JetBrains Mono (code)
- **Colors:** Louisiana Gold (#FBBF24), Primary Blue, Accent Green
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

**Existing (from A.I.D.A.):**
- `users` - User accounts and profiles
- `authSessions` - Authentication sessions
- `documents` - Uploaded documents
- `chatMessages` - Chat history
- `spaces` - Collaborative spaces (will be refactored)

**New (for AI for LA Educators):**
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
- `convex/auth.ts` - Authentication
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
├── LandingPage (unauthenticated)
└── Authenticated
    ├── Dashboard
    │   ├── StatsGrid
    │   ├── QuickStart (FrameworkCard[])
    │   ├── CommunityPreview
    │   └── TimeSavingsTracker
    ├── FrameworkLibrary
    │   ├── SearchFilters
    │   └── FrameworkCard[]
    ├── FrameworkDetail
    │   ├── FrameworkContent
    │   ├── CopyPromptButton
    │   └── FeedbackModal
    └── CommunityHub
        ├── InnovationsList
        └── TestimonialsList
```

### State Management
- **Convex Queries:** Real-time data fetching
- **React Context:** Theme, auth state
- **Local State:** UI interactions, forms

---

## Security & Privacy

### Authentication
- Email/password via Convex Auth
- Session management with Better Auth
- Role-based access (user, admin)

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

1. **Use Convex for Backend** - Real-time, serverless, simplified architecture
2. **Extend A.I.D.A. Codebase** - Faster time to market, proven infrastructure
3. **Framework-Based Content** - Scalable, modular, Louisiana-aligned
4. **Beta-First Launch** - Validate with educators before scale
5. **Community-Driven** - Educators sharing with educators

---

## Migration from A.I.D.A.

### Keep & Reuse
- ✅ Convex setup and configuration
- ✅ Authentication system
- ✅ UI components (shadcn/ui)
- ✅ Design tokens and Tailwind config
- ✅ Document management (if needed)

### Refactor
- 🔄 "Spaces" concept → Framework categories
- 🔄 Chat interface → Framework-focused (future)
- 🔄 Landing page → New brand and messaging

### Remove
- ❌ Voice interface (Vapi) - Future Phase 2 feature
- ❌ Complex space collaboration - Not needed for beta
- ❌ Unused features and dependencies

---

## Future Enhancements (Post-Beta)

### Phase 2 Features
- AI-powered chat assistant
- Voice interface (Vapi integration)
- Advanced RAG with document upload
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
