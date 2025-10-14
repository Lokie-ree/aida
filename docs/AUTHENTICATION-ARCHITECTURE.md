# Authentication Architecture - Pelican AI Phase 1 MVP

**Last Updated:** October 14, 2025  
**Status:** ✅ Fixed (WEB-14)  
**Architecture:** Better Auth + Convex Integration

---

## Overview

Pelican AI uses **Better Auth** for authentication integrated with **Convex** for state management and session tracking. The system differentiates between authenticated and unauthenticated states using Convex's `<Authenticated>` and `<Unauthenticated>` components.

---

## Authentication Flow

### 1. **Unauthenticated State** (Landing Page)

**Route:** `/` (Landing Page)  
**Component:** `<LandingPage />`  
**Available Actions:**
- Beta signup (creates betaSignup record, not a user account)
- Sign In button (opens AuthModal)
- Join Beta buttons (scroll to beta signup form)

**Code:**
```tsx
<Unauthenticated>
  <LandingPage />
</Unauthenticated>
```

---

### 2. **Sign Up Flow** (New User)

**Entry Point:** Click "Sign In" button → AuthModal → Toggle to "Sign up"

**Process:**
1. User fills form (name, email, password)
2. Client calls `createUserDirectly` Convex mutation
3. Backend creates user account via Better Auth
4. **Auto-login:** Client immediately calls `authClient.signIn.email()`
5. Session created, Convex switches to `<Authenticated>` state
6. User redirected to Dashboard

**Fixed Issue (WEB-14):**
- ❌ **Before:** User stayed on landing page after signup
- ✅ **After:** User automatically logged in and redirected to dashboard

**Code:** `src/components/auth/AuthModal.tsx` (lines 65-94)

---

### 3. **Sign In Flow** (Returning User)

**Entry Point:** Click "Sign In" button → AuthModal

**Process:**
1. User enters email and password
2. Client calls `authClient.signIn.email()`
3. Better Auth validates credentials and creates session
4. Convex switches to `<Authenticated>` state
5. User sees Dashboard

**Code:** `src/components/auth/AuthModal.tsx` (lines 41-63)

---

### 4. **Authenticated State** (Dashboard Access)

**Route:** `/` (same route, different component)  
**Component:** `<Dashboard />`  
**Available Views:**
- Dashboard (default)
- Framework Library
- Community (Innovations)
- Time Tracking
- Profile Settings
- **Admin** (if user is admin)

**Code:**
```tsx
<Authenticated>
  <header>...</header>
  <main>
    <Content currentView={currentView} />
  </main>
</Authenticated>
```

---

## Admin Access

### Who Can Access Admin Dashboard?

Admin access is controlled by **email allowlist** in `convex/admin.ts`:

```typescript
const adminEmails = [
  "admin@pelicanai.org",
  "support@pelicanai.org",
  "test@example.com" // Temporary for testing
];
```

### How to Grant Admin Access

**Option 1: Add email to allowlist (for testing)**
```typescript
// convex/admin.ts
const adminEmails = [
  "admin@pelicanai.org",
  "support@pelicanai.org",
  "your-email@example.com" // Add your email here
];
```

**Option 2: Implement proper role-based system (recommended for production)**
- Add `role` field to `userProfiles` table
- Check `userProfile.role === "admin"` instead of email list
- Provide UI for admins to grant admin role to other users

### Accessing Admin Dashboard

1. **Sign up/Sign in** with an admin email
2. You'll see the **"Admin" button** in the navigation
3. Click **"Admin"** to view:
   - Beta user management
   - Content management
   - System analytics

**Note:** Non-admin users won't see the Admin button at all (conditional rendering based on `checkIsAdmin` query).

---

## User Journey Map

