# ADR 006: Beta Authentication Flow Investigation

**Date:** October 9, 2025  
**Status:** ✅ **RESOLVED** - Authentication Flow Working  
**Deciders:** Development Team  

---

## Context

During Phase 5 implementation, we encountered critical issues with the beta acceptance flow:

1. **User Account Creation Failure**: Beta signup creates `betaSignups` record but fails to create actual user account in Better Auth
2. **Authentication State Mismatch**: User remains on landing page after successful authentication
3. **Profile Initialization Failure**: `userProfiles` and `betaProgram` tables remain empty despite user authentication
4. **Deployment URL Issues**: `createUserAccountFromBetaSignup` action calling wrong deployment URL

**Impact:** Beta users cannot complete the signup-to-dashboard flow, blocking beta program launch.

---

## Investigation Results

### Root Cause Analysis

#### Issue 1: CORS Configuration
- **Problem**: `AuthModal.tsx` showing "Failed to fetch" errors
- **Cause**: Missing localhost URLs in `trustedOrigins` in `convex/auth.ts`
- **Fix Applied**: ✅ Added `http://localhost:5173` and `http://localhost:3000` to trusted origins

#### Issue 2: Deployment URL Mismatch
- **Problem**: `createUserAccountFromBetaSignup` calling hardcoded URL instead of current deployment
- **Cause**: Using `https://kindly-setter-935.convex.site` instead of `${process.env.CONVEX_SITE_URL}`
- **Fix Applied**: ✅ Updated to use environment variable

#### Issue 3: Auto-initialization Logic
- **Problem**: New users not getting profiles initialized automatically
- **Cause**: Condition `!betaStatus` checking for falsy instead of `null`
- **Fix Applied**: ✅ Changed to `betaStatus === null`

#### Issue 4: Validator Errors
- **Problem**: `ReturnsValidationError` in `getBetaSignupById` query
- **Cause**: Return validator missing `_creationTime`, `betaProgramId`, and `signupDate` fields
- **Fix Applied**: ✅ Updated validator to include all fields

### Current Status

#### ✅ Fixed Issues
- CORS configuration for local development
- Deployment URL usage in user account creation
- Auto-initialization condition logic
- Query validator completeness
- UI enhancements for better user feedback

#### ✅ **RESOLVED** Issues
- **User Account Creation**: ✅ Working - users created via `createUserDirectly` mutation
- **Authentication Recognition**: ✅ Working - proper session management with `authClient.useSession()`
- **Profile Initialization**: ✅ Working - profiles auto-created via triggers and manual creation
- **Dashboard Access**: ✅ Working - users properly authenticated and redirected to dashboard

---

## Technical Analysis

### Authentication Flow Investigation

1. **Beta Signup**: ✅ Working - creates `betaSignups` record
2. **User Account Creation**: ✅ Working - users created via `createUserDirectly` mutation
3. **JWT Token Generation**: ✅ Working - tokens generated successfully
4. **Convex Client Recognition**: ✅ Working - proper session management implemented
5. **Profile Initialization**: ✅ Working - profiles auto-created via triggers and manual creation

### Database State Analysis

**Current Database State:**
- `betaSignups`: ✅ Records created for beta signups
- `users`: ✅ Records created in Better Auth table
- `userProfiles`: ✅ Records auto-created via triggers
- `betaProgram`: ✅ Records auto-created via triggers
- `sessions`: ✅ Active sessions managed by Better Auth

**Expected Database State:**
- `betaSignups`: ✅ Records created for beta signups
- `users`: ✅ Records created in Better Auth table
- `userProfiles`: ✅ Records auto-created via triggers
- `betaProgram`: ✅ Records auto-created via triggers
- `sessions`: ✅ Active sessions managed by Better Auth

---

## Resolution Summary

### Key Solutions Implemented

1. **Internal API Workaround**
   - Created `createUserDirectly` mutation to bypass broken HTTP endpoints
   - Users created via `auth.api.signUpEmail()` with manual profile creation
   - Triggers don't fire with internal API calls, so manual creation implemented

2. **CORS Configuration Fix**
   - Added `http://localhost:5175` to `trustedOrigins` in Better Auth config
   - Fixed `baseURL` to use frontend URL instead of Convex backend URL
   - Proper cross-domain plugin configuration

3. **Session Management Update**
   - Replaced deprecated `loggedInUser` query with `authClient.useSession()`
   - Updated all references to use modern Better Auth session hooks
   - Proper authentication state management

4. **Database Migration**
   - Added `authId` field to `userProfiles` table for Better Auth 0.9 compatibility
   - Updated triggers to use both `userId` (legacy) and `authId` (new pattern)
   - Migration functions implemented for existing data

### Technical Implementation

**Files Modified:**
- `convex/auth.ts` - Better Auth configuration, triggers, and `createUserDirectly` mutation
- `convex/betaSignup.ts` - Updated to use internal mutation instead of HTTP API
- `src/components/auth/AuthModal.tsx` - Fixed authentication flow and error handling
- `src/App.tsx` - Updated to use `authClient.useSession()`
- `convex/schema.ts` - Added `authId` field to `userProfiles` table

---

## Consequences

### Positive
- ✅ **Authentication Flow Working**: Complete signup-to-dashboard flow functional
- ✅ **CORS Issues Resolved**: Local development authentication working
- ✅ **UI Improvements**: Better user feedback and error handling
- ✅ **Code Quality**: Fixed validator errors and logic issues
- ✅ **Modern Session Management**: Updated to use Better Auth 0.9 patterns
- ✅ **Database Consistency**: All tables properly populated and synchronized
- ✅ **Beta Program Ready**: Can now onboard beta users successfully

### Negative
- **Technical Debt**: Had to implement workaround for Better Auth HTTP endpoint issues
- **Complexity**: Internal API approach adds complexity vs. standard HTTP flow

### Neutral
- **Learning**: Deep understanding of Better Auth + Convex integration
- **Documentation**: Comprehensive investigation record created
- **Future Improvements**: Can optimize to use HTTP endpoints when Better Auth fixes are available

---

## Risk Assessment

### Low Risk
- **Beta Program Ready**: Authentication flow working, can launch beta program
- **User Experience**: Smooth signup-to-dashboard flow
- **Code Quality**: Investigation improved overall code quality
- **Documentation**: Well-documented investigation process

### Future Considerations
- **HTTP Endpoint Optimization**: Can migrate back to HTTP endpoints when Better Auth fixes are available
- **Performance Monitoring**: Monitor internal API approach for any performance issues

---

## Success Criteria

### ✅ **ACHIEVED**
- [x] User account creation working in Better Auth
- [x] User authentication recognized by Convex client
- [x] Auto-initialization of user profiles and beta program records
- [x] Complete signup-to-dashboard flow functional

### ✅ **COMPLETED**
- [x] Comprehensive error handling and user feedback
- [x] Documentation for troubleshooting similar issues

---

## Review Date

**Status:** ✅ **COMPLETED** - October 10, 2025  
**Final Review Criteria Met:**
- ✅ Beta signup-to-dashboard flow working end-to-end
- ✅ All database tables properly populated
- ✅ User authentication state correctly managed
- ✅ Beta program ready for launch

**Next Review:** Monitor for any performance issues with internal API approach (ongoing)

---

## References

- [Better Auth Documentation](https://www.better-auth.com/)
- [Convex + Better Auth Integration](https://convex-better-auth.netlify.app/)
- [Previous Investigation Logs](convex/logs/)
- [Database Schema](../convex/schema.ts)
- [Authentication Configuration](../convex/auth.ts)
