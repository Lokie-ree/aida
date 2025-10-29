# Admin User Setup Guide

## Overview

This guide explains how to set up an admin user for testing the Pelican AI admin dashboard.

## Admin User Created

An admin test user has been successfully created with the following details:

### Login Credentials

- **Email:** `delivered@resend.dev`
- **Password:** `TestAdmin123!`
- **Name:** Admin User
- **User ID:** `m57b962gdntqczf9a490n98tss7tady2`

### Database Records

The following records have been created:

1. **Better Auth User** (in `betterAuth` component)
   - User ID: `m57b962gdntqczf9a490n98tss7tady2`
   - Email: `delivered@resend.dev`
   - Email Verified: `false`

2. **User Profile** (in `userProfiles` table)
   - Profile ID: `ms72wavtjkwr5690tp0ee7z0g97tag21`
   - Role: `admin`
   - School: `Test School`
   - Subject: `Test Subject`

3. **Beta Program** (in `betaProgram` table)
   - Beta Program ID: `mx76tsb6b757atm0d4ycg15ca17ta43p`
   - Status: `active`
   - Onboarding Step: `0`

## Admin Access Configuration

The admin access is configured in `convex/admin.ts` using an email-based whitelist:

```typescript
const adminEmails = [
  "rplapointjr+reset@gmail.com" // Temporary for testing
];
```

### ⚠️ Important Note

The current admin email whitelist includes `rplapointjr+reset@gmail.com`, but the test user was created with `delivered@resend.dev`. 

**To enable admin access for the test user, you need to:**

**Option 1: Update the admin email list (Recommended for testing)**

Edit `convex/admin.ts` and add the test user email:

```typescript
const adminEmails = [
  "rplapointjr+reset@gmail.com",
  "delivered@resend.dev" // Test admin user
];
```

**Option 2: Create a user with the correct email**

Run the script again after updating `scripts/create-admin-user.js` to use `rplapointjr+reset@gmail.com` as the email.

## Testing the Admin Dashboard

Once admin access is configured:

1. **Start the development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to the app**:
   ```
   http://localhost:5173
   ```

3. **Sign in with admin credentials**:
   - Email: `delivered@resend.dev`
   - Password: `TestAdmin123!`

4. **Automatic redirect to admin dashboard**:
   - Admin users are automatically redirected to `/admin` after login
   - Regular users are redirected to `/dashboard`
   - This is handled by the `SmartRedirect` component in `src/components/routes/SmartRedirect.tsx`

5. **Test admin features**:
   - View admin statistics (overview tab)
   - Manage beta signups (beta signups tab)
   - Moderate community content (content moderation tab)
   - Manage beta users (beta users tab)

## Script Usage

The admin user was created using the `scripts/create-admin-user.js` script:

```bash
node scripts/create-admin-user.js
```

This script:
1. Calls the Better Auth signup endpoint
2. Creates a user in the Better Auth component
3. Displays the user details and next steps

The userProfile and betaProgram records were created manually using Convex MCP tools:

```bash
# Create userProfile
mcp_convex_run userProfiles:createUserProfileForUserId \
  --userId "m57b962gdntqczf9a490n98tss7tady2" \
  --role "admin" \
  --school "Test School" \
  --subject "Test Subject"

# Create betaProgram
mcp_convex_run betaProgram:createBetaProgramForUserId \
  --userId "m57b962gdntqczf9a490n98tss7tady2"
```

## Phase 1 Beta Flow Issue

During Phase 1 development, the Better Auth trigger in `convex/auth.ts` was configured to automatically create a userProfile when a user signs up:

```typescript
export const authComponent = createClient<DataModel>(components.betterAuth, {
  triggers: {
    user: {
      onCreate: async (ctx, doc) => {
        // Create user profile when Better Auth user is created
        await ctx.db.insert("userProfiles", {
          userId: doc._id,
          authId: doc._id,
        });
      },
    },
  },
});
```

However, this trigger **did not fire** when creating the test user. This is likely because:

1. The trigger may not be active in the current deployment
2. The Better Auth component may handle triggers differently
3. There may be a timing issue with the trigger execution

**Workaround:** Use the `createUserProfileForUserId` mutation to manually create userProfiles for users created through the signup endpoint.

## Future Improvements

For production, consider implementing:

1. **Role-based access control** - Add a `role` field to the Better Auth user table
2. **Admin management UI** - Allow admins to promote other users to admin
3. **Automatic profile creation** - Fix the Better Auth trigger to ensure userProfiles are always created
4. **Admin invitation system** - Send invitation emails to new admins

## Troubleshooting

### Cannot access admin dashboard

**Symptom:** Redirected to home page when accessing `/admin`

**Solution:** Verify that:
1. You're logged in with the correct email
2. The email is in the `adminEmails` array in `convex/admin.ts`
3. The userProfile has `role: "admin"`

### User profile not found

**Symptom:** Error messages about missing user profile

**Solution:** Manually create the userProfile using:
```bash
mcp_convex_run userProfiles:createUserProfileForUserId \
  --userId "<user_id>" \
  --role "admin"
```

### Beta program not found

**Symptom:** Dashboard shows no beta program data

**Solution:** Manually create the betaProgram record using:
```bash
mcp_convex_run betaProgram:createBetaProgramForUserId \
  --userId "<user_id>"
```

---

*Last Updated: October 28, 2025*

