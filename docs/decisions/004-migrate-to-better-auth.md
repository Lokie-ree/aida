# ADR 004: Migrate from Convex Auth to Better Auth

**Status:** ✅ Completed  
**Date:** October 6, 2025  
**Deciders:** Development Team  
**Technical Story:** Migrate authentication to Better Auth following official Convex integration guide

## Context

The project currently uses `@convex-dev/auth` for authentication, but we need to migrate to Better Auth (`@convex-dev/better-auth` + `better-auth`) for several reasons:

1. **Better ecosystem integration** - Better Auth has broader community support and more providers
2. **More flexible authentication** - Support for multiple auth strategies (email/password, OAuth, magic links)
3. **Better TypeScript support** - Improved type safety and developer experience
4. **Convex recommendation** - Better Auth is the recommended auth solution for Convex apps
5. **Already installed** - `@convex-dev/better-auth` and `better-auth` are already in dependencies

## Decision

We will migrate from Convex Auth to Better Auth in a phased approach:

### Phase 1: Cleanup (✅ Completed)
- ✅ Remove `@convex-dev/auth` from package.json
- ✅ Remove `authTables` import from schema.ts
- ✅ Delete convex/auth.config.ts (old format)
- ✅ Keep `@convex-dev/better-auth` configured in convex.config.ts

### Phase 2: Better Auth Configuration (✅ Completed - Oct 6, 2025)
- ✅ Create `convex/auth.config.ts` with Better Auth provider config
- ✅ Implement `convex/auth.ts` following official documentation
- ✅ Configure email/password authentication (no verification for beta)
- ✅ Set up HTTP routes in `convex/http.ts` with CORS support
- ✅ Create frontend auth client in `src/lib/auth-client.ts`
- ✅ Update `src/main.tsx` to use `ConvexBetterAuthProvider`
- ✅ Create comprehensive setup documentation

