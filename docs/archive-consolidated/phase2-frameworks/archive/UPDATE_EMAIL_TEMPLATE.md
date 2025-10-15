# Quick Guide: Update Email Template URLs

## What You Need

After creating your Google Docs, you need to update two placeholder URLs in the email template.

## Step-by-Step Instructions

### 1. Get Your Google Doc URLs

**Parent Communication Framework:**
1. Open your Google Doc with the framework content
2. Click "Share" button (top right)
3. Make sure it's set to "Anyone with link can view"
4. Click "Copy link"
5. Save this URL - you'll need it in a moment

**Beta Welcome Kit:**
1. Open your Google Doc with the welcome kit content
2. Click "Share" button (top right)
3. Make sure it's set to "Anyone with link can view"
4. Click "Copy link"
5. Save this URL

### 2. Update the Email Template

Open `src/emails/BetaWelcomeEmail.tsx` in your code editor.

**First Update - Line 68:**

Find this line:
```tsx
<Link href="https://docs.google.com/document/d/your-framework-link-here/edit" style={ctaLink}>
```

Replace with:
```tsx
<Link href="YOUR_PARENT_COMMUNICATION_FRAMEWORK_URL" style={ctaLink}>
```

**Second Update - Line 122:**

Find this line:
```tsx
<Link href="https://docs.google.com/document/d/your-welcome-kit-link-here/edit" style={ctaLink}>
```

Replace with:
```tsx
<Link href="YOUR_BETA_WELCOME_KIT_URL" style={ctaLink}>
```

### 3. Save and Deploy

```bash
# Save the file (Ctrl+S or Cmd+S)

# If Convex dev is already running, changes auto-deploy
# If not, start it:
npx convex dev
```

### 4. Test the Email

**Option A: Trigger a Beta Signup**
1. Go to your landing page
2. Fill out the beta signup form
3. Check your email for the welcome message
4. Click both links to verify they work

**Option B: Use Convex Dashboard**
1. Go to Convex dashboard
2. Navigate to Functions
3. Find `email:sendBetaWelcomeEmail`
4. Run it manually with test parameters:
```json
{
  "name": "Test User",
  "email": "your.email@example.com",
  "school": "Test School"
}
```
5. Check your email

### 5. Verify Everything Works

Checklist:
- [ ] Welcome email arrives in inbox
- [ ] Both links are blue and underlined (CTA style)
- [ ] Clicking framework link opens the framework Google Doc
- [ ] Framework doc is viewable without signing in
- [ ] Clicking welcome kit link opens the welcome kit Google Doc
- [ ] Welcome kit doc is viewable without signing in
- [ ] Email looks good on desktop
- [ ] Email looks good on mobile (if possible to test)

## Common Issues

### Issue: "You need permission to access this document"
**Cause:** Google Doc sharing not set correctly  
**Fix:** Open the doc → Share → Change to "Anyone with link can view"

### Issue: Link goes to editing view instead of viewing
**Cause:** URL format  
**Fix:** Use the URL exactly as Google provides it when you click "Copy link"

### Issue: Changes not showing up
**Cause:** Convex not redeployed  
**Fix:** Make sure `npx convex dev` is running, or run `npx convex deploy` manually

### Issue: Email not sending
**Cause:** Various  
**Fix:** Check Convex logs for errors, verify Resend integration is working

## Need Help?

If you run into issues:
1. Check the Convex dashboard logs for error messages
2. Verify both Google Docs have correct sharing permissions
3. Try the links in an incognito/private browser window
4. Make sure you saved the file after making changes

## You're Done! 🎉

Once both links work, your Welcome Experience is complete and ready for beta testers.

Next step: Recruit your first 3-5 trusted colleagues for soft launch testing!
