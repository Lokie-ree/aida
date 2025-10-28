# Documentation Archive

**Purpose:** This directory contains historical documentation that is no longer actively maintained but preserved for reference.

**Current Status:** Phase 2 Complete (October 26, 2025) - Beta Launch Ready (30 days until launch)

**Recent Changes (November 2025):**
- Removed test data cleanup protocol (superseded by deployment-based separation)
- Consolidated agent documentation into AGENT.md
- Updated testing strategy to use Dev/Production deployment separation

---

## Archive Structure

### `/milestones/`
Completed milestone documentation representing historical achievements:
- `MILESTONE-INFRASTRUCTURE-STABLE.md` - Infrastructure stabilization (Oct 17, 2025) - **Superseded by Phase 2 completion**
- `MILESTONE-PHASE2-TESTING.md` - Phase 2 testing milestone (Oct 19, 2025) - **Superseded by Phase 2 completion**
- **Note:** These milestones documented progress toward Phase 2. Phase 2 is now complete (Oct 26, 2025). See current status in AGENT.md.

### `/reports/`
Historical reports and analysis documents:
- `TESTING-PROTOCOL-SAFETY-FIXES.md` - Testing protocol safety fixes report
- **Historical Note:** These reports document the test data isolation approach. As of November 2025, we use separate Dev/Production deployments instead of test data flags (see ADR-010 for historical context).

### `/planning/`
Historical planning documents:
- Reserved for completed planning cycles and roadmap versions

---

## Archive Guidelines

### What Gets Archived
- **Completed Milestones:** Documentation of finished phases or major achievements (Phase 2 complete Oct 26, 2025)
- **Historical Reports:** Analysis documents that were time-specific
- **Superseded Plans:** Planning documents that have been replaced by newer versions
- **Old Decision Records:** ADRs that have been superseded or are no longer relevant

### What Stays Active (Current Phase: Pre-Beta Launch)
- **Current ADRs:** Recent architectural decisions still relevant to current development (see `docs/decisions/`)
- **Core Documentation:** ARCHITECTURE.md, CONTRIBUTING.md, AGENT.md, README.md
- **Product Requirements:** PRODUCT_REQUIREMENTS_DOCUMENT.md (Version 2.0, Phase 2 complete)
- **Testing Protocol:** TESTING_PROTOCOL.md (E2E testing protocol for beta launch)
- **Reference Documentation:** Brand guidelines, deployment guides

### Archive Maintenance
- **Read-Only:** Archived documents should not be modified
- **Reference Only:** Use for historical context, not current guidance
- **Periodic Review:** Consider purging very old archives annually
- **Clear Dating:** All archived documents should have clear dates

---

## Current Active Documentation

For current project information, see:
- **[README.md](../../README.md)** - Project entry point and overview
- **[AGENT.md](../../AGENT.md)** - Agent collaboration and system status
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Technical architecture and system design
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Development workflow and guidelines
- **[Product Requirements](../PRODUCT_REQUIREMENTS_DOCUMENT.md)** - Complete product specification
- **[Brand Guidelines](../PELICAN_AI_BRAND_GUIDELINES.md)** - Design system and voice
- **[Decision Records](../decisions/)** - Current architectural decisions (ADRs)
- **[Test Suite](../../scripts/README.md)** - Testing documentation

---

**Last Updated:** November 2025  
**Current Platform Status:** Phase 2 Complete (Oct 26, 2025), Pre-Beta Launch  
**Archive Policy:** Documents archived when superseded or completed, preserved for historical reference

**Note:** Documents from October 2025 documented Phase 2 development progress. Phase 2 MVP is now complete. For current status, see AGENT.md and updated PRODUCT_REQUIREMENTS_DOCUMENT.md (Version 2.0).
