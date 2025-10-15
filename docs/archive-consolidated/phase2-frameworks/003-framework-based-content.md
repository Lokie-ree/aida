# ADR 003: Framework-Based Content Structure

**Date:** October 5, 2025  
**Status:** ✅ Accepted  
**Deciders:** Product Manager, Content Strategy Lead

---

## Context

Louisiana educators need practical, actionable AI guidance. We must decide how to structure and deliver this content.

**Key Requirements:**
- Easy to discover and use
- Louisiana standards-aligned
- Scalable content creation
- Measurable impact
- Ethical guidance included

---

## Decision

Use a **"Framework" (Atomic Note) structure** for all AI guidance content.

Each framework is a self-contained unit with:
- **Challenge:** The educator's problem
- **Solution:** Step-by-step guidance
- **Sample Prompt:** Copy-paste ready
- **Ethical Guardrail:** Responsible use guidance
- **Tips & Variations:** Additional context

---

## Rationale

### Content Quality
- ✅ **Self-Contained:** Each framework stands alone
- ✅ **Actionable:** Copy-paste prompts reduce friction
- ✅ **Ethical:** Built-in guardrails prevent misuse
- ✅ **Measurable:** Track usage and time saved per framework

### Scalability
- ✅ **Modular:** Easy to add new frameworks
- ✅ **Reusable:** Frameworks can be combined
- ✅ **Maintainable:** Update individual frameworks independently
- ✅ **Community-Driven:** Educators can share innovations

### Louisiana Alignment
- ✅ **Standards-Tagged:** Each framework tagged with LA standards
- ✅ **LER-Aligned:** Mapped to Louisiana Educator Rubric domains
- ✅ **Context-Specific:** Louisiana-focused examples and language

---

## Alternatives Considered

### 1. Traditional Course Structure
- **Pros:** Familiar format, sequential learning
- **Cons:** Time-intensive, not task-focused, hard to maintain
- **Why Not:** Educators need just-in-time help, not courses

### 2. AI Chatbot Only
- **Pros:** Flexible, conversational, personalized
- **Cons:** Inconsistent quality, no guardrails, hard to measure
- **Why Not:** Trust concerns, need vetted guidance first

### 3. Tool Recommendations
- **Pros:** Direct solutions, vendor partnerships
- **Cons:** Tool-dependent, vendor lock-in, not guidance-focused
- **Why Not:** We're guidance-first, not tool-first

### 4. Video Tutorials
- **Pros:** Engaging, visual learning
- **Cons:** Time-consuming to create, hard to update, not searchable
- **Why Not:** Text-based is faster to create and consume

---

## Content Organization

### Two Hubs

**AI Basics Hub** (For beginners)
- Teacher productivity
- Communication
- Administrative tasks
- Time-saving workflows

**Instructional Expert Hub** (For experienced educators)
- Louisiana standards alignment
- Differentiation strategies
- Assessment design
- Curriculum development

### Framework Structure

```markdown
# [Framework Title]

**ID:** AIB-001 or IEH-001
**Category:** teacher-productivity
**Tags:** email, communication, parent
**Time Estimate:** 10 minutes
**Difficulty:** Beginner

## The Challenge
[Educator's problem statement]

## The AI-Powered Solution
[Step-by-step guidance]

## Sample Prompt
[Copy-paste ready prompt with placeholders]

## Ethical Guardrail
[Responsible use guidance]

## Tips & Variations
[Additional context and variations]

## Louisiana Alignment
- Standards: [LA standards]
- LER Domains: [Educator rubric domains]
- Platform Compatibility: [AI tools that work]
```

---

## Consequences

### Positive
- ✅ Fast content creation (1-2 hours per framework)
- ✅ Easy for educators to use (copy-paste prompts)
- ✅ Measurable impact (track usage and time saved)
- ✅ Scalable (community can contribute)
- ✅ Ethical (guardrails built-in)

### Negative
- ⚠️ Requires consistent quality control
- ⚠️ Need process for vetting community contributions
- ⚠️ Must keep frameworks updated as AI tools evolve

### Neutral
- Need content creation workflow
- Should establish review process
- Must train content creators on format

---

## Success Metrics

### Content Quality
- [ ] 10+ frameworks at beta launch (5 per hub)
- [ ] All frameworks Louisiana-aligned
- [ ] All frameworks include ethical guardrails
- [ ] Average 4+ star rating from educators

### Usage Metrics
- [ ] 3+ frameworks tried per educator per week
- [ ] 80%+ find prompts helpful
- [ ] Average 15+ minutes saved per framework
- [ ] 20+ community innovations shared

---

## Implementation Notes

### Beta Launch (10 frameworks)
- 5 AI Basics Hub frameworks
- 5 Instructional Expert Hub frameworks
- Focus on high-impact, common use cases
- All frameworks vetted by Louisiana educators

### Post-Beta Expansion
- Add 2-3 frameworks per week
- Community contribution process
- Quarterly review and updates
- Expand to additional categories

---

## Review Date

**Next Review:** After beta launch (3 months)  
**Criteria for Review:**
- Framework usage patterns
- Educator feedback and ratings
- Time saved metrics
- Community contribution volume

---

## References

- [Philosophy Document](../planning/v0.4.0/specs/philosophy.md)
- [Product Requirements](../planning/v0.4.0/product-requirements.md)
- [Content Strategy](../planning/v0.4.0/specs/philosophy.md#atomic-note-template)
