# Resend Email Integration Setup

This document outlines the steps to properly configure the Resend email service with the Convex Resend component for the AI for LA Educators platform.

## Prerequisites

1. A [Resend](https://resend.com) account
2. A verified domain in Resend (or use test email addresses during development)

## Configuration Steps

### 1. Set Environment Variables

You need to set two environment variables in your Convex deployment:

```bash
# Required: Your Resend API key
npx convex env set RESEND_API_KEY <your-api-key>

# Required for webhooks: Your Resend webhook secret
npx convex env set RESEND_WEBHOOK_SECRET <your-webhook-secret>
```

**To get your API key:**
1. Log in to [Resend Dashboard](https://resend.com/dashboard)
2. Navigate to API Keys
3. Create a new API key or copy an existing one

### 2. Configure Domain (Production)

For production use, you must verify a domain in Resend:

1. Go to [Resend Domains](https://resend.com/domains)
2. Add your domain
3. Add the required DNS records (SPF, DKIM, DMARC)
4. Wait for verification (usually takes a few minutes)

### 3. Set Up Webhook (Recommended)

The webhook allows you to receive email status updates (delivered, bounced, complained, etc.).

**Webhook URL:**
```
https://<your-convex-deployment>.convex.site/resend-webhook
```

**To configure the webhook:**
1. Go to [Resend Webhooks](https://resend.com/webhooks)
2. Click "Add Webhook"
3. Enter your webhook URL
4. Enable all `email.*` events:
   - email.sent
   - email.delivered
   - email.delivery_delayed
   - email.complained
   - email.bounced
   - email.opened
   - email.clicked
5. Copy the webhook secret
6. Set it as `RESEND_WEBHOOK_SECRET` in Convex (see step 1)

### 4. Update Email Addresses

Update the `from` addresses in the following files to use your verified domain:

**convex/email.ts:**
```typescript
from: "A.I.D.A. <welcome@yourdomain.com>"
from: "A.I.D.A. <sessions@yourdomain.com>"
```

**convex/betaSignup.ts:**
```typescript
from: "AI for LA Educators <beta@yourdomain.com>"
```

### 5. Test Mode Configuration

The Resend component is currently configured with `testMode: true` in both files:
- `convex/email.ts`
- `convex/betaSignup.ts`

**Current State (Development):**
With `testMode: true`, emails can ONLY be sent to Resend test addresses:
- `delivered@resend.dev` - Simulates successful delivery
- `delivered+label@resend.dev` - Successful delivery with custom label
- `bounced@resend.dev` - Simulates a bounced email
- `complained@resend.dev` - Simulates a spam complaint

**To Go to Production:**
1. Verify your domain in Resend (see step 2)
2. Update `from` addresses to use your verified domain (see step 4)
3. Set `testMode: false` in both `convex/email.ts` and `convex/betaSignup.ts`
4. Deploy your changes

**Important:** You CANNOT send to real email addresses with `testMode: false` unless you have a verified domain in Resend.

## Current Implementation

### Files Configured

1. **convex/convex.config.ts** - Component registration ✅
   ```typescript
   import resend from "@convex-dev/resend/convex.config";
   app.use(resend);
   ```

2. **convex/email.ts** - Email sending functions ✅
   - `sendWelcomeEmail` - Sends welcome emails to new users
   - `sendVoiceInteractionSummary` - Sends voice session summaries

3. **convex/betaSignup.ts** - Beta signup emails ✅
   - `sendBetaWelcomeEmail` - Sends welcome emails to beta signups

4. **convex/http.ts** - Webhook endpoint ✅
   ```typescript
   http.route({
     path: "/resend-webhook",
     method: "POST",
     handler: httpAction(async (ctx, req) => {
       return await resend.handleResendEventWebhook(ctx, req);
     }),
   });
   ```

### Email Flow

1. User signs up for beta on landing page
2. `signupForBeta` mutation saves signup to database
3. Mutation schedules `sendBetaWelcomeEmail` action
4. Action calls `resend.sendEmail()` to queue the email
5. Resend component batches and sends emails
6. Webhook receives status updates from Resend
7. Component updates email status in database

## Testing

### Test Email Sending

You can test email sending using the Convex dashboard or by calling the mutation directly:

```typescript
// In Convex dashboard, run:
await ctx.runMutation(api.betaSignup.signupForBeta, {
  email: "delivered@resend.dev",
  name: "Test User",
  school: "Test School"
});
```

### Verify Webhook

After setting up the webhook, you can verify it's working by:
1. Sending a test email
2. Checking the Resend dashboard for webhook delivery logs
3. Checking your Convex logs for webhook events

## Troubleshooting

### Email Not Sending

1. **Check environment variables:**
   ```bash
   npx convex env list
   ```
   Verify `RESEND_API_KEY` is set.

2. **Check test mode:**
   If `testMode: true`, you can only send to `@resend.dev` addresses.

3. **Check domain verification:**
   For production, your domain must be verified in Resend.

4. **Check Convex logs:**
   Look for errors in the Convex dashboard logs.

### Webhook Not Working

1. **Verify webhook secret:**
   ```bash
   npx convex env list
   ```
   Ensure `RESEND_WEBHOOK_SECRET` matches the secret in Resend dashboard.

2. **Check webhook URL:**
   Ensure the URL in Resend dashboard matches your Convex deployment URL.

3. **Check webhook events:**
   Ensure all `email.*` events are enabled in Resend dashboard.

### Rate Limiting

The component automatically handles Resend's rate limits:
- Free tier: 1 email per second
- Pro tier: Higher limits (configurable)

If you upgrade your Resend plan, you can adjust rate limits in the component options.

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Convex Resend Component](https://www.npmjs.com/package/@convex-dev/resend)
- [Resend Dashboard](https://resend.com/dashboard)
- [Convex Dashboard](https://dashboard.convex.dev)

## Next Steps

1. ✅ Component installed and configured
2. ⏳ Set `RESEND_API_KEY` environment variable
3. ⏳ Set `RESEND_WEBHOOK_SECRET` environment variable
4. ⏳ Verify domain in Resend (for production)
5. ⏳ Update `from` email addresses to use verified domain
6. ⏳ Test email sending
7. ⏳ Configure webhook in Resend dashboard
8. ⏳ Test webhook delivery
