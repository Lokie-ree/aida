# Contributing

**MVP Focus:** Simple guidelines for development.

## Essential Rules

1. **Never push directly to `main`** - Use feature branches
2. **Run tests before committing:** `pnpm test:once`
3. **TypeScript only** - No `any` types, strict typing
4. **FERPA compliance** - Never log PII in console/logs

## Quick Commands

```bash
# Development
pnpm dev                    # Start frontend + backend
pnpm test:once              # Run tests
pnpm lint                   # Run linter

# Deployment
npx convex deploy           # Deploy to production
npx convex dashboard        # Open Convex dashboard
```

## Code Standards

- **TypeScript:** Strict type checking, no `any`
- **Convex Functions:** Always include validators for args/returns
- **Testing:** Use `data-testid` for selectors
- **FERPA:** No PII in logs (see PROJECT.md for examples)

---

**For MVP:** Keep it simple. Focus on shipping the Alignment Scorecard experience.