```
┌─────────────────────────────────────────────────────────────┐
│                      LANDING PAGE                           │
│                  (Unauthenticated State)                    │
│                                                             │
│  [Beta Signup Form] → Creates betaSignup record            │
│  [Sign In Button]   → Opens AuthModal                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ Click "Sign In"
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                      AUTH MODAL                             │
│                                                             │
│  Mode: Sign In          │    Mode: Sign Up                 │
│  ─────────────          │    ────────────                  │
│  • Email                │    • Name                        │
│  • Password             │    • Email                       │
│  [Sign in]              │    • Password                    │
│  [Sign up instead]      │    [Sign up]                     │
│                         │    [Sign in instead]             │
└─────────────────────────┴───────────────────────────────────┘
                          │
                          │ ✅ Successful Auth
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                      DASHBOARD                              │
│                  (Authenticated State)                      │
│                                                             │
│  Navigation:                                                │
│  • Dashboard (default)                                      │
│  • Framework Library                                        │
│  • Community                                                │
│  • Time Tracking                                            │
│  • Profile                                                  │
│  • Admin (if admin user)                                    │
│                                                             │
│  [Theme Toggle]  [Sign Out]                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Session Management

### How Sessions Work

**Session Creation:**
- Better Auth creates session on successful sign-in
- Session stored in Convex `session` table
- Session token stored in browser (httpOnly cookie)

**Session Validation:**
- On every request, Better Auth validates session token
- Convex `<Authenticated>` component checks session state
- If valid → show authenticated UI
- If invalid → show unauthenticated UI (landing page)

**Session Expiration:**
- Default: 30 days
- Refreshed on activity (24-hour window)
- On expiration: User redirected to landing page

### Sign Out Flow

1. User clicks "Sign Out" button
2. Client calls `authClient.signOut()`
3. Better Auth destroys session
4. Convex switches to `<Unauthenticated>` state
5. User redirected to landing page

---

## Database Schema

### Authentication Tables (Managed by Better Auth)

**`user` table:**
```typescript
{
  id: string,
  email: string,
  name: string,
  emailVerified: boolean,
  image?: string,
  createdAt: number,
  updatedAt: number
}
```

**`session` table:**
```typescript
{
  id: string,
  userId: string,
  expiresAt: number,
  token: string,
  ipAddress?: string,
  userAgent?: string
}
```

**`account` table:**
```typescript
{
  id: string,
  userId: string,
  accountId: string,
  providerId: string,
  accessToken?: string,
  refreshToken?: string,
  expiresAt?: number
}
```

### Application Tables (Pelican AI)

**`betaSignups` table:**
- **Purpose:** Beta program recruitment (pre-account creation)
- **Fields:** email, name, school, subject, status, signupDate
- **Note:** Separate from user accounts - beta signup ≠ user account

**`userProfiles` table:**
- **Purpose:** Extended user data beyond Better Auth
- **Fields:** userId, authId, school, subject, gradeLevel, district, role
- **Sync:** Automatically created when user account is created

**`betaProgram` table:**
- **Purpose:** Track beta tester engagement and progress
- **Fields:** userId, status, invitedAt, startedAt, frameworksTried, etc.
- **Note:** Created after user signs up and enters beta program

---

## Troubleshooting

### Issue: "Can't access dashboard after signup"

**Cause:** Session not created after signup  
**Status:** ✅ Fixed in WEB-14  
**Solution:** Auto-login implemented after successful signup

**Test:**
1. Sign up with new email/password
2. Verify auto-login occurs (watch console logs)
3. Confirm you see Dashboard (not landing page)

---

### Issue: "Admin button not showing"

**Possible Causes:**

1. **Not signed in with admin email**
   - Check your email matches one in `convex/admin.ts` allowlist
   - Default test admin: `test@example.com`

2. **Session expired**
   - Sign out and sign back in
   - Check browser console for session errors

3. **Admin check query failing**
   - Open browser devtools → Console
   - Look for `checkIsAdmin` query results
   - Should return `true` for admin users

**Debug Steps:**
```typescript
// Check in browser console:
// 1. Are you authenticated?
console.log(useQuery(api.auth.loggedInUser));

// 2. Are you admin?
console.log(useQuery(api.admin.checkIsAdmin));

