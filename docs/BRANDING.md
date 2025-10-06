# EdCoachAI Branding Guide

## Brand Identity

**Primary Brand Name:** EdCoachAI  
**Tagline:** AI for Louisiana Educators  
**Domain:** edcoachai.org  
**Target Audience:** Louisiana K-12 educators

## Brand Colors

EdCoachAI uses a simplified three-color palette defined as CSS custom properties:

- **Primary:** `hsl(var(--primary))` - Main brand color for primary actions and trust
- **Secondary:** `hsl(var(--secondary))` - Supporting brand color for AI features and innovation  
- **Accent:** `hsl(var(--accent))` - Louisiana Gold for highlights, CTAs, and educator focus

### Functional Colors
These colors are used for UI states and are separate from brand colors:
- **Success:** `hsl(var(--success))` - Success states and positive feedback
- **Error:** `hsl(var(--destructive))` - Error states and warnings
- **Warning:** `hsl(var(--warning))` - Attention and important information

### CSS Variables
All colors are defined as CSS custom properties in `src/index.css` for easy theming and maintenance. This approach provides better consistency and easier maintenance across the application.

## Email Branding

### Sender Names

All emails should be sent from **EdCoachAI** with the appropriate subdomain:

```
EdCoachAI <beta@edcoachai.org>      // Beta program emails
EdCoachAI <welcome@edcoachai.org>   // Welcome emails
EdCoachAI <sessions@edcoachai.org>  // Session summaries
EdCoachAI <support@edcoachai.org>   // Support emails
EdCoachAI <noreply@edcoachai.org>   // System notifications
```

### Email Subject Lines

Format: `[Action/Context] - [Specific Detail]`

Examples:
- ✅ "Welcome to EdCoachAI - AI for Louisiana Educators"
- ✅ "Welcome to AI for Louisiana Educators Beta Program!"
- ✅ "Your EdCoachAI Session Summary - 5 interactions"
- ❌ "Welcome to A.I.D.A." (old branding)
- ❌ "AI for LA Educators" (inconsistent)

### Email Header

Standard header for all HTML emails:

```html
<div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
  <h1 style="margin: 0; font-size: 28px;">EdCoachAI</h1>
  <p style="margin: 10px 0 0 0; font-size: 16px;">AI for Louisiana Educators</p>
</div>
```

### Email Footer

Standard footer for all HTML emails:

```html
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center; color: #6B7280; font-size: 14px;">
  <p><strong>EdCoachAI</strong> - AI for Louisiana Educators<br>
  Built with Louisiana educators, for Louisiana educators<br>
  <a href="https://edcoachai.org" style="color: #3B82F6; text-decoration: none;">edcoachai.org</a></p>
</div>
```

## Messaging Guidelines

### Voice & Tone

- **Professional yet approachable:** We're educators speaking to educators
- **Louisiana-focused:** Emphasize local context and standards
- **Empowering:** Focus on how AI helps, not replaces, educators
- **Clear and concise:** Educators are busy—respect their time

### Key Messages

1. **Built by Louisiana educators, for Louisiana educators**
2. **Louisiana Educator Rubric (LER) aligned**
3. **5-minute setup, not 5-hour learning curve**
4. **Ethical AI with built-in guardrails**
5. **Community-driven innovation**

### Terminology

**Use:**
- EdCoachAI (primary brand)
- Louisiana educators
- AI guidance frameworks
- Louisiana Educator Rubric (LER)
- Louisiana standards

**Avoid:**
- A.I.D.A. (legacy name)
- AI for LA Educators (use as tagline only)
- Generic "teachers" (use "educators")
- "Artificial Intelligence" (use "AI")

## Landing Page Branding

### Hero Section

- **Main Headline:** "AI for Louisiana" (with gradient)
- **Secondary Headline:** "Educators"
- **Badge:** "Louisiana Educator Rubric Native" + "Beta Program"

### Value Proposition

Focus on:
1. Time savings (75% less setup time)
2. Louisiana alignment (LER, state standards)
3. Ease of use (5-minute setup)
4. Community (built by/for LA educators)

## Resend Configuration

### Current Setup

- **Domain:** edcoachai.org ✅
- **Test Mode:** Enabled (for development)
- **Verified:** Yes (already configured in Resend)

### Email Addresses in Use

```
beta@edcoachai.org      // Beta program signups
welcome@edcoachai.org   // Welcome emails
sessions@edcoachai.org  // Session summaries
```

### To Add (Future)

```
support@edcoachai.org   // Customer support
noreply@edcoachai.org   // System notifications
team@edcoachai.org      // Team communications
```

## Files Updated

### Email Branding
- ✅ `convex/betaSignup.ts` - Beta welcome email
- ✅ `convex/email.ts` - Welcome and session emails

### Landing Page
- ⏳ `src/components/LandingPage.tsx` - May need brand alignment review

### Documentation
- ✅ `docs/RESEND_SETUP.md` - Email configuration
- ✅ `docs/RESEND_TESTING.md` - Testing guide
- ✅ `docs/BRANDING.md` - This document

## Brand Consistency Checklist

Before any public-facing communication:

- [ ] Uses "EdCoachAI" as primary brand name
- [ ] Includes "AI for Louisiana Educators" tagline where appropriate
- [ ] Uses edcoachai.org domain for emails
- [ ] Follows color palette (blue/gold primary)
- [ ] Emphasizes Louisiana context
- [ ] Professional yet approachable tone
- [ ] Clear call-to-action
- [ ] Includes edcoachai.org link in footer

## Next Steps

1. ✅ Email branding aligned with EdCoachAI
2. ⏳ Review landing page for brand consistency
3. ⏳ Create email templates for other use cases
4. ⏳ Design email signature for team
5. ⏳ Create social media branding guidelines
