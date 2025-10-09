<!-- ab097fcf-cacd-4c52-8c45-1787b1d584fd 3b7bec8e-6027-4596-9cc4-bb89a6feb4ee -->
# Authentication & Beta Flow Implementation Plan

## Overview

Fix major blockers in signup/signin and beta acceptance flow by properly configuring environment variables, integrating Better Auth and Resend components, and implementing automated user onboarding.

## Environment Configuration

### Convex Deployment URL

- Production: https://kindly-setter-935.convex.cloud
- Site URL: https://pelicanai.org
- Development: http://localhost:5173

### Backend Environment Variables (Convex Deployment)

Set via CLI:

```bash
npx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)
npx convex env set SITE_URL=https://pelicanai.org
npx convex env set RESEND_API_KEY=<your-resend-api-key>
```

### Frontend Environment Variables (.env.local)

```
VITE_CONVEX_URL=https://kindly-setter-935.convex.cloud
VITE_CONVEX_SITE_URL=https://kindly-setter-935.convex.site
SITE_URL=http://localhost:5173
```

## Phase 1: Configuration Updates

### 1.1 Update Convex Configuration

**File:** `convex/convex.config.ts`

Add Resend component registration:

```typescript
import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import resend from "@convex-dev/resend/convex.config";

const app = defineApp();
app.use(betterAuth);
app.use(resend); // ADD THIS LINE

export default app;
```

### 1.2 Fix Auth Configuration

**File:** `convex/auth.config.ts`

Change environment variable reference:

```typescript
export default {
  providers: [
    {
      domain: process.env.SITE_URL, // Changed from CONVEX_SITE_URL
      applicationID: "convex",
    },
  ],
};
```

### 1.3 Create Frontend Environment File

**File:** `.env.local` (create new)

```
VITE_CONVEX_URL=https://kindly-setter-935.convex.cloud
VITE_CONVEX_SITE_URL=https://kindly-setter-935.convex.site
SITE_URL=http://localhost:5173
```

### 1.4 Update Resend Implementation

**File:** `convex/betaSignup.ts`

Replace Resend initialization:

```typescript
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";

// Replace existing initialization with:
const resend: Resend = new Resend(components.resend, {
  testMode: false,
});
```

## Phase 2: Beta Signup to User Account Flow

### 2.1 Create Admin Approval Function

**File:** `convex/betaSignup.ts`

Add new mutation:

```typescript
export const approveBetaSignup = mutation({
  args: { 
    signupId: v.id("betaSignups"),
    temporaryPassword: v.string(),
    notes: v.optional(v.string())
  },
  returns: v.object({ 
    success: v.boolean(), 
    message: v.string()
  }),
  handler: async (ctx, args) => {
    // Validate admin permissions
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    // Get beta signup
    const signup = await ctx.db.get(args.signupId);
    if (!signup) {
      return { success: false, message: "Beta signup not found" };
    }

    // Update beta signup status
    await ctx.db.patch(args.signupId, { 
      status: "approved",
      notes: args.notes 
    });

    // Schedule platform access email
    await ctx.scheduler.runAfter(0, api.betaSignup.sendPlatformAccessEmail, {
      email: signup.email,
      name: signup.name,
      temporaryPassword: args.temporaryPassword,
    });

    return {
      success: true,
      message: "Beta signup approved. User will receive platform access instructions."
    };
  },
});
```

### 2.2 Create Platform Access Email

**File:** `convex/betaSignup.ts`

Add new action:

