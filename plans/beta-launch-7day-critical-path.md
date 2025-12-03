# Beta Launch: 7-Day Critical Path Plan

**Type:** Launch Readiness
**Priority:** Critical
**Target Launch:** December 9, 2025
**Timeline:** 7 days (Dec 2-9)
**Scope:** 5 Louisiana K-12 educators (grassroots beta)

---

## Core Philosophy

**Launch Goal:** Get 5 teachers successfully using the conversational coach to generate Louisiana-aligned prompts.

**Critical Path Only:**
- Fix friction points that would block beta users
- Test the happy path end-to-end
- Manual processes are fine for 5 users
- Ship fast, iterate during beta

---

## Critical Fixes (Must-Have for Dec 9)

### 1. Starter Prompt Pre-Fill ⏱️ 1 hour

**Problem:** Clicking starter prompts doesn't pre-fill the input, adding friction.

**Fix:**
```typescript
// src/components/coach/ChatInterface.tsx
const handleStarterPrompt = (text: string) => {
  onStartNew();
  setInputValue(text);
  setTimeout(() => inputRef.current?.focus(), 100);
};
```

**Test:** Click starter prompt → input pre-fills → user can edit → send

---

### 2. Magic Link Email Voice ⏱️ 1 hour

**Problem:** Email has generic corporate tone, not Louisiana-teacher voice.

**Fix:** Update `convex/email.ts:sendMagicLinkEmail`
- Subject: "Your Pelican AI sign-in link (expires in 5 min)"
- Greeting: "Hey there! 👋"
- CTA: "Click the button below to sign in and start creating Louisiana-aligned prompts"
- Footer: "Questions? Just reply—I read every one. – Pelican AI Team"

**Test:** Send test email to personal address, verify tone + formatting

---

### 3. Profile Completion Enforcement ⏱️ 2 hours

**Problem:** Can users skip profile and access `/coach`?

**Fix:** Create route guard
```typescript
// src/components/routes/CoachRoute.tsx (NEW)
export function CoachRoute() {
  const profile = useQuery(api.userProfiles.getCurrentProfile);

  if (!profile || !profile.gradeLevel || !profile.subject) {
    return <Navigate to="/profile" state={{
      message: "Complete your profile to personalize coaching",
      returnTo: "/coach"
    }} />;
  }

  return <PromptCoach />;
}
```

**Test:** Try accessing `/coach` without profile → redirects → complete profile → access granted

---

### 4. Basic Mobile Testing ⏱️ 2 hours

**Focus:** iPhone + Android, chat interface only

