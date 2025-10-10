# Beta Authentication Troubleshooting Guide

## Overview

This guide provides solutions to common issues encountered during beta authentication testing and development.

## Quick Diagnosis

### 1. Run Diagnostic Tests First

```bash
# Check environment and database state
npm run test:diagnostic

# Check specific diagnostic tests
npm run test:diagnostic:env
npm run test:diagnostic:db
```

### 2. Check Environment Variables

```bash
# Verify required environment variables
echo "CONVEX_SITE_URL: $CONVEX_SITE_URL"
echo "SITE_URL: $SITE_URL"
echo "BETTER_AUTH_SECRET: $BETTER_AUTH_SECRET"
```

## Common Issues and Solutions

### Issue 1: "Failed to fetch" Errors

**Symptoms:**
- AuthModal shows "Failed to fetch" errors
- CORS errors in browser console
- Network requests failing

**Causes:**
- Missing localhost URLs in CORS configuration
- Incorrect CONVEX_SITE_URL
- Better Auth not properly configured

**Solutions:**

1. **Check CORS Configuration:**
   ```typescript
   // In convex/auth.ts
   trustedOrigins: [
     siteUrl, // Production URL
     "http://localhost:5173", // Development URL
     "http://localhost:3000", // Alternative dev port
   ],
   ```

2. **Verify Environment Variables:**
   ```bash
   # Check if CONVEX_SITE_URL is set correctly
   npx convex env list
   ```

3. **Test Better Auth Endpoints:**
   ```bash
   # Test if Better Auth endpoints are accessible
   npm run test:api:better-auth
   ```

### Issue 2: User Account Creation Failing

**Symptoms:**
- Beta signup succeeds but no user created in Better Auth
- `createUserAccountFromBetaSignup` action fails
- User remains on landing page after authentication

**Causes:**
- Wrong deployment URL in action
- Better Auth API not responding
- Environment variable not set

**Solutions:**

1. **Check Deployment URL:**
   ```typescript
   // In convex/betaSignup.ts
   const response = await fetch(`${process.env.CONVEX_SITE_URL}/api/auth/sign-up/email`, {
     // ... rest of the code
   });
   ```

2. **Verify Environment Variable:**
   ```bash
   # Check if CONVEX_SITE_URL is set
   npx convex env list | grep CONVEX_SITE_URL
   ```

3. **Test Better Auth API Directly:**
   ```bash
   curl -X POST https://your-deployment.convex.site/api/auth/sign-up/email \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'
   ```

### Issue 3: Authentication State Not Recognized

**Symptoms:**
- User authenticated in Better Auth but not recognized by Convex
- `getCurrentUser` returns null after authentication
- Profile initialization not triggered

**Causes:**
- JWT token not being passed correctly
- Better Auth and Convex client integration issue
- Session not being created properly

**Solutions:**

1. **Check Better Auth Integration:**
   ```typescript
   // Verify auth component is properly configured
   export const authComponent = createClient<DataModel>(components.betterAuth, {
     verbose: true, // Enable verbose logging
   });
   ```

2. **Test Authentication Flow:**
   ```bash
   # Run integration tests
   npm run test:integration:auth-init
   ```

3. **Check Session Creation:**
   ```bash
   # Monitor Convex logs for session creation
   npx convex logs --watch
   ```

### Issue 4: Profile Initialization Failing

**Symptoms:**
- User authenticated but no profile created
- `userProfiles` table remains empty
- `betaProgram` table remains empty

**Causes:**
- Auto-initialization logic not working
- Authentication not recognized
- Database permissions issue

**Solutions:**

1. **Check Auto-initialization Logic:**
   ```typescript
   // In userProfiles.ts - check the condition
   if (betaStatus === null) { // Should be null, not falsy
     // Initialize profile
   }
   ```

2. **Test Profile Initialization:**
   ```bash
   # Run unit tests for user profiles
   npm run test:unit:user-profiles
   ```

3. **Check Database State:**
   ```bash
   # Run database state tests
   npm run test:diagnostic:db
   ```

### Issue 5: Email Delivery Issues

**Symptoms:**
- Beta signup succeeds but no email received
- Email sending fails
- Wrong email content

**Causes:**
- Resend API key not configured
- Email template issues
- Test mode restrictions

**Solutions:**

