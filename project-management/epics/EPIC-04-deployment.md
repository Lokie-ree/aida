# EPIC-04: Deployment & Monitoring

**Epic ID:** EPIC-04
**Title:** Deployment & Monitoring
**Priority:** P0 - Critical
**Estimated Time:** 15 minutes
**Sprint:** Sprint 3

---

## Description

Deploy the redesigned coach interface to production and set up monitoring for the beta launch period (December 9-28, 2024).

## Acceptance Criteria

- [ ] Code committed with descriptive message
- [ ] PR created and reviewed
- [ ] Merged to main branch
- [ ] Production deployment successful
- [ ] Monitoring plan in place
- [ ] Rollback plan documented

---

## Tasks

### Task 4.1: Commit Changes
**Time:** 3 minutes
**Status:** [ ] Not Started

```bash
git add .
git commit -m "Complete coach interface redesign with @prompt-kit components

- Simplified navigation: removed dashboard, minimal header
- Integrated @prompt-kit for professional chat UX
- Library now in Sheet (slide-out pattern)
- Reclaimed 84px vertical space
- Reduced touchpoints from 5+ to 2
- STEM-focused starter prompts for beta testers

Epic: EPIC-02 Core Interface Redesign
Closes: #<issue-number-if-applicable>"
```

### Task 4.2: Push and Create PR
**Time:** 5 minutes
**Status:** [ ] Not Started

```bash
git push origin feature/coach-redesign-prompt-kit
```

**PR Template:**
```markdown
## Summary
Complete overhaul of coach interface using @prompt-kit components.

## Changes
- Simplified routing (removed dashboard route)
- Minimal header (56px, reclaimed 84px vertical space)
- @prompt-kit components for professional chat UX
- Library in Sheet (slide-out pattern)
- STEM-focused starter prompts for beta testers

## Testing
- [ ] Build passes
- [ ] Authentication flow works
- [ ] Chat interface functional
- [ ] Library Sheet works
- [ ] Mobile responsive
- [ ] Cross-browser tested

## Screenshots
[Add before/after screenshots]

## Documentation
See docs/coach-redesign-implementation-plan.md
```

### Task 4.3: Merge to Main
**Time:** 2 minutes
**Status:** [ ] Not Started

```bash
# After PR approval
git checkout main
git pull origin main
git merge feature/coach-redesign-prompt-kit
git push origin main
```

### Task 4.4: Verify Production Deployment
**Time:** 5 minutes
**Status:** [ ] Not Started

**Convex Backend:**
- [ ] Automatic deployment triggered
- [ ] No deployment errors in Convex dashboard
- [ ] Functions accessible

**Frontend (if separate deploy):**
```bash
pnpm build
# Deploy to hosting provider
```

**Production Smoke Test:**
- [ ] Landing page loads
- [ ] Sign in works
- [ ] Coach interface loads
- [ ] Chat works
- [ ] Library Sheet opens

---

## Monitoring Plan

### Week 1: December 9-14 (Generation Phase)

**Metrics to Track:**
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Conversation starts | 5/5 testers start ≥1 | `promptConversations` table |
| Messages per conversation | Avg 10+ | Query conversation length |
| Prompts generated | 10+ total | `generatedPrompts` table |
| Error rate | <1% | Convex logs |
| Page load time | <2s | Browser dev tools |

**Daily Checks:**
- [ ] Check Convex dashboard for errors
- [ ] Monitor conversation activity
- [ ] Review any error logs

### Week 2: December 15-21 (Implementation Phase)

**Metrics to Track:**
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Prompts saved | 2+ per tester | `generatedPrompts` table |
| Library opens | 50%+ users | (Add analytics if needed) |
| Feedback ratings | Collected | `feedbackRating` field |
| "Worked in classroom" | 10+ prompts | `workedInClassroom` flag |

**Feedback Collection:**
- [ ] Check thumbs up/down ratio
- [ ] Review feedback comments
- [ ] Note refinement requests

### Week 3: December 22-28 (Refinement Phase)

**Analysis:**
- [ ] Curate 8-12 high-quality exemplars
- [ ] Analyze what makes prompts "high-quality"
- [ ] Document improvement opportunities
- [ ] Plan post-beta enhancements

---

## Rollback Plan

### Quick Hotfix (Minor Issues)

```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/coach-redesign-issue

# Make fixes
# Test
# Commit and merge

git add .
git commit -m "Fix: <description>"
git push origin hotfix/coach-redesign-issue

# Create PR, merge, deploy
```

### Full Rollback (Critical Issues)

```bash
# Revert the merge commit
git log --oneline  # Find merge commit hash
git revert -m 1 <merge-commit-hash>
git push origin main

# Restore from archive
cp -r src/components/_archived/coach-v1/* src/components/coach/

# Update App.tsx to restore Dashboard route
# Rebuild and deploy
pnpm build
```

### Backup Locations

| Backup | Location |
|--------|----------|
| Code (archived) | `src/components/_archived/coach-v1/` |
| Git history | Previous commits before merge |
| Documentation | `docs/coach-redesign-implementation-plan.md` |
| Project management | `project-management/` folder |

---

## Post-Deployment Checklist

### Immediate (Day 1)

- [ ] All routes working in production
- [ ] No JavaScript errors in console
- [ ] Beta testers can sign in
- [ ] Chat interface functional
- [ ] Library Sheet accessible

### Week 1 Check-in

- [ ] At least 1 conversation per tester
- [ ] No critical bugs reported
- [ ] Error rate <1%
- [ ] Positive initial feedback

### Beta End (Dec 28)

- [ ] Success metrics evaluated
- [ ] Feedback synthesized
- [ ] Improvements documented
- [ ] Post-beta roadmap updated

---

## Dependencies

- **Depends on:** EPIC-03 (Testing & Quality Assurance)
- All tests must pass before deployment

## Completion Checklist

- [ ] Code committed
- [ ] PR created
- [ ] PR reviewed/approved
- [ ] Merged to main
- [ ] Production deployment verified
- [ ] Smoke test passed
- [ ] Monitoring plan active
- [ ] Rollback plan documented
- [ ] Team notified of launch

**Completed:** [ ] Yes / [ ] No
**Completed Date:** ___________
**Notes:**

