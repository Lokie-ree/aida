# ADR 002: Extend A.I.D.A. Codebase Rather Than Start Fresh

**Date:** October 5, 2025  
**Status:** ✅ Accepted  
**Deciders:** System Architect, Product Manager, Engineering Lead

---

## Context

We have an existing A.I.D.A. codebase with:
- Working Convex backend (auth, database, real-time)
- React frontend with shadcn/ui components
- Design tokens and Tailwind configuration
- Some features that don't align with new vision (Voice, complex Spaces)

**Question:** Should we start fresh or extend the existing codebase?

---

## Decision

**Extend the existing A.I.D.A. codebase** with strategic cleanup and refactoring.

---

## Rationale

### Time to Market
- ✅ **2 weeks faster:** Reuse infrastructure vs. rebuild
- ✅ **Proven foundation:** Auth, database, UI already working
- ✅ **Lower risk:** Known codebase vs. unknown challenges

### Technical Debt
- ✅ **Manageable:** Can clean up during implementation
- ✅ **Strategic refactoring:** Remove unused features incrementally
- ✅ **80% alignment:** Most architecture fits new vision

### Team Efficiency
- ✅ **Familiar codebase:** Team knows A.I.D.A. structure
- ✅ **Reusable patterns:** UI components, API patterns established
- ✅ **Focus on features:** Spend time on new functionality, not infrastructure

---

## Alternatives Considered

### 1. Fresh Start (New Repository)
- **Pros:** Clean slate, no technical debt, perfect alignment
- **Cons:** 2+ weeks longer, rebuild infrastructure, higher risk
- **Why Not:** Time to market critical for beta program

### 2. Fork A.I.D.A. (Separate Repository)
- **Pros:** Clean separation, can diverge completely
- **Cons:** Lose connection to A.I.D.A. improvements, duplicate effort
- **Why Not:** Want to maintain single codebase for potential convergence

### 3. Microservices (Separate New Features)
- **Pros:** Independent deployment, clear boundaries
- **Cons:** Overcomplicated for beta, more infrastructure
- **Why Not:** Overkill for current scale

---

## Implementation Strategy

### Phase 1: Cleanup (Week 1-2)
1. **Remove unused features:**
   - Voice interface (Vapi integration)
   - Complex space collaboration features
   - Unused dependencies

2. **Refactor core concepts:**
   - "Spaces" → Framework categories
   - Simplify chat interface (or defer to Phase 2)
   - Update landing page for new brand

3. **Add new foundation:**
   - New database tables (frameworks, testimonials, etc.)
   - Seed initial framework data
   - Update design tokens

### Phase 2: New Features (Week 3-7)
4. Build new APIs and components per implementation plan
5. Integrate with existing infrastructure
6. Test and refine

---

## Consequences

### Positive
- ✅ Faster time to market (5-6 weeks vs. 7+ weeks)
- ✅ Proven infrastructure reduces risk
- ✅ Team familiar with codebase
- ✅ Can reuse UI components and patterns

### Negative
- ⚠️ Some technical debt to manage
- ⚠️ Need to refactor "Spaces" concept
- ⚠️ May have unused code temporarily

### Neutral
- Must be disciplined about cleanup
- Should document what's removed and why
- Keep option to fork later if needed

---

## Success Criteria

### Must Achieve
- [ ] Remove all unused features by end of Week 2
- [ ] New database schema implemented
- [ ] No breaking changes to existing A.I.D.A. features (if any are kept)
- [ ] Clean, maintainable code for new features

### Nice to Have
- [ ] Improved code organization
- [ ] Better test coverage
- [ ] Updated documentation

---

## Risk Mitigation

### Risk: Technical debt accumulates
- **Mitigation:** Dedicated cleanup phase (Week 1-2)
- **Mitigation:** Code review standards enforced
- **Mitigation:** Document all "TODO" items

### Risk: Breaking existing features
- **Mitigation:** Identify which A.I.D.A. features to keep
- **Mitigation:** Test existing functionality after cleanup
- **Mitigation:** Git branches for safe experimentation

### Risk: Cleanup takes longer than expected
- **Mitigation:** Time-box cleanup to 2 weeks max
- **Mitigation:** Prioritize critical removals
- **Mitigation:** Can defer non-critical cleanup

---

## Review Date

**Next Review:** End of Week 2 (after cleanup phase)  
**Criteria for Review:** 
- Cleanup completed on time?
- Technical debt manageable?
- Team velocity acceptable?

---

## References

- [Technical Foundation](../../flow/orchestrator.json#technical_foundation) - Current tech stack and architecture
- [Implementation Plan](../planning/v0.4.0/implementation-plan.md)
- [A.I.D.A. Codebase Analysis](../planning/v0.4.0/architecture-output.md)