```typescript
export const sendPlatformAccessEmail = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    temporaryPassword: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    emailId: v.string(),
  }),
  handler: async (ctx, args) => {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your Pelican AI Platform Access</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0ea5e9, #f59e0b); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h1 style="margin: 0;">Pelican AI</h1>
          <p style="margin: 10px 0 0 0;">Your Platform Access is Ready!</p>
        </div>
        
        <h2>Welcome${args.name ? ` ${args.name}` : ''}!</h2>
        
        <p>Your beta program application has been approved! You now have access to the Pelican AI platform.</p>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Login Credentials</h3>
          <p><strong>Email:</strong> ${args.email}</p>
          <p><strong>Temporary Password:</strong> ${args.temporaryPassword}</p>
          <p style="color: #DC2626; font-size: 14px;">Please change your password after your first login.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://pelicanai.org" style="background: #0ea5e9; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Access Platform
          </a>
        </div>
        
        <p>Once you log in, you'll complete a brief onboarding to personalize your experience.</p>
      </body>
      </html>
    `;

    const emailId = await resend.sendEmail(ctx, {
      from: "Pelican AI <beta@pelicanai.org>",
      to: args.email,
      subject: "Your Pelican AI Platform Access is Ready!",
      html: emailHtml,
    });

    return { success: true, emailId };
  },
});
```

## Phase 3: Automatic Profile Initialization

### 3.1 Create User Initialization Function

**File:** `convex/userProfiles.ts`

Add new mutation:

```typescript
export const initializeNewUser = mutation({
  args: {},
  returns: v.union(
    v.object({ 
      success: v.boolean(),
      profileId: v.id("userProfiles"),
      betaProgramId: v.id("betaProgram"),
      message: v.string()
    }),
    v.object({
      success: v.boolean(),
      message: v.string()
    })
  ),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return { success: false, message: "User must be authenticated" };
    }

    // Check if already initialized
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (existingProfile) {
      return { success: false, message: "User already initialized" };
    }

    // Get beta signup data
    const betaSignup = await ctx.db
      .query("betaSignups")
      .withIndex("by_email", (q) => q.eq("email", user.email))
      .first();

    if (!betaSignup || betaSignup.status !== "approved") {
      return { success: false, message: "No approved beta signup found" };
    }

    // Create user profile
    const profileId = await ctx.db.insert("userProfiles", {
      userId: user._id,
      school: betaSignup.school,
      subject: betaSignup.subject,
      gradeLevel: undefined,
      district: undefined,
      role: "teacher",
    });

    // Initialize beta program
    const betaProgramId = await ctx.db.insert("betaProgram", {
      userId: user._id,
      status: "active",
      invitedAt: betaSignup.signupDate,
      joinedAt: Date.now(),
      onboardingStep: 0,
      onboardingCompleted: false,
      frameworksTried: 0,
      totalTimeSaved: 0,
      innovationsShared: 0,
      officeHoursAttended: 0,
      weeklyEngagementCount: 0,
    });

    return { 
      success: true,
      profileId, 
      betaProgramId, 
      message: "User initialized successfully" 
    };
  },
});
```

### 3.2 Update App.tsx to Auto-Initialize

**File:** `src/App.tsx`

Add initialization logic in Content component:

```typescript
function Content({ currentView, onShowOnboarding }: ContentProps) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const betaStatus = useQuery(api.betaProgram.getBetaStatus);
  const frameworks = useQuery(api.frameworks.getAllFrameworks, {});
  const testimonials = useQuery(api.testimonials.getFeaturedTestimonials, {});
  const betaStats = useQuery(api.betaProgram.getBetaStats, {});
  
  const initializeUser = useMutation(api.userProfiles.initializeNewUser);

  // Auto-initialize new users
  React.useEffect(() => {
    if (loggedInUser && !userProfile && !betaStatus) {
      initializeUser().catch(console.error);
    }
  }, [loggedInUser, userProfile, betaStatus]);

  // Rest of component...
}
```

## Phase 4: Admin Dashboard Enhancement

### 4.1 Add Beta Signup Management

**File:** `src/components/admin/AdminDashboard.tsx`

Add beta signup approval interface:

```typescript
// Add to AdminDashboard component
const pendingSignups = useQuery(api.betaSignup.getPendingSignups);
const approveBetaSignup = useMutation(api.betaSignup.approveBetaSignup);

const handleApprove = async (signupId: Id<"betaSignups">) => {
  const tempPassword = generateSecurePassword(); // Implement this
  await approveBetaSignup({ 
    signupId, 
    temporaryPassword: tempPassword 
  });
  toast.success("Beta signup approved!");
};
```

### 4.2 Create Pending Signups Query

**File:** `convex/betaSignup.ts`

Add query:

```typescript
export const getPendingSignups = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("betaSignups"),
    email: v.string(),
    name: v.optional(v.string()),
    school: v.optional(v.string()),
    subject: v.optional(v.string()),
    signupDate: v.number(),
  })),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("betaSignups")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});
```

## Phase 5: Enhanced Onboarding

### 5.1 Update BetaOnboarding Component

**File:** `src/components/dashboard/BetaOnboarding.tsx`

Pre-populate profile data from beta signup:

```typescript
// In BetaOnboarding component, update useEffect to pre-populate
React.useEffect(() => {
  if (userProfile) {
    setProfileData({
      school: userProfile.school || "",
      subject: userProfile.subject || "",
      gradeLevel: userProfile.gradeLevel || "",
      district: userProfile.district || "",
    });
  }
}, [userProfile]);
```

## Execution Order

1. Set backend environment variables via CLI
2. Create .env.local file
3. Update convex/convex.config.ts
4. Update convex/auth.config.ts
5. Update convex/betaSignup.ts (Resend initialization)
6. Add approveBetaSignup mutation
7. Add sendPlatformAccessEmail action
8. Add getPendingSignups query
9. Update convex/userProfiles.ts (initializeNewUser)
10. Update src/App.tsx (auto-initialization)
11. Update src/components/admin/AdminDashboard.tsx
12. Update src/components/dashboard/BetaOnboarding.tsx
13. Run `npx convex dev` to deploy changes
14. Test authentication flow end-to-end

## Success Criteria

- Users can sign up for beta program
- Admins can approve signups from dashboard
- Approved users receive platform access email
- Users can sign in with credentials
- User profiles auto-initialize on first login
- Beta program status auto-initializes
- Onboarding flow pre-populates with beta signup data
- All environment variables properly configured
- Email delivery works via Resend component

### To-dos

- [ ] Set backend environment variables in Convex deployment (BETTER_AUTH_SECRET, SITE_URL, RESEND_API_KEY)
- [ ] Create .env.local file with frontend environment variables
- [ ] Update convex/convex.config.ts to register Resend component
- [ ] Fix convex/auth.config.ts to use SITE_URL instead of CONVEX_SITE_URL
- [ ] Update Resend initialization in convex/betaSignup.ts to use component
- [ ] Add approveBetaSignup mutation to convex/betaSignup.ts
- [ ] Add sendPlatformAccessEmail action to convex/betaSignup.ts
- [ ] Add getPendingSignups query to convex/betaSignup.ts
- [ ] Add initializeNewUser mutation to convex/userProfiles.ts
- [ ] Update src/App.tsx to auto-initialize new users
- [ ] Update AdminDashboard to add beta signup approval interface
- [ ] Update BetaOnboarding to pre-populate profile data
- [ ] Deploy changes and test end-to-end authentication flow