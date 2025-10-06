# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records for AI for LA Educators.

## What is an ADR?

An Architecture Decision Record (ADR) captures an important architectural decision made along with its context and consequences.

**Format:** Each ADR follows a consistent structure:
- **Context:** What is the issue we're addressing?
- **Decision:** What did we decide?
- **Rationale:** Why did we decide this?
- **Alternatives:** What other options did we consider?
- **Consequences:** What are the results of this decision?

## Current ADRs

| ID | Title | Status | Date |
|----|-------|--------|------|
| [001](001-use-convex-backend.md) | Use Convex for Backend | ✅ Accepted | Oct 5, 2025 |
| [002](002-extend-aida-codebase.md) | Extend A.I.D.A. Codebase | ✅ Accepted | Oct 5, 2025 |
| [003](003-framework-based-content.md) | Framework-Based Content | ✅ Accepted | Oct 5, 2025 |
| [004](004-migrate-to-better-auth.md) | Migrate to Better Auth | 🔄 In Progress | Oct 5, 2025 |

## ADR Lifecycle

- **Proposed** 🔄 - Under discussion
- **Accepted** ✅ - Decision made and implemented
- **Deprecated** ⚠️ - No longer applicable
- **Superseded** 🔁 - Replaced by another ADR

## Creating a New ADR

1. Copy the template below
2. Number it sequentially (e.g., `004-title.md`)
3. Fill in all sections
4. Submit for review
5. Update this README

## Template

```markdown
# ADR [NUMBER]: [Title]

**Date:** [YYYY-MM-DD]  
**Status:** [Proposed/Accepted/Deprecated/Superseded]  
**Deciders:** [List of people involved]

---

## Context
[What is the issue we're addressing?]

---

## Decision
[What did we decide?]

---

## Rationale
[Why did we decide this?]

---

## Alternatives Considered
[What other options did we consider?]

---

## Consequences
[What are the results of this decision?]

---

## Review Date
[When will we review this decision?]

---

## References
[Links to related documents]
```

## References

- [ADR Process](https://adr.github.io/)
- [Architecture Document](../../ARCHITECTURE.md)
