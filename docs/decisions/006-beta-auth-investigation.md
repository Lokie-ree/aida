# ADR 006: Beta Authentication Flow Investigation

**Date:** October 9, 2025  
**Status:** 🔄 Investigation Complete - Resolution Pending  
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

#### ❌ Remaining Issues
- **User Account Creation**: Still not working despite URL fix
- **Authentication Recognition**: User authenticated in Better Auth but not recognized by Convex client
- **Profile Initialization**: No user profiles or beta program records created
- **Dashboard Access**: User remains on landing page after authentication

---

## Technical Analysis

### Authentication Flow Investigation

1. **Beta Signup**: ✅ Working - creates `betaSignups` record
2. **User Account Creation**: ❌ Failing - no users in Better Auth `users` table
3. **JWT Token Generation**: ✅ Working - tokens generated successfully
4. **Convex Client Recognition**: ❌ Failing - user not recognized as authenticated
5. **Profile Initialization**: ❌ Failing - no auto-initialization triggered

### Database State Analysis

**Current Database State:**
- `betaSignups`: 1 record (approved)
- `users`: 0 records (Better Auth table)
- `userProfiles`: 0 records
- `betaProgram`: 0 records
- `sessions`: 0 records

**Expected Database State:**
- `betaSignups`: 1 record (approved)
- `users`: 1 record (Better Auth user)
- `userProfiles`: 1 record (auto-created)
- `betaProgram`: 1 record (beta status)
- `sessions`: 1+ records (active session)

---

## Next Steps

### Immediate Actions Required

1. **Debug User Account Creation**
   - Verify `createUserAccountFromBetaSignup` action is being called
   - Check Convex logs for action execution and errors
   - Test Better Auth signup API endpoint directly

2. **Investigate Deployment Environment**
   - Confirm `CONVEX_SITE_URL` environment variable is set correctly
   - Verify the action is calling the right deployment
   - Check if user account creation is happening in different deployment

3. **Test Authentication Integration**
   - Verify Better Auth and Convex client integration
   - Check if JWT tokens are being properly validated
   - Ensure user ID consistency between Better Auth and Convex

### Investigation Commands

```bash
# Check environment variables
npx convex env list

# Check logs for user account creation
npx convex logs --limit 50

# Test Better Auth endpoint directly
curl -X POST https://kindly-setter-935.convex.site/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'
```

---

## Consequences

### Positive
- ✅ **CORS Issues Resolved**: Local development authentication working
- ✅ **UI Improvements**: Better user feedback and error handling
- ✅ **Code Quality**: Fixed validator errors and logic issues
- ✅ **Investigation Complete**: Root causes identified

### Negative
- ❌ **Beta Launch Blocked**: Cannot onboard beta users
- ❌ **User Experience**: Broken signup-to-dashboard flow
- ❌ **Technical Debt**: Authentication flow needs complete resolution

### Neutral
- **Learning**: Deep understanding of Better Auth + Convex integration
- **Documentation**: Comprehensive investigation record created

---

## Risk Assessment

### High Risk
- **Beta Program Delay**: Cannot launch without working authentication
- **User Frustration**: Beta testers will encounter broken flow

### Medium Risk
- **Technical Complexity**: Better Auth integration more complex than expected
- **Deployment Issues**: Environment variable and URL configuration challenges

### Low Risk
- **Code Quality**: Investigation improved overall code quality
- **Documentation**: Well-documented investigation process

---

## Success Criteria

### Must Achieve
- [ ] User account creation working in Better Auth
- [ ] User authentication recognized by Convex client
- [ ] Auto-initialization of user profiles and beta program records
- [ ] Complete signup-to-dashboard flow functional

### Nice to Have
- [ ] Comprehensive error handling and user feedback
- [ ] Automated testing for authentication flow
- [ ] Documentation for troubleshooting similar issues

---

## Review Date

**Next Review:** After authentication flow resolution (1-2 days)  
**Criteria for Review:**
- Beta signup-to-dashboard flow working end-to-end
- All database tables properly populated
- User authentication state correctly managed
- Beta program ready for launch

---

## References

- [Better Auth Documentation](https://www.better-auth.com/)
- [Convex + Better Auth Integration](https://convex-better-auth.netlify.app/)
- [Previous Investigation Logs](convex/logs/)
- [Database Schema](../convex/schema.ts)
- [Authentication Configuration](../convex/auth.ts)
