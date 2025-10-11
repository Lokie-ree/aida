# Resend Email Testing Guide

## Current Configuration

The Resend integration is currently in **TEST MODE** (`testMode: true`), which means:
- ✅ Emails can ONLY be sent to `@resend.dev` test addresses
- ❌ Emails CANNOT be sent to real email addresses
- ✅ No domain verification required
- ✅ Safe for development and testing

## Test Email Addresses

Use these addresses to test different email scenarios:

| Test Address | Behavior | Use Case |
|--------------|----------|----------|
| `delivered@resend.dev` | Simulates successful delivery | Test happy path |
| `delivered+beta@resend.dev` | Successful delivery with label | Test with custom labels |
| `delivered+user123@resend.dev` | Successful delivery with label | Test user-specific emails |
| `bounced@resend.dev` | Simulates email bounce | Test error handling |
| `complained@resend.dev` | Simulates spam complaint | Test complaint handling |

## Testing the Beta Signup Flow

### Option 1: Via Landing Page

1. Open the landing page in your browser
2. Enter a test email address in the signup form:
   ```
   delivered@resend.dev
   ```
3. Fill in optional fields (name, school, subject)
4. Click "Join Beta Program"
5. Check Convex logs for email sending confirmation

### Option 2: Via Convex Dashboard

