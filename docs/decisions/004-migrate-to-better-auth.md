# ADR 004: Migrate from Convex Auth to Better Auth

**Status:** In Progress  
**Date:** October 5, 2025  
**Deciders:** Development Team  
**Technical Story:** Prepare for Better Auth migration by removing Convex Auth dependencies

## Context

The project currently uses `@convex-dev/auth` for authentication, but we need to migrate to Better Auth (`@convex-dev/better-auth` + `better-auth`) for several reasons:

1. **Better ecosystem integration** - Better Auth has broader community support and more providers
2. **More flexible authentication** - Support for multiple auth strategies (email/password, OAuth, magic links)
3. **Better TypeScript support** - Improved type safety and developer experience
4. **Convex recommendation** - Better Auth is the recommended auth solution for Convex apps
5. **Already installed** - `@convex-dev/better-auth` and `better-auth` are already in dependencies

## Decision

We will migrate from Convex Auth to Better Auth in a phased approach:

### Phase 1: Cleanup (Completed)
- ✅ Remove `@convex-dev/auth` from package.json
- ✅ Remove `authTables` import from schema.ts
- ✅ Replace convex/auth.ts with Better Auth placeholder
- ✅ Delete convex/auth.config.ts (no longer needed)
- ✅ Keep `@convex-dev/better-auth` configured in convex.config.ts

### Phase 2: Better Auth Configuration (Next Steps)
- [ ] Configure Better Auth providers (email/password for beta signup)
- [ ] Set up Better Auth endpoints in Convex
- [ ] Configure session management
- [ ] Add Better Auth schema tables

### Phase 3: Frontend Migration (Future)
- [ ] Update AuthModal.tsx to use Better Auth hooks
- [ ] Update SignInForm.tsx to use Better Auth
- [ ] Update SignOutButton.tsx to use Better Auth
- [ ] Update main.tsx ConvexAuthProvider → Better Auth provider
- [ ] Test authentication flow end-to-end

### Phase 4: Backend Migration (Future)
- [ ] Update all `getAuthUserId()` calls to use Better Auth session
- [ ] Update security.ts to use Better Auth
- [ ] Update spaces.ts, documents.ts, chat.ts, etc.
- [ ] Remove all remaining Convex Auth imports

## Consequences

### Positive
- **Modern auth solution** with better DX and community support
- **More authentication options** for future features
- **Better session management** and security
- **Simplified codebase** with one auth solution
- **Email integration ready** - Works seamlessly with Resend for beta signup emails

### Negative
- **Breaking changes** - Requires updating all auth-related code
- **Migration effort** - Need to update frontend and backend
- **Testing required** - Must verify all auth flows work correctly
- **Temporary auth disabled** - Auth is currently non-functional until Phase 2 is complete

### Neutral
- **Learning curve** - Team needs to learn Better Auth API
- **Documentation update** - Need to update auth-related docs

## Current State

**Auth is currently disabled** as we've removed Convex Auth but haven't fully configured Better Auth yet. This is acceptable because:

1. The landing page with beta signup doesn't require authentication
2. The beta signup flow uses a simple email collection (no auth needed)
3. We can complete the Better Auth setup before enabling authenticated features

## Files Modified

- `convex/schema.ts` - Removed `authTables` import
- `convex/auth.ts` - Replaced with Better Auth placeholder
- `convex/auth.config.ts` - Deleted (no longer needed)
- `package.json` - Removed `@convex-dev/auth` dependency
- `convex/convex.config.ts` - Already has Better Auth configured

## Files Needing Future Updates

### Frontend
- `src/components/AuthModal.tsx`
- `src/SignInForm.tsx`
- `src/SignOutButton.tsx`
- `src/main.tsx`

### Backend
- `convex/security.ts`
- `convex/spaces.ts`
- `convex/documents.ts`
- `convex/chat.ts`
- `convex/rag.ts`
- `convex/email.ts`
- `convex/feedback.ts`
- `convex/vapi.ts`

## References

- [Better Auth Documentation](https://www.better-auth.com/)
- [Convex Better Auth Integration](https://docs.convex.dev/auth/better-auth)
- [Better Auth with Resend](https://www.better-auth.com/docs/integrations/resend)

## Notes

- Better Auth is already configured in `convex.config.ts` via `@convex-dev/better-auth`
- The `better-auth` package (v1.3.8) is already installed
- This migration aligns with the Resend email integration for beta signups
- Auth can remain disabled until we're ready to implement authenticated features
