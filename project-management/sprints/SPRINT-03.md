# Sprint 3: Testing & Launch

**Sprint ID:** SPRINT-03
**Duration:** 1.25 hours
**Goal:** Test all functionality, deploy to production, and set up monitoring

---

## Sprint Overview

| Attribute | Value |
|-----------|-------|
| Start Date | December 4, 2024 |
| Epic(s) | EPIC-03: Testing, EPIC-04: Deployment |
| Total Tasks | 12 |
| Estimated Time | 1.25 hours |

---

## Sprint Backlog

### Testing Phase (60 minutes)

#### Task 1: Build Verification
**Time:** 5 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done

```bash
pnpm lint
pnpm build
```

**Definition of Done:**
- [ ] No TypeScript errors
- [ ] No lint errors
- [ ] Build completes successfully

---

#### Task 2: Authentication Flow Testing
**Time:** 10 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done

| Test | Expected Result | Pass? |
|------|-----------------|-------|
| Sign up from landing | Account created, redirect to /coach | [ ] |
| Log in | Redirect to /coach | [ ] |
| Auth user visits / | Redirect to /coach | [ ] |
| Unauth user visits /coach | Redirect to / | [ ] |
| Sign out | Signs out, redirect to / | [ ] |

---

#### Task 3: Chat Interface Testing
**Time:** 15 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done

| Test | Expected Result | Pass? |
|------|-----------------|-------|
| Empty state displays | Welcome + 4 starter prompts | [ ] |
| Click starter prompt | Message sent to AI | [ ] |
| AI responds | Response with markdown | [ ] |
| Loading indicator | Shows while thinking | [ ] |
| Type and send message | Message in history | [ ] |
| Auto-scroll | Scrolls to bottom | [ ] |
| Start New Conversation | Clears messages | [ ] |
| Conversation persists | After page reload | [ ] |

---

#### Task 4: Library Sheet Testing
**Time:** 10 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done

| Test | Expected Result | Pass? |
|------|-----------------|-------|
| "My Prompts" button visible | Bottom-right, fixed | [ ] |
| Click opens Sheet | Slides from right | [ ] |
| Backdrop dims content | Overlay visible | [ ] |
| Click outside closes | Sheet closes | [ ] |
| Empty state | Message + CTA button | [ ] |
| Prompts display | Cards with content | [ ] |
| Copy button | Copies to clipboard | [ ] |
| "Copied!" shows | For 2 seconds | [ ] |
| Delete works | Prompt removed | [ ] |

---

#### Task 5: Responsive Testing
**Time:** 10 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done

**Mobile (375px):**
| Test | Pass? |
|------|-------|
| Header fits one line | [ ] |
| Chat readable | [ ] |
| Input visible | [ ] |
| My Prompts accessible | [ ] |
| Sheet full-width | [ ] |

**Tablet (768px):**
| Test | Pass? |
|------|-------|
| Layout optimal | [ ] |
| 2-column prompts | [ ] |

**Desktop (1024px+):**
| Test | Pass? |
|------|-------|
| Layout optimal | [ ] |
| Sheet max-width | [ ] |

---

#### Task 6: Theme & Cross-Browser
**Time:** 10 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done

**Theme:**
| Test | Pass? |
|------|-------|
| Toggle to dark | [ ] |
| Toggle to light | [ ] |
| Persists on reload | [ ] |

**Chrome:**
| Test | Pass? |
|------|-------|
| All features work | [ ] |
| No console errors | [ ] |

**Firefox:**
| Test | Pass? |
|------|-------|
| All features work | [ ] |
| No console errors | [ ] |

---

### Deployment Phase (15 minutes)

#### Task 7: Commit Changes
**Time:** 3 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done

```bash
git add .
git commit -m "Complete coach interface redesign with @prompt-kit components

- Simplified navigation: removed dashboard, minimal header
- Integrated @prompt-kit for professional chat UX
- Library now in Sheet (slide-out pattern)
- Reclaimed 84px vertical space
- Reduced touchpoints from 5+ to 2
- STEM-focused starter prompts for beta testers"
```

**Definition of Done:**
- [ ] All changes staged
- [ ] Commit message descriptive
- [ ] Commit successful

---

#### Task 8: Push and Create PR
**Time:** 5 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done

```bash
git push origin feature/coach-redesign-prompt-kit
```

**PR Checklist:**
- [ ] Title: "Coach Interface Redesign - @prompt-kit Integration"
- [ ] Description includes changes summary
- [ ] Screenshots attached (before/after)
- [ ] Testing checklist included
- [ ] Links to documentation

---

#### Task 9: Merge to Main
**Time:** 2 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done

```bash
git checkout main
git pull origin main
git merge feature/coach-redesign-prompt-kit
git push origin main
```

**Definition of Done:**
- [ ] PR approved (if team review required)
- [ ] Merged without conflicts
- [ ] Pushed to main

---

#### Task 10: Verify Production
**Time:** 5 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done

**Production Smoke Test:**
| Test | Pass? |
|------|-------|
| Landing page loads | [ ] |
| Sign in works | [ ] |
| Coach interface loads | [ ] |
| Chat works | [ ] |
| Library opens | [ ] |
| No console errors | [ ] |

---

### Monitoring Setup

#### Task 11: Document Monitoring Plan
**Time:** Already documented in EPIC-04

**Week 1 Monitoring (Dec 9-14):**
- [ ] Daily check Convex dashboard
- [ ] Track conversation starts
- [ ] Monitor error rates
- [ ] Review any issues

---

#### Task 12: Confirm Rollback Ready
**Time:** 2 min | **Status:** [ ] Todo → [ ] In Progress → [ ] Done

**Verify:**
- [ ] Backup exists at `src/components/_archived/coach-v1/`
- [ ] Git history has previous commits
- [ ] Rollback commands documented in EPIC-04

---

## Bug Tracking

### Critical (Must Fix Before Launch)
| Bug | Status | Fix Applied |
|-----|--------|-------------|
| | | |

### Major (Should Fix)
| Bug | Status | Fix Applied |
|-----|--------|-------------|
| | | |

### Minor (Track for Post-Beta)
| Bug | Status |
|-----|--------|
| | |

---

## Sprint Notes

### Issues Encountered
| Issue | Resolution |
|-------|------------|
| | |

### Last-Minute Changes
| Change | Reason |
|--------|--------|
| | |

---

## Launch Confirmation

### Pre-Launch Checklist
- [ ] All tests passed
- [ ] Code committed and merged
- [ ] Production deployment verified
- [ ] Monitoring plan in place
- [ ] Rollback plan documented
- [ ] Team notified (if applicable)

### Launch Sign-Off

**Ready for Beta Launch:** [ ] Yes / [ ] No

**Blockers (if No):**
- 

**Sign-Off:**
- Name: ___________
- Date: ___________
- Time: ___________

---

## Sprint Retrospective

**What went well:**
- 

**What could be improved:**
- 

**Lessons learned:**
- 

---

## Completion Summary

| Metric | Value |
|--------|-------|
| Tasks Completed | /12 |
| Tests Passed | /all |
| Bugs Found | |
| Bugs Fixed | |
| Actual Time | hours |

**Sprint Status:** [ ] Complete / [ ] Incomplete

**Production Status:** [ ] Deployed / [ ] Pending

**Date Completed:** ___________