// Expected output for admin:
// { email: "test@example.com", ... }
// true
```

---

### Issue: "Stuck on landing page after sign in"

**Possible Causes:**

1. **Invalid credentials**
   - Check email/password are correct
   - Look for error toast messages

2. **Session creation failed**
   - Check browser console for errors
   - Check Convex dashboard logs

3. **Better Auth configuration issue**
   - Verify `src/lib/auth-client.ts` is correctly configured
   - Check `convex/auth.config.ts` for session settings

**Debug Steps:**
1. Open browser devtools → Console
2. Look for sign-in errors or session errors
3. Check Convex dashboard → Logs for backend errors

---

## Architecture Decision Records

**ADR-004:** Migrate to Better Auth  
**Rationale:** Better Auth provides robust session management, email/password authentication, and seamless Convex integration for Phase 1 MVP needs.

**ADR-007:** Email-First Beta Flow  
**Rationale:** Beta signup (betaSignups table) is separate from user account creation to allow pre-approval workflow before granting dashboard access.

---

## Security Considerations

### Current Implementation (Phase 1 MVP)

✅ **Implemented:**
- Password hashing via Better Auth
- httpOnly cookies for session tokens
- Session expiration (30 days)
- Email validation
- Admin access control (email allowlist)

⚠️ **For Production (Future):**
- Replace email allowlist with role-based access control (RBAC)
- Add email verification requirement
- Implement password reset flow
- Add rate limiting on auth endpoints
- Enable 2FA for admin accounts
- FERPA compliance audit for educator data

---

## Next Steps

### Immediate (Phase 1 MVP)

1. ✅ **WEB-14 Fixed:** Auto-login after signup
2. 🔲 **Test end-to-end flow:** Signup → Dashboard → Admin (for admin emails)
3. 🔲 **Email delivery:** Test welcome emails are sent after signup
4. 🔲 **Session persistence:** Verify sessions persist across page reloads

### Future (Post-MVP)

1. Implement proper RBAC system (replace email allowlist)
2. Add email verification step
3. Implement password reset flow
4. Add social auth providers (Google, Microsoft for schools)
5. Implement "Remember me" functionality
6. Add session management UI (view/revoke active sessions)

---

## Testing Checklist

### Sign Up Flow
- [ ] Fill sign-up form with valid data
- [ ] Submit form
- [ ] Verify success toast displays
- [ ] **Verify auto-login occurs**
- [ ] **Verify redirect to dashboard (NOT landing page)**
- [ ] Verify user profile created in database
- [ ] Verify session created in database

### Sign In Flow
- [ ] Enter valid email/password
- [ ] Submit form
- [ ] Verify success toast displays
- [ ] Verify redirect to dashboard
- [ ] Verify session persists across page reload

### Admin Access
- [ ] Sign in with admin email (`test@example.com`)
- [ ] Verify "Admin" button visible in navigation
- [ ] Click "Admin" button
- [ ] Verify AdminDashboard renders
- [ ] Sign in with non-admin email
- [ ] Verify "Admin" button NOT visible

### Sign Out Flow
- [ ] Click "Sign Out" button
- [ ] Verify redirect to landing page
- [ ] Verify session destroyed
- [ ] Attempt to access dashboard (should redirect to landing)

---

## API Reference

### Frontend (React)

**Better Auth Client:**
```typescript
import { authClient } from "@/lib/auth-client";

// Sign in
const result = await authClient.signIn.email({
  email: "user@example.com",
  password: "password123"
});

// Sign out
await authClient.signOut();

// Get session
const { data: session } = authClient.useSession();
```

**Convex Auth Queries:**
```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Get logged-in user
const user = useQuery(api.auth.loggedInUser);

// Check if user is admin
const isAdmin = useQuery(api.admin.checkIsAdmin);

// Get user profile
const profile = useQuery(api.userProfiles.getUserProfile);
```

### Backend (Convex)

**Create User:**
```typescript
// convex/auth.ts
export const createUserDirectly = mutation({
  args: { email: v.string(), password: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const auth = createAuth(ctx);
    const result = await auth.api.signUpEmail({
      body: { email, password, name }
    });
    // Auto-creates userProfile via database trigger
    return { success: true, userId: result.user.id };
  }
});
```

**Check Admin:**
```typescript
// convex/admin.ts
export const checkIsAdmin = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    const adminEmails = ["admin@pelicanai.org", "test@example.com"];
    return adminEmails.includes(user.email);
  }
});
```

---

## Support

**Issues?** Check:
1. Browser console for client-side errors
2. Convex dashboard → Logs for backend errors
3. Network tab for failed requests
4. This document's Troubleshooting section

**Linear Issues:**
- WEB-13: Authentication flow verification (COMPLETE)
- WEB-14: Auto-login after signup (FIXED)

---

**Document Version:** 1.0  
**Last Review:** October 14, 2025  
**Next Review:** After Phase 1 MVP beta launch

