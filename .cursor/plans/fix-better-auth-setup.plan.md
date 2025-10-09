<!-- 6534dc1f-a483-443e-928f-aa5cdfab2b86 8b07c58a-7438-4e45-844e-3b8d7b0cff0f -->
# Fix Better Auth Sign Up/Sign In Functionality

## Problem Analysis

Based on the codebase review and comparison with the [Convex + Better Auth documentation](https://convex-better-auth.netlify.app/), several configuration issues have been identified:

### Key Issues Found

1. **Missing Environment Variables**

- No `.env` or `.env.local` file exists
- Required variables: `SITE_URL`, `BETTER_AUTH_SECRET`, `VITE_CONVEX_URL`, `VITE_CONVEX_SITE_URL`
- Backend uses `process.env.SITE_URL` but it's not configured
- Client uses `import.meta.env.VITE_CONVEX_SITE_URL` but it's not set

2. **Auth Config Mismatch**

- `convex/auth.config.ts` uses `CONVEX_SITE_URL` (line 4)
- Should use `SITE_URL` according to the documentation
- The config structure may not match Better Auth requirements

3. **Missing Verbose Logging**

- No debugging enabled to see what's failing
- Should enable verbose logging per the [debugging guide](https://convex-better-auth.netlify.app/debugging)

4. **Potential CORS Issues**

- HTTP routes have CORS enabled but need to verify configuration
- Client-side requests may be failing due to origin mismatch

## Solution Steps

### 1. Create Environment Configuration

Create `.env.local` with proper environment variables:

- `CONVEX_URL` - From Convex dashboard
- `VITE_CONVEX_URL` - Same as CONVEX_URL for client access
- `SITE_URL` - Backend site URL (from Convex deployment)
- `VITE_CONVEX_SITE_URL` - Same as SITE_URL for client
- `BETTER_AUTH_SECRET` - Generate secure random secret

### 2. Fix Auth Config

Update `convex/auth.config.ts`:

- Change `CONVEX_SITE_URL` to `SITE_URL`
- Ensure config matches Better Auth provider requirements

### 3. Enable Debugging

Add verbose logging to:

- `convex/auth.ts` - Enable verbose mode in authComponent
- `src/main.tsx` - Enable verbose mode in ConvexReactClient

### 4. Verify HTTP Routes

Check `convex/http.ts`:

- Ensure Better Auth routes are properly registered
- Verify CORS configuration is correct
- Confirm routes match expected paths

### 5. Test Authentication Flow

After fixes:

- Test sign up with new account
- Test sign in with existing account
- Verify error messages are helpful
- Check browser console and network tab for errors

## Files to Modify

1. `.env.local` (create new)
2. `convex/auth.config.ts` (fix environment variable)
3. `convex/auth.ts` (add verbose logging)
4. `src/main.tsx` (add verbose logging)
5. `.gitignore` (ensure .env.local is ignored)

## Expected Outcome

After implementing these fixes:

- Sign up should create new user accounts successfully
- Sign in should authenticate existing users
- Clear error messages for invalid credentials
- Proper session management with Better Auth
- Verbose logs to help diagnose any remaining issues

### To-dos

- [ ] Create .env.local file with all required environment variables (CONVEX_URL, VITE_CONVEX_URL, SITE_URL, VITE_CONVEX_SITE_URL, BETTER_AUTH_SECRET)
- [ ] Fix convex/auth.config.ts to use correct environment variable (SITE_URL instead of CONVEX_SITE_URL)
- [ ] Enable verbose logging in convex/auth.ts authComponent configuration
- [ ] Enable verbose logging in src/main.tsx ConvexReactClient configuration
- [ ] Ensure .env.local is in .gitignore to prevent committing secrets
- [ ] Test sign up and sign in flows, verify error handling and session management