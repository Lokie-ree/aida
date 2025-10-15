# Developer Fix Guide - Phase 1 MVP Critical Issues

**Priority:** 🔴 URGENT - Launch Blockers  
**Total Fix Time:** 3-4 hours  
**Complexity:** Medium

---

## Quick Start

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies (if needed)
pnpm install

# 3. Start Convex dev server
npx convex dev

# 4. Open these files in your editor:
# - convex/betaSignup.ts (main fixes)
# - src/emails/BetaWelcomeEmail.tsx (email template)
# - scripts/test-unit-auth.js (test URL fix)
# - scripts/test-integration-auth-initialization.js (test URL fix)
```

---

## FIX #1: Add Temporary Password Generation (2-3 hours)

### Problem
The signup flow doesn't generate temporary passwords, so:
- User accounts aren't created
- Welcome emails don't contain credentials
- Users can't sign in

### Solution
Add password generation to `convex/betaSignup.ts`

### Step 1: Add Password Generator Helper
```typescript
// ADD THIS FUNCTION at the bottom of convex/betaSignup.ts
function generateSecurePassword(length = 16): string {
  const charset = 
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
```

### Step 2: Update `signupForBeta` Return Validator
Find line 12 and update:
```typescript
// BEFORE (line 12-16)
returns: v.object({
  success: v.boolean(),
  message: v.string(),
  signupId: v.optional(v.id("betaSignups")),
}),

// AFTER
returns: v.object({
  success: v.boolean(),
  message: v.string(),
  signupId: v.optional(v.id("betaSignups")),
  temporaryPassword: v.optional(v.string()), // ADD THIS LINE
}),
```

### Step 3: Update Duplicate Email Return
Find line 24-29 and update:
```typescript
// BEFORE
if (existingSignup) {
  return {
    success: false,
    message: "This email is already registered for the beta program.",
    signupId: undefined,
  };
}

// AFTER
if (existingSignup) {
  return {
    success: false,
    message: "This email is already registered for the beta program.",
    signupId: undefined,
    temporaryPassword: undefined, // ADD THIS LINE
  };
}
```

### Step 4: Generate Password in Handler
Find line 32 (start of success path) and add:
```typescript
// ADD THIS LINE after the duplicate check (around line 32)
// Generate secure temporary password
const temporaryPassword = generateSecurePassword();
```

### Step 5: Schedule User Account Creation
Find line 43-48 and ADD the scheduling call:
```typescript
// AFTER creating the signup (around line 41), ADD THIS:
// Schedule user account creation with temporary password
await ctx.scheduler.runAfter(
  1000,
  api.betaSignup.createUserAccountFromBetaSignup,
  {
    signupId,
    temporaryPassword,
  }
);
```

### Step 6: Update Welcome Email Call
Find line 44-48 and update:
```typescript
// BEFORE
await ctx.scheduler.runAfter(1000, api.email.sendBetaWelcomeEmail, {
  email: args.email,
  name: args.name,
  school: args.school,
});

// AFTER
await ctx.scheduler.runAfter(1000, api.email.sendBetaWelcomeEmail, {
  email: args.email,
  name: args.name,
  school: args.school,
  temporaryPassword, // ADD THIS LINE
});
```

### Step 7: Update Success Return
Find line 50-54 and update:
```typescript
// BEFORE
return {
  success: true,
  message: "Successfully signed up for the beta program! Check your email for next steps.",
  signupId,
};

// AFTER
return {
  success: true,
  message: "Successfully signed up for the beta program! Check your email for next steps.",
  signupId,
  temporaryPassword, // ADD THIS LINE
};
```

### Step 8: Update Welcome Email Template
Open `src/emails/BetaWelcomeEmail.tsx` and add temporaryPassword prop:

```typescript
// BEFORE
interface BetaWelcomeEmailProps {
  email: string;
  name?: string;
  school?: string;
}

export const BetaWelcomeEmail = ({ email, name, school }: BetaWelcomeEmailProps) => {
  // ...
}

// AFTER
interface BetaWelcomeEmailProps {
  email: string;
  name?: string;
  school?: string;
  temporaryPassword?: string; // ADD THIS LINE
}

export const BetaWelcomeEmail = ({ 
  email, 
  name, 
  school, 
  temporaryPassword 
}: BetaWelcomeEmailProps) => {
  // ... add password display in email body
}
```

### Test Fix #1
```bash
pnpm test:unit:beta-signup
pnpm test:integration:signup-flow
```

**Expected:** All tests should pass ✅

---

## FIX #2: Update `getPendingSignups` Validator (15 minutes)

### Problem
The return validator doesn't include all fields that are returned from the database.

### Solution
Update the validator in `convex/betaSignup.ts`

### Step: Update Return Validator
Find line 173-180 and update:
```typescript
// BEFORE
returns: v.array(v.object({
  _id: v.id("betaSignups"),
  email: v.string(),
  name: v.optional(v.string()),
  school: v.optional(v.string()),
  subject: v.optional(v.string()),
  signupDate: v.number(),
})),

// AFTER
returns: v.array(v.object({
  _id: v.id("betaSignups"),
  _creationTime: v.number(), // ADD THIS (system field)
  email: v.string(),
  name: v.optional(v.string()),
  school: v.optional(v.string()),
  subject: v.optional(v.string()),
  signupDate: v.number(),
  betaProgramId: v.string(), // ADD THIS
  status: v.string(), // ADD THIS
  notes: v.optional(v.string()), // ADD THIS (if field exists)
})),
```

### Test Fix #2
```bash
pnpm test:unit:beta-signup
```

**Expected:** `getPendingSignups` test should pass ✅

---

## FIX #3: Update Test URLs (10 minutes)

### Problem
Tests use `.convex.cloud` domain instead of `.convex.site` for Better Auth endpoints.

### Solution
Update test files to use correct domain

### Fix 3A: Update Unit Test
Open `scripts/test-unit-auth.js` and find the session endpoint test:

```typescript
// FIND (around line 50-60)
const sessionUrl = `${baseUrl}/api/auth/session`;

// CHANGE TO
const sessionUrl = `${process.env.VITE_CONVEX_SITE_URL}/api/auth/get-session`;
```

### Fix 3B: Update Integration Test
Open `scripts/test-integration-auth-initialization.js` and find the signin test:

```typescript
// FIND (around line 40-50)
const signinUrl = `${convexUrl}/api/auth/sign-in/email`;

// CHANGE TO
const betterAuthBaseUrl = process.env.VITE_CONVEX_SITE_URL || 
  "https://kindly-setter-935.convex.site";
const signinUrl = `${betterAuthBaseUrl}/api/auth/sign-in/email`;
```

### Test Fix #3
```bash
pnpm test:unit:auth
pnpm test:integration:auth-initialization
```

**Expected:** Endpoint tests should pass ✅

---

## Validation Checklist

After implementing all fixes:

### Step 1: Run Individual Test Suites
```bash
# Unit tests
pnpm test:unit:beta-signup  # Should pass 100%
pnpm test:unit:auth         # Should pass 100%

# Integration tests
pnpm test:integration:signup-flow  # Should pass 100%
pnpm test:integration:auth-initialization  # Should pass 100%

# Diagnostic tests
pnpm test:diagnostic:env  # Should pass 100%
pnpm test:diagnostic:db   # Should pass 100%
```

### Step 2: Run Full Test Suite
```bash
pnpm test:beta-auth
```

**Expected Results:**
- ✅ All unit tests passing (100%)
- ✅ All integration tests passing (100%)
- ✅ All diagnostic tests passing (100%)
- ✅ Database state consistent
- ✅ No validation errors

### Step 3: Manual Testing
```bash
# 1. Start dev server
npx convex dev

# 2. In another terminal, start frontend
pnpm dev

# 3. Test beta signup flow:
#    a. Go to http://localhost:5173
#    b. Fill out beta signup form
#    c. Submit
#    d. Check console for temporaryPassword
#    e. Wait 5 seconds for user account creation
#    f. Check Convex dashboard for user records
#    g. Try signing in with email + temporaryPassword
```

---

## Common Issues & Troubleshooting

### Issue: "Function not found" error
**Solution:** Make sure Convex dev server is running: `npx convex dev`

### Issue: Tests still failing after fixes
**Solution:** 
1. Kill Convex dev server
2. Clear node_modules: `rm -rf node_modules`
3. Reinstall: `pnpm install`
4. Restart: `npx convex dev`
5. Re-run tests

### Issue: TypeScript errors
**Solution:** Run `npx convex dev` to regenerate types in `convex/_generated/`

### Issue: Email not received
**Solution:** 
1. Check Resend dashboard: https://resend.com/emails
2. Verify RESEND_API_KEY in environment
3. Check spam folder
4. Try different email address

---

## Git Workflow

After fixes are complete and tested:

```bash
# 1. Stage changes
git add convex/betaSignup.ts
git add src/emails/BetaWelcomeEmail.tsx
git add scripts/test-unit-auth.js
git add scripts/test-integration-auth-initialization.js

# 2. Commit with clear message
git commit -m "fix: Critical Phase 1 MVP issues - temp password generation

- Add secure temporary password generation in signupForBeta
- Schedule user account creation with password
- Update welcome email template to include password
- Fix getPendingSignups validator schema
- Fix Better Auth endpoint URLs in tests

Fixes: ISSUE-001, ISSUE-002, ISSUE-004, ISSUE-006, ISSUE-007
Tests: 100% passing (unit + integration + diagnostic)"

# 3. Push to feature branch (DO NOT push to main yet)
git push origin fix/phase1-critical-issues

# 4. Create Pull Request for code review
# 5. After approval, merge to main
# 6. Deploy to production
```

---

## Success Criteria

✅ **Fix Complete When:**
- All 48 tests passing (100%)
- Manual signup → email → signin flow works
- Temporary password generated and sent
- User accounts created automatically
- No console errors
- No validation errors
- Code reviewed and approved

---

## Need Help?

**Issue Tracker:** `scripts/MVP-PHASE1-GAP-ANALYSIS.md`  
**Test Docs:** `scripts/README.md`  
**Troubleshooting:** `scripts/troubleshooting-guide.md`

**Questions:** Contact QA team or review full gap analysis report.

---

**Last Updated:** 2025-10-13 22:15 UTC  
**Priority:** 🔴 CRITICAL - Launch Blocker  
**Status:** Ready for implementation

