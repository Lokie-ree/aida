# Contributing to Pelican AI

**Last Updated:** November 1, 2025

---

## Golden Rule

**Never push directly to `main`**

All changes must go through a feature branch → pull request → review → merge workflow.

---

## Code Standards

### TypeScript
- **Mandatory:** All code must be TypeScript
- **Type Safety:** Strict type checking enabled
- **No `any`:** Avoid `any` types, use proper typing

### FERPA Compliance
**Never log PII** (Personally Identifiable Information):

```typescript
// ✅ GOOD: No PII in logs
console.log("User signed up", { 
  userId: user.id, 
  timestamp: Date.now() 
});

// ❌ BAD: PII in logs (FERPA violation)
console.log("User signed up", { 
  email: user.email, 
  name: user.name,
  school: user.school 
});
```

### Convex Functions
**Always include validators** for args and returns:

```typescript
export const myFunction = mutation({
  args: {
    field: v.string(),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    // Implementation
    return { success: true };
  },
});
```

---

## Testing

**Run tests before committing:**
```bash
pnpm test:once              # Run unit tests once
pnpm test:coverage          # Generate coverage report
pnpm lint                    # Run linter
```

**CI/CD:** Tests run automatically on push/PR via [GitHub Actions](.github/workflows/test.yml)

---

## Deployment

### Manual Deployment Process

**Convex:**
```bash
npx convex deploy           # Deploy to production
npx convex dashboard        # Open Convex dashboard
```

**Vercel:**
- Deploy via Vercel dashboard (connected to GitHub)
- Preview deployments automatically created for PRs

**Note:** Automated deployment workflows will be added once deployment process is fully understood.

---

## Reporting Issues

**Linear:** https://linear.app/web-agency/team/web-agency/active

---

## Documentation

- **[PROJECT.md](../PROJECT.md)** - Project vision and current status
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture reference
- **[TESTING.md](TESTING.md)** - Complete testing documentation

---

*For detailed development history, see archived documentation.*
