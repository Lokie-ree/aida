# Branding Alignment Note
## Planning vs. Implementation

**Created:** October 8, 2025  
**Purpose:** Clarify branding differences between planning documents and final implementation

---

## Executive Summary

The planning documents in this directory (v0.4.0) were created in early October 2025 **before final branding decisions**. The platform has since been branded as **"Pelican AI"** with a distinct visual identity centered around Louisiana's state bird.

**Key Takeaway:** When reading these planning documents, mentally replace "AI for LA Educators" with "Pelican AI" and "compass/lighthouse" with "pelican."

---

## Branding Changes

### Platform Name
- **Planning:** "AI for LA Educators Platform"
- **Final:** **"Pelican AI"**
- **Rationale:** More memorable, Louisiana-specific, and distinctive

### Tagline
- **Planning:** Various iterations
- **Final:** **"Navigate AI with Confidence"** / **"Your AI Guidance Partner"**
- **Usage:** "Navigate AI with Confidence" for hero sections, "Your AI Guidance Partner" for branding

### Logo Concept
- **Planning:** Compass/lighthouse (guidance symbolism)
- **Final:** **Pelican silhouette** (Louisiana's state bird)
- **Rationale:** Stronger Louisiana connection, unique identity, pelican symbolizes guidance and protection

### Color Palette

#### Primary Color
- **Planning:** Generic Blue `#3B82F6`
- **Final:** **Pelican Blue `#0ea5e9`** (sky blue, brighter)
- **Why:** More distinctive, evokes Louisiana coastal skies

#### Secondary Color
- **Planning:** Louisiana Gold `#FBBF24`
- **Final:** **Louisiana Gold `#f59e0b`** ✓ (matches)
- **Why:** Consistent with planning

#### Accent Color
- **Planning:** Success Green `#10B981`
- **Final:** **Success Green `#10B981`** ✓ (matches)
- **Why:** Consistent with planning

### Typography
- **Planning:** Lexend (primary), Poppins (headings), JetBrains Mono (code)
- **Final:** **Same** ✓
- **Why:** Excellent choices, no changes needed

### Domain
- **Planning:** TBD or example domains
- **Final:** **pelicanai.org**

---

## Technical Changes

### Authentication
- **Planning:** Convex Auth (`@convex-dev/auth`)
- **Final:** **Better Auth** (`@convex-dev/better-auth` + `better-auth`)
- **Why:** Better ecosystem, more flexible, Convex recommendation
- **Reference:** [ADR 004](../decisions/004-migrate-to-better-auth.md)

### Component Structure
- **Planning:** Flat structure in `src/components/`
- **Final:** **Organized structure:**
  - `auth/` - Authentication components
  - `community/` - Community features (testimonials, innovations)
  - `dashboard/` - Dashboard views
  - `framework/` - Framework display components
  - `shared/` - Shared components (Logo, LandingPage, etc.)
  - `legacy/` - Legacy A.I.D.A. components
  - `ui/` - shadcn/ui components
- **Why:** Better organization, clearer separation of concerns

### Design System Implementation
- **Planning:** Theoretical design tokens
- **Final:** **Implemented** at `src/lib/design-system.ts`
- **Why:** Actual implementation with TypeScript types

---

## What Stayed the Same ✓

These aspects from planning were implemented as designed:

1. **Core Concept:** Framework-based guidance (atomic notes)
2. **Two Hubs:** AI Basics Hub + Instructional Expert Hub
3. **Louisiana Focus:** Standards alignment, educator rubric
4. **Platform-Agnostic:** Works with any AI tool
5. **Community Features:** Innovations, testimonials, time tracking
6. **Beta Program:** 50 educators, 3-month structured program
7. **Typography:** Lexend, Poppins, JetBrains Mono
8. **Accessibility:** WCAG 2.1 Level AA compliance
9. **Technology Stack:** React, TypeScript, Convex, Tailwind CSS
10. **Design Principles:** Educator-first, clarity over complexity

---

## Document-Specific Notes

### Design System (01-design-system.md)
- **Update:** Replace `#3B82F6` with `#0ea5e9` (Pelican Blue)
- **Update:** Replace "compass rose" with "pelican silhouette"
- **Keep:** Everything else is accurate

### User Flows (02-user-flows.md)
- **Keep:** All flows are accurate
- **Update:** Mental replace "AI for LA Educators" with "Pelican AI"

### Architecture (architecture-output.md)
- **Update:** Replace "Convex Auth" with "Better Auth"
- **Update:** Replace "compass/lighthouse" with "pelican"
- **Keep:** Overall architecture is accurate

### Product Requirements (product-requirements.md)
- **Keep:** Requirements are still valid
- **Update:** Brand identity section needs Pelican AI branding

---

## Quick Reference Table

| Aspect | Planning | Final | Status |
|--------|----------|-------|--------|
| **Name** | AI for LA Educators | **Pelican AI** | Changed |
| **Logo** | Compass/Lighthouse | **Pelican** | Changed |
| **Primary Color** | #3B82F6 | **#0ea5e9** | Changed |
| **Secondary Color** | #FBBF24 | **#f59e0b** | Same ✓ |
| **Fonts** | Lexend, Poppins, JetBrains Mono | **Same** | Same ✓ |
| **Auth** | Convex Auth | **Better Auth** | Changed |
| **Components** | Flat structure | **Organized** | Changed |
| **Core Concept** | Framework-based | **Same** | Same ✓ |
| **Louisiana Focus** | Yes | **Yes** | Same ✓ |

---

## Where to Find Current Information

### Branding
- **Brand Guidelines:** [docs/PELICAN_AI_BRAND_GUIDELINES.md](../PELICAN_AI_BRAND_GUIDELINES.md)
- **Design System Code:** [src/lib/design-system.ts](../../src/lib/design-system.ts)

### Architecture
- **Current Architecture:** [ARCHITECTURE.md](../../ARCHITECTURE.md)
- **Architecture Decisions:** [docs/decisions/](../decisions/)

### Implementation
- **README:** [README.md](../../README.md)
- **Changelog:** [CHANGELOG.md](../../CHANGELOG.md)

---

## For Developers

When implementing features based on these planning documents:

1. ✅ **Use the planning documents** for user flows, feature requirements, and design patterns
2. ⚠️ **Replace branding** with Pelican AI identity (colors, logo, name)
3. ⚠️ **Use Better Auth** instead of Convex Auth
4. ⚠️ **Follow organized component structure** (auth/, community/, etc.)
5. ✅ **Reference current docs** for technical implementation details

---

## Conclusion

The planning documents remain **highly valuable** for understanding:
- User flows and interaction patterns
- Feature requirements and specifications
- Design principles and accessibility standards
- Technical architecture and data models

Simply apply the branding updates (Pelican AI, pelican logo, Pelican Blue color) when implementing features based on these plans.

**The core vision and functionality remain unchanged—only the branding evolved.**

---

**For questions about branding alignment, see:**
- [docs/PELICAN_AI_BRAND_GUIDELINES.md](../PELICAN_AI_BRAND_GUIDELINES.md)
- [ALIGNMENT_SUMMARY.md](../../ALIGNMENT_SUMMARY.md)