**Reference:** [Convex + Better Auth React Guide](https://convex-better-auth.netlify.app/framework-guides/react)

### Phase 3: Frontend Migration (✅ Completed - Oct 6, 2025)
- ✅ Update AuthModal.tsx to use Better Auth client
- ✅ Update SignInForm.tsx to use Better Auth
- ✅ Update SignOutButton.tsx to use Better Auth
- ✅ Test authentication flow end-to-end
- ✅ Update App.tsx branding to EdCoachAI
- ✅ Connect all CTAs to authentication modal

### Phase 4: Backend Migration (✅ Completed - Oct 6, 2025)
- ✅ Update all authentication checks to use Better Auth
- ✅ Update security.ts to use Better Auth helper
- ✅ Update spaces.ts, documents.ts, chat.ts, feedback.ts, rag.ts, vapi.ts
- ✅ Remove all remaining old auth references
- ✅ Fix design token compatibility issues

## Results

### ✅ Migration Complete
The Better Auth migration has been successfully completed with the following achievements:

1. **Full Authentication Flow**: Users can sign up, sign in, and sign out seamlessly
2. **UI Integration**: All CTAs properly open the authentication modal
3. **Backend Compatibility**: All existing functions work with Better Auth
4. **Error Resolution**: Fixed console errors and design token issues
5. **Clean Codebase**: Removed test components and old auth references

### 🔧 Technical Implementation
- **Better Auth Component**: Configured with email/password authentication
- **Database Schema**: Updated to work with Better Auth's automatic table management
- **Frontend Client**: React components using Better Auth client
- **HTTP Routes**: CORS-enabled authentication endpoints
- **Error Handling**: Proper error messages and user feedback

### 📊 Testing Results
- ✅ User registration working
- ✅ User authentication working  
- ✅ Session management working
- ✅ UI/UX flow working
- ✅ No console errors
- ✅ All CTAs functional

## Next Steps

With authentication complete, the project is ready for **Phase 5: Implementation** which includes:
- Database schema extension for full application features
- Core business logic implementation
- Advanced UI components
- Integration testing
- [ ] Add user profile management

## Implementation Details

### Backend Files Created/Updated
- `convex/auth.config.ts` - Auth provider configuration
- `convex/auth.ts` - Better Auth instance with email/password
- `convex/http.ts` - HTTP route registration with CORS
- `convex/schema.ts` - User tables managed by Better Auth component

### Frontend Files Created/Updated
- `src/lib/auth-client.ts` - Better Auth client with Convex plugins
- `src/main.tsx` - ConvexBetterAuthProvider setup

### Documentation Created
- `docs/BETTER_AUTH_SETUP.md` - Complete setup and usage guide

### Environment Variables Required
- `BETTER_AUTH_SECRET` - Secret for encryption/hashing
- `SITE_URL` - Application URL (http://localhost:5173 for dev)
- `VITE_CONVEX_SITE_URL` - Convex site URL ending in `.convex.site`

## Consequences

### Positive
- ✅ **Modern auth solution** with better DX and community support
- ✅ **Official integration guide** followed for proper setup
- ✅ **More authentication options** available for future features
- ✅ **Better session management** with cross-domain support
- ✅ **Simplified codebase** with one auth solution
- ✅ **CORS support** for client-side framework compatibility
- ✅ **Comprehensive documentation** for team and future reference

### Negative
- ⚠️ **Breaking changes** - Requires updating all auth-related code
- ⚠️ **Migration effort** - Need to update frontend components
- ⚠️ **Testing required** - Must verify all auth flows work correctly
- ⚠️ **Temporary partial state** - Auth backend ready but frontend not fully migrated

### Neutral
- **Learning curve** - Team needs to learn Better Auth API (well documented)
- **Documentation update** - Need to update auth-related docs (completed)

## Current State

**Auth Backend: ✅ Complete**
- Better Auth is fully configured and ready to use
- HTTP routes registered with CORS support
- Email/password authentication enabled (no verification for beta)
- Component provides user, session, account, and verification tables

**Auth Frontend: 🟡 Partial**
- Provider configured in main.tsx
- Auth client created and exported
- Components still using old auth hooks (need migration)

**Beta Signup: ✅ Working**
- Landing page beta signup works without authentication
- Email collection and storage functional
- Can continue beta signups while migrating auth

## Files Modified

### Backend
- `convex/auth.config.ts` - Created (new Better Auth format)
- `convex/auth.ts` - Completely rewritten following official guide
- `convex/http.ts` - Updated to register Better Auth routes
- `convex/schema.ts` - User tables managed by component

### Frontend
- `src/lib/auth-client.ts` - Created with Better Auth client
- `src/main.tsx` - Updated to use ConvexBetterAuthProvider

### Documentation
- `docs/BETTER_AUTH_SETUP.md` - Created comprehensive guide

## Files Needing Future Updates

### Frontend Components (Phase 3)
- `src/components/AuthModal.tsx` - Use `authClient` from `@/lib/auth-client`
- `src/SignInForm.tsx` - Use `authClient.signIn.email()`
- `src/SignOutButton.tsx` - Use `authClient.signOut()`
- `src/App.tsx` - Use `api.auth.getCurrentUser`

### Backend Functions (Phase 4)
- `convex/security.ts` - Use Better Auth session checks
- `convex/spaces.ts` - Use Better Auth user IDs
- `convex/documents.ts` - Use Better Auth user IDs
- `convex/chat.ts` - Use Better Auth user IDs
- `convex/rag.ts` - Use Better Auth user IDs
- `convex/email.ts` - Use Better Auth user data
- `convex/feedback.ts` - Use Better Auth user IDs
- `convex/vapi.ts` - Use Better Auth user IDs

## References

- [Convex + Better Auth Official Documentation](https://convex-better-auth.netlify.app/framework-guides/react)
- [Better Auth Documentation](https://www.better-auth.com/)
- [Better Auth with Resend](https://www.better-auth.com/docs/integrations/resend)
- [Convex Components](https://docs.convex.dev/components)

## Notes

- Better Auth is configured as a Convex component
- User, session, account, and verification tables are automatically managed
- Email/password authentication configured without email verification for beta
- Cross-domain and Convex plugins enabled for proper client-side operation
- CORS enabled in HTTP routes for client-side framework compatibility
- Auth can be tested once frontend components are migrated
- Beta signup flow continues to work independently
