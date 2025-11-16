# Testing Guide

**Last Updated:** November 16, 2025  
**Status:** All Tests Passing ✅

## Quick Reference

### Run Tests

```bash
# Unit tests
pnpm test:once

# E2E tests (requires dev servers running)
pnpm test:e2e --run

# With coverage
pnpm test:coverage
```

### Pre-Test Setup

- [ ] Dev server: `pnpm dev:frontend`
- [ ] Convex backend: `npx convex dev`
- [ ] Test users exist (see PROJECT.md)
- [ ] Frameworks seeded: `npx convex run seedFrameworks:seedInitialFrameworks`

## Current Status

**All Tests Passing:** ✅ 46/46 (100%)

- Framework Library: ✅ 14/14
- Community: ✅ 14/14
- Dashboard: ✅ 9/9
- Admin: ✅ 9/9

## Best Practices

1. **Use `data-testid`** for selectors (not CSS classes)
2. **Wait for elements** before interacting
3. **Test user flows**, not implementation details
4. **Run tests before committing**

## Alignment Scorecard Testing

See `convex/alignmentScorecard.test.ts` for comprehensive workflow tests.

---

**Detailed testing docs:** See `docs/archived/TESTING_ALIGNMENT_SCORECARD.md` for historical reference.