**Test Scenarios:**
1. Open `/coach` on mobile
2. Type message in input (keyboard doesn't obscure input)
3. Send message (button reachable with thumb)
4. Receive response (readable)
5. Copy prompt (button works)

**Devices:** Any iPhone (Safari) + any Android (Chrome) - doesn't need to be specific models

---

### 5. End-to-End Flow Test ⏱️ 2 hours

**Complete user journey:**
1. Landing page → beta signup form
2. Manual approval (admin manually updates DB or uses Convex dashboard)
3. Welcome email sent (manual trigger for beta: `pnpm convex run email:sendBetaWelcomeEmail '{"email":"test@example.com","name":"Test Teacher","school":"Test School"}'`)
4. Click magic link → sign in
5. Complete profile (grade, subject, school)
6. Navigate to `/coach`
7. Send message → receive response
8. Generate prompt → copy → save to library
9. View saved prompts in dashboard

**Pass Criteria:** Can complete full flow without errors or confusion

---

## Nice-to-Have (If Time Permits)

### 6. Save Dialog Context Pre-Population ⏱️ 2 hours
Pre-fill grade/subject when saving prompts (requires conversation metadata extraction)

**Decision:** Skip for launch - users can manually enter (it's 2 fields)

### 7. Premature Generation Prevention ⏱️ 3 hours
Enhanced system prompt to ask clarifying questions before generating

**Decision:** Test during beta - current system prompt may already handle this

### 8. RAG Namespace Fallback ⏱️ 4 hours
Complex error handling if Louisiana standards/rubric missing

**Decision:** Skip - RAG data is ingested, no fallback needed for 5-user beta

---

## Manual Processes (Fine for 5 Users)

### Beta Approval Workflow
1. User submits beta signup form
2. Admin checks `betaSignups` table in Convex dashboard
3. Admin manually updates `status: "approved"` in dashboard
4. Admin manually sends welcome email via CLI:
   ```bash
   pnpm convex run email:sendBetaWelcomeEmail '{"email":"user@example.com","name":"Jane Doe","school":"Lafayette Elementary"}'
   ```

**Why manual is OK:** 5 signups = 10 minutes of admin work total

### Error Monitoring
- Check Convex logs daily (dashboard)
- Respond to beta tester emails within 24 hours
- No automated alerts needed for 5 users

---

## Daily Implementation Schedule

### **Day 1 (Dec 2) - Critical Fixes**
- [ ] Implement starter prompt pre-fill
- [ ] Update magic link email voice
- [ ] Test both changes locally

### **Day 2 (Dec 3) - Profile Guard**
- [ ] Create CoachRoute with profile enforcement
- [ ] Update routing in App.tsx
- [ ] Test profile completion flow

### **Day 3 (Dec 4) - End-to-End Testing**
- [ ] Run complete user journey test
- [ ] Document any issues found
- [ ] Fix critical blockers

### **Day 4 (Dec 5) - Mobile Testing**
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Fix any mobile-specific issues

### **Day 5 (Dec 6) - Polish & Deploy**
- [ ] Run final smoke tests
- [ ] Deploy frontend to production
- [ ] Verify production environment variables
- [ ] Test production deployment

### **Day 6-7 (Dec 7-8) - Buffer**
- [ ] Fix any last-minute issues
- [ ] Prepare welcome email copy
- [ ] Document manual approval process
- [ ] Final production test

### **Day 8 (Dec 9) - Launch**
- [ ] Morning smoke test
- [ ] Approve first beta signups
- [ ] Send welcome emails
- [ ] Monitor for issues

---

## Acceptance Criteria (Launch Checklist)

### Core Functionality
- [ ] Starter prompts pre-fill message input
- [ ] Magic link email has Louisiana-teacher voice
- [ ] Profile completion required to access `/coach`
- [ ] Chat interface works on mobile (iPhone Safari + Android Chrome)
- [ ] Users can generate, copy, and save prompts
- [ ] Saved prompts appear in library

### User Journey
- [ ] Complete flow tested: signup → profile → coach → prompt → save
- [ ] No critical errors in Convex logs
- [ ] Production deployment verified

### Manual Processes Documented
- [ ] Beta approval process documented
- [ ] Welcome email CLI command tested
- [ ] Error monitoring plan in place

---

## Success Metrics (Week 1: Dec 9-14)

**Primary Goals:**
- ✅ All 5 beta testers complete profile
- ✅ All 5 start at least one conversation
- ✅ 10+ prompts generated total (average 2 per teacher)
- ✅ 80%+ copy rate (users click "Copy" button)

**Acceptable Metrics:**
- 3/5 teachers provide qualitative feedback
- 70%+ of prompts rated helpful (👍)
- 5+ prompts marked "worked in classroom"

**Red Flags to Monitor:**
- Magic link delivery failures
- Mobile keyboard obscuring input
- Profile form confusion
- Coach not asking clarifying questions

---

## Risk Mitigation

### Risk 1: Magic Link Expiration
**Likelihood:** Medium
**Mitigation:** Email copy emphasizes 5-minute expiration
**Fallback:** Manual password reset via Convex dashboard

### Risk 2: Mobile Keyboard Issues
**Likelihood:** Medium
**Mitigation:** Test on real devices (iPhone + Android)
**Fallback:** Instruct users to use desktop for beta

### Risk 3: Coach Generates Generic Prompts
**Likelihood:** Low (system prompt is Louisiana-specific)
**Mitigation:** Test with vague requests during Day 3
**Fallback:** Refine system prompt based on beta feedback

### Risk 4: Profile Form Confusion
**Likelihood:** Low
**Mitigation:** Clear field labels and helper text
**Fallback:** Admin manually populates profiles if needed

---

## What We're NOT Doing (Deferred to Post-Beta)

- ❌ Admin approval UI (manual via dashboard is fine)
- ❌ Automated welcome emails (manual CLI command)
- ❌ Complex RAG fallback logic (data is ingested)
- ❌ Conversation history UI (users start fresh each time)
- ❌ Extensive device testing (iPhone + Android only)
- ❌ Louisiana alignment indicators in UI (prompts mention LER/LSS naturally)
- ❌ Error message copy refinement (generic errors are fine for 5 users)
- ❌ Premature generation prevention logic (test current behavior first)
- ❌ Save dialog context pre-population (manual entry is OK)

---

## Post-Launch Monitoring (Dec 9-14)

### Daily Checks
- [ ] Check Convex error logs (5 min)
- [ ] Monitor conversation starts (Convex dashboard)
- [ ] Track prompts generated (Convex dashboard)
- [ ] Respond to beta tester emails (<24 hours)

### Mid-Week Check-In (Dec 12)
- [ ] Review qualitative feedback
- [ ] Identify high-quality prompts for exemplar library
- [ ] Document any recurring issues
- [ ] Plan Week 2 improvements (if needed)

---

## Technical Constraints

### Browser Support
- Chrome/Safari (latest)
- Firefox (latest)
- **No IE11 support**

### Device Support
- iPhone (iOS 15+, Safari)
- Android (Android 10+, Chrome)
- Desktop (1280px+ width)

### Performance Targets
- Chat interface loads <1.5s
- GPT-4o response <5s
- No rate limiting needed (5 users)

---

## Estimated Total Effort

**Critical Fixes:** 6-8 hours
**Testing:** 4 hours
**Deploy & Polish:** 2 hours
**Total:** **12-14 hours over 7 days**

**Buffer:** 5-6 days for unexpected issues

---

## Decision Log

**Why manual processes?**
- 5 users = minimal admin overhead
- Focus development time on user-facing features
- Can automate later if we scale to 30+ users

**Why skip RAG fallback?**
- Louisiana data is already ingested
- Complex error handling not needed for controlled beta
- Can add if real issues emerge

**Why minimal mobile testing?**
- Chat interface is responsive by design
- Testing 2 devices (iPhone + Android) covers 95% of Louisiana teachers
- Can expand testing post-beta

**Why defer conversation history?**
- Not critical for generating first prompts
- Users can still save prompts to library
- Can add based on beta feedback

---

## Launch Day Checklist (Dec 9)

### Morning (Pre-Launch)
- [ ] Final production smoke test
- [ ] Verify Convex environment variables
- [ ] Verify Resend API key
- [ ] Check OpenAI API key + credits

### Launch (First Signups)
- [ ] Approve beta signups in Convex dashboard
- [ ] Send welcome emails via CLI
- [ ] Monitor magic link click rates

### Evening (End of Day 1)
- [ ] Check Convex error logs
- [ ] Count conversation starts
- [ ] Count prompts generated
- [ ] Respond to any beta tester questions

---

## Success Definition

**Week 1 Success = All 5 teachers generate at least 1 Louisiana-aligned prompt they can use in their classroom.**

That's it. Everything else is nice-to-have.

---

**Plan Status:** ✅ Ready to Execute
**Next Step:** Begin Day 1 implementation (starter prompt pre-fill + magic link email)
