# Beta Welcome Experience Content

This directory contains all the content needed for your Welcome Experience as outlined in the one-week beta launch plan.

## Files in This Directory

### 1. AIB-001-parent-communication-framework.md
Complete content for your Parent Communication Framework (first framework).

**Action Required:**
- [ ] Create a new Google Doc
- [ ] Copy all content from this file
- [ ] Add Pelican AI logo at the top (https://pelicanai.org/primary-logo.png)
- [ ] Format headers in Pelican Blue (#0ea5e9)
- [ ] Set sharing to "Anyone with link can view"
- [ ] Copy the shareable link
- [ ] Test the framework yourself using the prompt in 3 AI platforms
- [ ] Update the email template with the actual Google Doc link

### 2. beta-welcome-kit.md
Complete content for your Beta Welcome Kit document.

**Action Required:**
- [ ] Create a new Google Doc
- [ ] Copy all content from this file
- [ ] Add Pelican AI logo at the top
- [ ] Format with Pelican AI brand colors
- [ ] Replace all [Insert link] placeholders with actual URLs:
  - Parent Communication Framework link
  - Post-Framework Survey link
  - Weekly Check-In Survey link
  - Office hours Zoom link (when scheduled)
- [ ] Set sharing to "Anyone with link can view"
- [ ] Copy the shareable link
- [ ] Update the email template with the actual Google Doc link

### 3. post-framework-survey.md
Complete questions and setup instructions for the Post-Framework Survey Google Form.

**Action Required:**
- [ ] Go to forms.google.com
- [ ] Create new form
- [ ] Copy form title and description
- [ ] Add all questions with specified types and options
- [ ] Mark required questions as required
- [ ] Configure settings as specified
- [ ] Test by submitting a response
- [ ] Copy the shareable link
- [ ] Add link to Parent Communication Framework document
- [ ] Add link to Beta Welcome Kit document

### 4. weekly-check-in-survey.md
Complete questions and setup instructions for the Weekly Check-In Google Form.

**Action Required:**
- [ ] Go to forms.google.com
- [ ] Create new form
- [ ] Copy form title and description
- [ ] Add all questions with specified types and options
- [ ] Set up conditional logic for question 2
- [ ] Configure settings as specified
- [ ] Test by submitting a response
- [ ] Copy the shareable link
- [ ] Add link to Beta Welcome Kit document
- [ ] Plan automated Friday email reminder (manual or automated via Convex cron)

## Updated Files

### src/emails/BetaWelcomeEmail.tsx
The Beta Welcome Email template has been updated with:
- ✅ Opening paragraph acknowledging educator pain points
- ✅ Specific 3-5 hour/week time-saving promise
- ✅ Prominent "Try This Right Now" action box with framework link
- ✅ "What Happens Next" timeline section
- ✅ Beta Welcome Kit link with benefits
- ✅ Clear time commitment explanation
- ✅ New visual styles (actionBox and ctaLink)

**Action Required:**
- [ ] Update line 68: Replace `https://docs.google.com/document/d/your-framework-link-here/edit` with actual Parent Communication Framework link
- [ ] Update line 122: Replace `https://docs.google.com/document/d/your-welcome-kit-link-here/edit` with actual Beta Welcome Kit link
- [ ] Test the email by sending to yourself
- [ ] Verify all links work
- [ ] Check email rendering in multiple email clients if possible

## Implementation Sequence

Follow this order for best results:

### Step 1: Create Parent Communication Framework (30-45 minutes)
1. Create Google Doc
2. Copy content from `AIB-001-parent-communication-framework.md`
3. Format with branding
4. Set sharing permissions
5. Get shareable link
6. **Test the framework yourself** - Use the prompt in 3 different AI platforms to verify it works

### Step 2: Create Feedback Forms (20-30 minutes)
1. Create Post-Framework Survey from `post-framework-survey.md`
2. Create Weekly Check-In Survey from `weekly-check-in-survey.md`
3. Test both forms
4. Get shareable links

### Step 3: Create Beta Welcome Kit (45-60 minutes)
1. Create Google Doc
2. Copy content from `beta-welcome-kit.md`
3. Format with branding
4. Replace all [Insert link] placeholders with actual URLs:
   - Framework link (from Step 1)
   - Both survey links (from Step 2)
   - Office hours link (schedule this when ready)
5. Set sharing permissions
6. Get shareable link

### Step 4: Update Email Template (5-10 minutes)
1. Open `src/emails/BetaWelcomeEmail.tsx`
2. Update line 68 with Parent Communication Framework link
3. Update line 122 with Beta Welcome Kit link
4. Deploy to Convex
5. Test by triggering a beta signup

### Step 5: Testing & Validation (15-30 minutes)
1. Send test welcome email to yourself
2. Click all links in the email
3. Navigate through the Welcome Kit
4. Try the Parent Communication Framework with real AI platforms
5. Complete both feedback forms to test user experience
6. Time yourself - does it take under 10 minutes to use the framework?
7. Make any necessary adjustments

## Testing Checklist

Before launching to beta testers:

**Framework Testing:**
- [ ] Prompt works in MagicSchool AI
- [ ] Prompt works in Gemini
- [ ] Prompt works in Claude or ChatGPT
- [ ] Output quality is professional and appropriate
- [ ] Time from start to usable draft is under 10 minutes
- [ ] Instructions are clear for someone who's never used AI

**Email Testing:**
- [ ] Welcome email sends successfully
- [ ] All links are clickable
- [ ] Email renders correctly on desktop
- [ ] Email renders correctly on mobile
- [ ] Links open to correct documents
- [ ] Documents are viewable without sign-in

**Document Testing:**
- [ ] Parent Communication Framework is readable and well-formatted
- [ ] Beta Welcome Kit is readable and well-formatted
- [ ] All internal links work
- [ ] Logo displays correctly
- [ ] Documents can be viewed on mobile devices

**Form Testing:**
- [ ] Post-Framework Survey accepts responses
- [ ] Weekly Check-In Survey accepts responses
- [ ] Conditional logic works in Weekly Check-In
- [ ] Form confirmation messages display correctly
- [ ] Email notifications work for form responses

## URL Tracking

Keep track of all your shareable links here for easy reference:

```
Parent Communication Framework:
https://docs.google.com/document/d/[YOUR-DOC-ID]/edit

Beta Welcome Kit:
https://docs.google.com/document/d/[YOUR-DOC-ID]/edit

Post-Framework Survey:
https://forms.google.com/[YOUR-FORM-ID]

Weekly Check-In Survey:
https://forms.google.com/[YOUR-FORM-ID]

Office Hours Zoom Link:
https://zoom.us/j/[YOUR-MEETING-ID]
```

## Next Steps After Implementation

Once everything is set up and tested:

1. **Launch to First Beta Testers**
   - Start with 3-5 trusted colleagues
   - Get their feedback on the entire experience
   - Refine based on their input

2. **Scale to Full Beta Group**
   - Recruit 30-50 beta testers per recruitment plan
   - Monitor engagement in first week
   - Be ready to provide support

3. **Monitor & Iterate**
   - Check form responses weekly
   - Identify common issues or confusion
   - Update documents as needed (Google Docs make this easy!)

4. **Build Additional Frameworks**
   - Week 2: Assessment Analysis Framework
   - Week 3: Differentiation Support Framework
   - Ongoing: Based on beta tester requests

## Questions or Issues?

If you encounter any issues during implementation:
- Check that all links are using "Anyone with link can view" permissions
- Verify links are using the shareable format (not the editing format)
- Test in incognito/private browsing to simulate user experience
- Make sure Google Docs are not requiring sign-in to view

## Success Metrics to Track

Once launched, monitor these metrics weekly:

- Number of beta signups
- Welcome email open rate
- Framework click-through rate
- Post-Framework Survey response rate
- Weekly Check-In Survey response rate
- Average time saved reported
- Framework clarity ratings
- User feedback themes

Good luck with your launch! 🚀

