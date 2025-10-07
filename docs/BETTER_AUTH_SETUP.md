# Better Auth Setup Guide

This guide explains how to set up Better Auth with Convex for the EdCoachAI platform.

## Overview

EdCoachAI uses [Better Auth](https://better-auth.com) integrated with [Convex](https://convex.dev) for authentication. This provides:

- Email/password authentication
- Secure session management
- Cross-domain support for client-side apps
- Automatic user and session tables

## Documentation

- [Convex + Better Auth Official Docs](https://convex-better-auth.netlify.app/framework-guides/react)
- [Better Auth Documentation](https://better-auth.com)

## Environment Variables

### Required Environment Variables

Add these to your `.env.local` file (created by `npx convex dev`):

```env
# Convex Deployment (automatically added by convex dev)
CONVEX_DEPLOYMENT=dev:adjective-animal-123

# Convex URL (ends in .convex.cloud)
VITE_CONVEX_URL=https://adjective-animal-123.convex.cloud

# Convex Site URL (same as VITE_CONVEX_URL but ends in .convex.site)
# Required for Better Auth
VITE_CONVEX_SITE_URL=https://adjective-animal-123.convex.site

# Your local development site URL
SITE_URL=http://localhost:5173
```

### Convex Environment Variables

Set these in your Convex deployment using the Convex CLI or dashboard:

```bash
# Generate and set Better Auth secret
npx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)

# Set your site URL
npx convex env set SITE_URL http://localhost:5173
```

For production:
```bash
npx convex env set SITE_URL https://edcoachai.org --prod
```

## Setup Steps

### 1. Install Dependencies

Already installed in package.json:
- `better-auth@1.3.8` (pinned version)
- `@convex-dev/better-auth`
- `convex@latest`

### 2. Component Registration

Already configured in `convex/convex.config.ts`:
```typescript
import betterAuth from "@convex-dev/better-auth/convex.config";
app.use(betterAuth);
```

### 3. Auth Configuration

Created in `convex/auth.config.ts` and `convex/auth.ts`

### 4. HTTP Routes

Registered in `convex/http.ts`

### 5. Frontend Setup

- Auth client created in `src/lib/auth-client.ts`
- Provider configured in `src/main.tsx`

## Usage

### Get Current User

```typescript
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function MyComponent() {
  const user = useQuery(api.auth.getCurrentUser);
  
  if (!user) {
    return <div>Not logged in</div>;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Sign In

```typescript
import { authClient } from "@/lib/auth-client";

async function handleSignIn(email: string, password: string) {
  await authClient.signIn.email({
    email,
    password,
  });
}
```

### Sign Up

```typescript
import { authClient } from "@/lib/auth-client";

async function handleSignUp(name: string, email: string, password: string) {
  await authClient.signUp.email({
    name,
    email,
    password,
  });
}
```

### Sign Out

```typescript
import { authClient } from "@/lib/auth-client";

async function handleSignOut() {
  await authClient.signOut();
}
```

## Features

### Current Configuration

- ✅ Email/password authentication
- ✅ No email verification required (for beta)
- ✅ Cross-domain support
- ✅ Secure session management
- ✅ CORS enabled for client-side apps

### Future Enhancements

- [ ] Email verification
- [ ] OAuth providers (Google, Microsoft)
- [ ] Password reset flow
- [ ] Two-factor authentication
- [ ] Magic link authentication

## Troubleshooting

### Common Issues

1. **"BETTER_AUTH_SECRET not set"**
   - Run: `npx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)`

2. **"SITE_URL not set"**
   - Add `SITE_URL=http://localhost:5173` to `.env.local`
   - Run: `npx convex env set SITE_URL http://localhost:5173`

3. **CORS errors**
   - Ensure `VITE_CONVEX_SITE_URL` ends in `.convex.site` (not `.convex.cloud`)
   - Check that CORS is enabled in `convex/http.ts`

4. **Auth not working**
   - Run `npx convex dev` to regenerate types
   - Check browser console for errors
   - Verify environment variables are set

## Next Steps

1. Update AuthModal.tsx to use new Better Auth client
2. Update SignInForm.tsx and SignOutButton.tsx
3. Test authentication flow
4. Add user profile management
5. Integrate with beta signup flow

## Related Files

- `convex/auth.ts` - Better Auth configuration
- `convex/auth.config.ts` - Auth provider config
- `convex/http.ts` - HTTP route handlers
- `src/lib/auth-client.ts` - Frontend auth client
- `src/main.tsx` - Auth provider setup
- `convex/schema.ts` - Database schema (user tables managed by component)