1. Go to your [Convex Dashboard](https://dashboard.convex.dev)
2. Navigate to Functions → `betaSignup:signupForBeta`
3. Run the mutation with test data:
   ```json
   {
     "email": "delivered@resend.dev",
     "name": "Test User",
     "school": "Test School",
     "subject": "Mathematics"
   }
   ```
4. Check the logs for the scheduled email action
5. Navigate to Functions → `betaSignup:sendBetaWelcomeEmail` to see the email sending logs

### Option 3: Via Convex MCP (if available)

```typescript
await ctx.runMutation(api.betaSignup.signupForBeta, {
  email: "delivered@resend.dev",
  name: "Test User",
  school: "Test School"
});
```

## Verifying Email Delivery

### Check Convex Logs

1. Go to Convex Dashboard → Logs
2. Look for log entries:
   ```
   [CONVEX M(betaSignup:signupForBeta)] Successfully signed up...
   [CONVEX A(betaSignup:sendBetaWelcomeEmail)] Beta welcome email sent successfully: <email-id>
   ```

### Check Resend Dashboard

1. Go to [Resend Dashboard](https://resend.com/emails)
2. You should see the test email in the emails list
3. Click on it to see details (status, events, etc.)

### Check Webhook Events (if configured)

1. Go to Resend Dashboard → Webhooks
2. Click on your webhook
3. View recent deliveries to see webhook events

## Webhook Configuration

The Resend integration includes webhook support for tracking email delivery status events. This allows you to monitor when emails are delivered, bounced, opened, clicked, etc.

### Setting Up the Webhook

1. **Get your webhook URL from your Convex deployment:**
   ```
   https://[your-deployment-name].convex.site/resend-webhook
   ```
   Replace `[your-deployment-name]` with your actual Convex deployment name (e.g., `happy-leopard-123`)

2. **Create a webhook in Resend Dashboard:**
   - Go to [Resend Dashboard → Webhooks](https://resend.com/webhooks)
   - Click "Create Webhook"
   - Enter your webhook URL: `https://[your-deployment-name].convex.site/resend-webhook`
   - Enable all `email.*` events:
     - `email.sent`
     - `email.delivered`
     - `email.delivery_delayed`
     - `email.bounced`
     - `email.complained`
     - `email.opened`
     - `email.clicked`
   - Click "Create"

3. **Copy the webhook secret:**
   - After creating the webhook, copy the "Signing Secret"
   - This will be used to verify webhook authenticity

4. **Set the webhook secret in your Convex environment:**
   ```bash
   npx convex env set RESEND_WEBHOOK_SECRET <your-webhook-secret>
   ```

5. **Verify webhook is working:**
   - Send a test email using the beta signup flow
   - Check Convex logs for webhook event entries:
     ```
     Email <email-id> event: email.sent
     Email <email-id> event: email.delivered
     ```

### Email Event Handler

The webhook handler is located in `convex/email.ts` as the `handleEmailEvent` internal mutation. It currently logs all email delivery events for monitoring purposes.

**Current implementation:**
- Logs all email events to Convex logs
- Includes event type, timestamp, and recipient email
- Can be extended to store delivery status in database for analytics

**Available event types:**
- `email.sent` - Email was accepted by Resend
- `email.delivered` - Email was successfully delivered to recipient
- `email.delivery_delayed` - Email delivery is delayed
- `email.bounced` - Email bounced (hard or soft)
- `email.complained` - Recipient marked email as spam
- `email.opened` - Recipient opened the email (requires tracking enabled)
- `email.clicked` - Recipient clicked a link in the email (requires tracking enabled)

### Testing Webhook Events

1. **Send a test email:**
   ```bash
   npx convex run betaSignup:signupForBeta '{"email":"delivered@resend.dev","name":"Test User"}'
   ```

2. **Check Convex logs for webhook events:**
   - Go to Convex Dashboard → Logs
   - Look for entries like:
     ```
     Email <id> event: email.sent
     Email <id> event: email.delivered
     ```

3. **View webhook deliveries in Resend:**
   - Go to Resend Dashboard → Webhooks
   - Click on your webhook
   - View recent deliveries to see the webhook payload and response

### Webhook Security

The webhook endpoint automatically verifies the `RESEND_WEBHOOK_SECRET` to ensure requests are coming from Resend. If the secret doesn't match, the webhook will reject the request.

**Important:** Keep your webhook secret secure and never commit it to version control.

## Common Issues and Solutions

### Issue: "Test mode is enabled, but email address is not a valid resend test address"

**Cause:** You're trying to send to a real email address while `testMode: true`

**Solution:** Use a `@resend.dev` test address instead:
```
delivered@resend.dev
```

### Issue: Email not appearing in Resend dashboard

**Possible causes:**
1. `RESEND_API_KEY` environment variable not set
2. API key is invalid
3. Convex function errored before sending

**Solution:**
1. Check environment variables: `npx convex env list`
2. Verify API key in Resend dashboard
3. Check Convex logs for errors

### Issue: Webhook not receiving events

**Possible causes:**
1. Webhook not configured in Resend dashboard
2. `RESEND_WEBHOOK_SECRET` not set or incorrect
3. Webhook URL is wrong

**Solution:**
1. Configure webhook in Resend dashboard (see RESEND_SETUP.md)
2. Set `RESEND_WEBHOOK_SECRET`: `npx convex env set RESEND_WEBHOOK_SECRET <secret>`
3. Verify webhook URL matches your deployment

## Testing Different Scenarios

### Test Successful Delivery
```json
{
  "email": "delivered@resend.dev",
  "name": "Happy Path User"
}
```

### Test Duplicate Signup
```json
// First signup
{
  "email": "delivered+test1@resend.dev",
  "name": "First Signup"
}

// Second signup (should fail with "already registered" message)
{
  "email": "delivered+test1@resend.dev",
  "name": "Duplicate Signup"
}
```

### Test Bounce Handling
```json
{
  "email": "bounced@resend.dev",
  "name": "Bounce Test"
}
```
Then check webhook events for bounce notification.

### Test Spam Complaint
```json
{
  "email": "complained@resend.dev",
  "name": "Complaint Test"
}
```
Then check webhook events for complaint notification.

## Moving to Production

Once you're ready to send to real email addresses:

1. **Verify your domain in Resend:**
   - Go to [Resend Domains](https://resend.com/domains)
   - Add your domain
   - Configure DNS records (SPF, DKIM, DMARC)
   - Wait for verification

2. **Update email addresses:**
   - Change `from` addresses in `convex/email.ts` and `convex/betaSignup.ts`
   - Use your verified domain: `beta@yourdomain.com`

3. **Disable test mode:**
   ```typescript
   const resend: Resend = new Resend(components.resend, {
     testMode: false, // Now you can send to real addresses
   });
   ```

4. **Deploy changes:**
   ```bash
   npx convex deploy
   ```

5. **Test with a real email address:**
   - Use your own email first
   - Verify the email arrives
   - Check formatting and links

## Environment Variables Checklist

Before testing, ensure these are set:

```bash
# Check current environment variables
npx convex env list

# Required for sending emails
npx convex env set RESEND_API_KEY <your-api-key>

# Required for webhook events (optional for basic testing)
npx convex env set RESEND_WEBHOOK_SECRET <your-webhook-secret>
```

## Quick Test Command

```bash
# Test the beta signup flow
npx convex run betaSignup:signupForBeta '{"email":"delivered@resend.dev","name":"Test User"}'
```

## Additional Resources

- [Resend Test Emails Documentation](https://resend.com/docs/dashboard/emails/send-test-emails)
- [Resend Dashboard](https://resend.com/dashboard)
- [Convex Dashboard](https://dashboard.convex.dev)
