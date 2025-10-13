# Beta Welcome Experience - Implementation Guide

**Purpose:** Step-by-step instructions for creating Google Docs, Forms, and email templates for Phase 1 beta launch.

---

## 🚀 Quick Start

Follow this sequence for best results:

1. **Create Framework Document** (30-45 minutes)
2. **Create Feedback Forms** (20-30 minutes)
3. **Create Welcome Kit** (45-60 minutes)
4. **Update Email Templates** (15-20 minutes)
5. **Test Everything** (15-30 minutes)

---

## Step 1: Create Lesson Objective Unpacker Framework

**Time:** 30-45 minutes

### Instructions
1. Create new Google Doc
2. Copy content from `AIB-001-lesson-objective-unpacker.md`
3. Add Pelican AI logo at top (https://pelicanai.org/primary-logo.png)
4. Format headers in Pelican Blue (#0ea5e9)
5. Set sharing to "Anyone with link can view"
6. Get shareable link
7. **CRITICAL:** Test the framework yourself with 2-3 different lesson objectives

### Testing Requirements
- [ ] Test with ELA objectives
- [ ] Test with Math objectives
- [ ] Test with different grade levels (elementary, middle, high school)
- [ ] Test in MagicSchool AI
- [ ] Test in Gemini or Claude/ChatGPT
- [ ] Verify success criteria are student-friendly
- [ ] Confirm misconception predictions are realistic
- [ ] Ensure scaffold suggestions are actionable
- [ ] Time from start to usable output is under 5 minutes

---

## Step 2: Create Feedback Forms

**Time:** 20-30 minutes

### Post-Framework Survey
1. Go to forms.google.com
2. Create new form
3. Copy content from `post-framework-survey.md`
4. Add all questions with specified types
5. Mark required questions as required
6. Test by submitting a response
7. Copy shareable link

### Weekly Check-In Survey
1. Go to forms.google.com
2. Create new form
3. Copy content from `weekly-check-in-survey.md`
4. **Important:** Question 5 asks "What's your biggest pain point this week?" - this is KEY for co-creation
5. Set up conditional logic for question 2
6. Test by submitting a response
7. Copy shareable link

---

## Step 3: Create Beta Welcome Kit

**Time:** 45-60 minutes

### Instructions
1. Create new Google Doc
2. Copy content from `beta-welcome-kit.md`
3. Add Pelican AI logo and branding
4. Replace ALL [Insert link] placeholders with actual URLs:
   - Lesson Objective Unpacker Framework link (from Step 1)
   - Post-Framework Survey link (from Step 2)
   - Weekly Check-In Survey link (from Step 2)
   - Office hours Zoom link (schedule when ready)
5. Set sharing to "Anyone with link can view"
6. Get shareable link

---

## Step 4: Update Email Templates

**Time:** 15-20 minutes

### Files to Update

1. **`src/emails/BetaWelcomeEmail.tsx`**
   - Update line 68: Replace placeholder with actual Framework link
   - Update line 122: Replace placeholder with actual Welcome Kit link
   - Update copy to reference "lesson planning" and "success criteria"

2. **`src/emails/WeeklyPromptEmail.tsx`**
   - Set default frameworkTitle to "Lesson Objective Unpacker & Success Criteria Builder"
   - Add co-creation messaging about sharing pain points

3. **Deploy to Convex**
   ```bash
   npx convex deploy
   ```

4. **Test by triggering beta signup**

---

## Step 5: Testing & Validation

**Time:** 15-30 minutes

### Email Testing
- [ ] Send test welcome email to yourself
- [ ] Click all links in the email
- [ ] Verify email renders correctly on desktop
- [ ] Verify email renders correctly on mobile
- [ ] Confirm links open to correct documents
- [ ] Ensure documents are viewable without sign-in

### Document Testing
- [ ] Framework is readable and well-formatted
- [ ] Welcome Kit is readable and well-formatted
- [ ] All internal links work within documents
- [ ] Logo displays correctly in all documents
- [ ] Documents can be viewed on mobile devices
- [ ] Code blocks (prompts) are clearly formatted and copy-pasteable

### Form Testing
- [ ] Post-Framework Survey accepts responses
- [ ] Weekly Check-In Survey accepts responses
- [ ] Conditional logic works in Weekly Check-In
- [ ] Form confirmation messages display correctly
- [ ] Email notifications work for form responses

### Framework Testing
- [ ] Prompt works with different subject areas
- [ ] Prompt works with different grade levels
- [ ] Success criteria are genuinely student-friendly
- [ ] Misconception predictions are realistic and helpful
- [ ] Scaffold suggestions are practical and actionable
- [ ] Time from start to usable output is under 5 minutes
- [ ] Instructions are clear for someone who's never used AI

---

## URL Tracking

Keep track of all shareable links for easy reference:

```
AIB-001: Lesson Objective Unpacker Framework:
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

---

## Troubleshooting

### Common Issues

**Links not working:**
- Check that all links use "Anyone with link can view" permissions
- Verify links are using the shareable format (not the editing format)
- Test in incognito/private browsing to simulate user experience
- Make sure Google Docs are not requiring sign-in to view

**Email not sending:**
- Check Convex deployment logs
- Verify Resend API key is configured
- Confirm email templates are deployed
- Test with a different email address

**Forms not accepting responses:**
- Verify form settings allow responses
- Check that required fields are properly configured
- Test conditional logic pathways

---

## Next Steps After Implementation

### Launch to First Beta Testers
1. Start with 3-5 trusted colleagues
2. Get their feedback on the entire experience
3. Refine based on their input

### Scale to Full Beta Group
1. Recruit 20+ beta testers per recruitment plan
2. Monitor engagement in first week
3. Be ready to provide support

### Monitor & Iterate
1. Check form responses weekly
2. Identify common issues or confusion
3. Update documents as needed (Google Docs make this easy!)

---

## Questions or Issues?

If you encounter issues during implementation:
- Refer to troubleshooting section above
- Check `.cursorrules` for Phase 1 MVP scope
- Review `docs/beta-content/STRATEGY.md` for strategic context
- Consult `scripts/troubleshooting-guide.md` for technical issues

---

## References

- **Strategy:** `docs/beta-content/STRATEGY.md`
- **Framework Content:** `docs/beta-content/AIB-001-lesson-objective-unpacker.md`
- **Welcome Kit:** `docs/beta-content/beta-welcome-kit.md`
- **Surveys:** `docs/beta-content/post-framework-survey.md`, `docs/beta-content/weekly-check-in-survey.md`

