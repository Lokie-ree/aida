# Public vs. Private Messaging Strategy

**Date:** November 18, 2025  
**Context:** Grassroots launch with 5 educators, but landing page scales for future users

---

## 🌐 PUBLIC-FACING (Scalable Messaging)

These components are visible to ALL users (current + future) and use **scalable grassroots messaging**:

### Landing Page Components:
✅ **Hero Section** - No "5 educators" language
- "Navigate AI with Confidence"
- "Platform-agnostic guidance for Louisiana educators"
- "Save 3-5 hours per week"

✅ **Testimonials** (`landingPageContent.ts`)
- Removed: "Will you be one of the first 5 educators..."
- Removed: "Starting with 5 Louisiana educators..."
- Removed: "You're one of 5 educators..."
- **Updated to:**
  - "Will you be the first to share your success story?"
  - "We're Not Waiting for LDOE - Louisiana educators building practical AI guidance NOW."
  - "Platform-agnostic frameworks that work with ANY AI tool you already use..."
  - "Real conversations, not automation. Your honest feedback literally shapes what we build next."
  - "10 frameworks designed by Louisiana educators, for Louisiana educators."

✅ **FAQs** (`landingPageContent.ts`)
- "10 frameworks (3 advanced Louisiana-specific + 7 essential productivity frameworks)"
- No mention of "5 educators"

✅ **CTA Section** - No "5 educators" language
- "Ready to Get Started with AI?"
- "Access platform-agnostic AI guidance frameworks"

✅ **Auth Modal** (`AuthModal.tsx`)
- No "5 educators" language
- Clean sign-up flow

✅ **Features Section** - No "5 educators" language
- Platform-agnostic, Louisiana-aligned, ethical guardrails
- "Community-Driven Learning" (scalable)

---

## 🔒 PRIVATE/AUTHENTICATED (Specific to 5 Educators)

These components are ONLY visible AFTER sign-up and can use **specific "5 educators" messaging**:

### Dashboard Components:

✅ **BetaOnboarding** (Welcome flow inside platform)
- Step 1: "Welcome! You're one of 5 educators building this together"
- Step 3: "You're one of 5 educators building this together. Let's stay in touch."
- Step 4: "Just reach out - text, call, or email works"
- **Rationale:** Only the 5 initial users see this onboarding flow

✅ **ProfileSettings** ("Building Together" card)
- Title: "Building Together"
- Badge: "One of 5 Educators"
- Text: "You're one of 5 Louisiana educators building this together. Your feedback literally shapes everything."
- **Rationale:** Only logged-in users see this

✅ **TimeTracking** (Leaderboard)
- Description: "Top time savers (5 educators building together)"
- **Rationale:** Only logged-in users see this, and it will naturally scale as more users join

✅ **Email Templates** (`src/emails/*.tsx`)
- BetaWelcomeEmail: "You're one of 5 Louisiana educators I'm starting with"
- PlatformAccessEmail: "You're one of 5 Louisiana educators building this together"
- WeeklyPromptEmail: "You're one of 5 educators starting this with me"
- **Rationale:** Personal emails sent only to the 5 initial users

---

## 📊 Messaging Strategy Summary

### Public-Facing (Landing Page):
**Tone:** Grassroots, scalable, community-driven
- ✅ "We're Not Waiting for LDOE"
- ✅ "Built by Louisiana educators, for Louisiana educators"
- ✅ "Your feedback shapes what we build next"
- ✅ "Real conversations, not automation"
- ✅ Platform-agnostic (works with ANY AI tool)
- ❌ NO "5 educators" or "one of 5" language

### Private/Authenticated (Dashboard, Emails):
**Tone:** Personal, intimate, grassroots
- ✅ "You're one of 5 educators building this together"
- ✅ "With 5 users, your feedback matters more than anything"
- ✅ Personal signature from Ryan
- ✅ "Just text/call/email me"

---

## 🎯 Key Differentiators

### What Makes Landing Page Scalable:
1. **"Will you be the first?"** (not "one of 5") - Invites anyone to join
2. **"Louisiana educators building together"** (not "5 educators") - Community language
3. **"Your feedback shapes everything"** (not "with 5 users") - Always true
4. **"Real conversations"** (not "no automation for 5") - Core value, scalable

### What Makes Dashboard/Emails Specific:
1. **"One of 5 educators"** - Personal, accurate for initial users
2. **"Your feedback literally shapes everything"** - Emphasized intensity for small group
3. **"Just reach out - text/call/email"** - Personal contact (scales to structured support later)
4. **Personal signature from Ryan** - Founder-led authenticity

---

## 🔄 Scaling Path

### As You Grow from 5 → 30 → 100 users:

**Landing Page:** No changes needed - already scalable ✅

**Dashboard/Emails:** Gradual evolution:
- 5-30 users: Keep "small group" language, but shift to "building together" vs. "one of 5"
- 30-100 users: "Louisiana educators building together", introduce structured support
- 100+ users: "Join Louisiana educators using AI with confidence", community features, support tiers

---

## ✅ Current Status

**Landing Page:** 100% scalable grassroots messaging ✅  
**Dashboard:** Authentic "5 educators" messaging ✅  
**Email Templates:** Personal "5 educators" messaging ✅  

**Ready for launch with:**
- Public page that welcomes all future users
- Private experience that's intimate for the 5 initial users
- Clear scaling path as community grows

---

*Last Updated: November 18, 2025*  
*Strategy: Public scales, Private personalizes* ✨