1. **Check Resend Configuration:**
   ```bash
   # Verify Resend API key is set
   npx convex env list | grep RESEND_API_KEY
   ```

2. **Test Email Sending:**
   ```typescript
   // Check if testMode is enabled
   // In convex/email.ts
   testMode: true, // Only sends to @resend.dev addresses
   ```

3. **Verify Email Templates:**
   ```bash
   # Check email template rendering
   npm run test:unit:beta-signup
   ```

## Debugging Steps

### Step 1: Environment Check

```bash
# 1. Check all environment variables
npx convex env list

# 2. Verify Convex deployment is running
npx convex logs --limit 10

# 3. Test database connectivity
npm run test:diagnostic:db
```

### Step 2: Component Testing

```bash
# 1. Test individual components
npm run test:unit

# 2. Test component interactions
npm run test:integration

# 3. Test complete flow
npm run test:e2e
```

### Step 3: API Testing

```bash
# 1. Test Better Auth endpoints
npm run test:api:better-auth

# 2. Test Convex functions
npm run test:unit:beta-signup
```

### Step 4: Database Investigation

```bash
# 1. Check database state
npx convex data

# 2. Run database state tests
npm run test:diagnostic:db

# 3. Clean and retry
npm run test:cleanup
```

## Monitoring and Logs

### Convex Logs

```bash
# Monitor real-time logs
npx convex logs --watch

# Get recent logs
npx convex logs --limit 50

# Filter for specific function
npx convex logs --limit 100 | grep "createUserAccountFromBetaSignup"
```

### Browser Console

1. Open browser developer tools
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Application tab for session storage

### Database Inspection

```bash
# Check specific tables
npx convex data --table betaSignups
npx convex data --table userProfiles
npx convex data --table betaProgram
```

## Performance Issues

### Slow Query Performance

**Symptoms:**
- Tests timing out
- Slow database queries
- High response times

**Solutions:**

1. **Check Query Optimization:**
   ```typescript
   // Use indexes for queries
   .withIndex("by_email", (q) => q.eq("email", email))
   ```

2. **Monitor Performance:**
   ```bash
   # Run performance tests
   npm run test:diagnostic:db
   ```

3. **Check Database Size:**
   ```bash
   # Check if database is too large
   npx convex data
   ```

### Memory Issues

**Symptoms:**
- Tests running out of memory
- Slow test execution
- Node.js crashes

**Solutions:**

1. **Clean Test Data:**
   ```bash
   # Clean database between tests
   npm run test:cleanup
   ```

2. **Run Tests in Smaller Batches:**
   ```bash
   # Run individual test suites
   npm run test:unit
   npm run test:integration
   ```

## Recovery Procedures

### Complete Reset

```bash
# 1. Clean all test data
npm run test:cleanup

# 2. Restart Convex development
npx convex dev --once

# 3. Run all tests
npm run test:beta-auth
```

### Partial Reset

```bash
# 1. Clean specific test data
node scripts/test-utils.js --cleanup

# 2. Run specific test suite
npm run test:unit:beta-signup
```

### Environment Reset

```bash
# 1. Check environment variables
npx convex env list

# 2. Set missing variables
npx convex env set CONVEX_SITE_URL "https://your-deployment.convex.site"

# 3. Restart development server
npm run dev
```

## Getting Help

### Check Test Results

```bash
# Run all tests and check results
npm run test:beta-auth

# Check specific test suite
npm run test:unit
```

### Review Logs

```bash
# Check Convex logs for errors
npx convex logs --limit 100

# Check browser console for client-side errors
```

### Contact Support

If issues persist after following this guide:

1. Collect test results: `npm run test:beta-auth > test-results.log`
2. Collect logs: `npx convex logs --limit 100 > convex-logs.log`
3. Document environment: `npx convex env list > env-vars.log`
4. Create issue with collected information

## Prevention

### Regular Testing

```bash
# Run tests regularly during development
npm run test:unit

# Run full test suite before deployment
npm run test:beta-auth
```

### Environment Validation

```bash
# Check environment before starting development
npm run test:diagnostic:env
```

### Database Maintenance

```bash
# Clean test data regularly
npm run test:cleanup
```

---

**Last Updated**: [Current Date]  
**Version**: 1.0  
**Next Review**: [Date + 1 week]
