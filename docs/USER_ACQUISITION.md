# User Acquisition Strategy

**Date:** November 3, 2025  
**Status:** Beta Launch Preparation

---

## Overview

This document outlines the user acquisition strategy for Pelican AI beta launch, focusing on reaching Louisiana educator networks and organizations.

---

## Email Templates

### 1. Initial Outreach Email (`OutreachEmail.tsx`)

**Purpose:** Cold outreach to Louisiana educator networks, individual teachers, district coordinators

**Subject Line:** "AI Guidance Built for Louisiana Educators - Beta Invitation"

**Key Messaging:**
- Time-saving value proposition (3-5 hours/week)
- Louisiana-specific alignment (standards, LER, LEADS)
- Platform-agnostic approach (works with ANY AI tool)
- Beta program invitation

**Personalization Fields:**
- `recipientName` - Name of recipient
- `districtName` - Optional district name
- `schoolName` - Optional school name

**CTA:** "Join the Beta Program" button

**Best Practices:**
- Personalize with district/school name when available
- Focus on immediate value (time savings)
- Emphasize Louisiana context
- Include social proof/testimonials

---

### 2. Follow-up Email (`FollowupEmail.tsx`)

**Purpose:** Re-engage non-responders after 1 week

**Subject Line:** "Quick Follow-up: AI Guidance for Louisiana Educators"

**Key Messaging:**
- Light touch, respectful of recipient's time
- Practical example they can try immediately
- Value-focused (no heavy sales pitch)
- Social proof

**Personalization Fields:**
- `recipientName` - Name of recipient

**CTA:** "Learn More & Join Beta" button

**Best Practices:**
- Send 7-10 days after initial outreach
- Include actionable example (copy-paste prompt)
- Soft CTA (not pushy)
- Leave door open for questions

---

### 3. Network Partner Email (`NetworkPartnerEmail.tsx`)

**Purpose:** Outreach to Louisiana education organizations, networks, and associations

**Subject Line:** "Partner Opportunity: AI Guidance Platform for Louisiana Educators"

**Key Messaging:**
- Partnership/collaboration angle
- Benefits for organization members
- Co-creation opportunities
- Beta program invitation for members

**Personalization Fields:**
- `organizationName` - Name of organization/network
- `contactName` - Name of contact person

**CTA:** "Schedule a Conversation" button

**Best Practices:**
- Focus on mutual benefit
- Highlight support for their mission
- Offer collaboration opportunities
- Professional, partnership-oriented tone

---

## Target Audiences

### Primary Audience: Louisiana Educators

**Sub-groups:**
1. **Individual Teachers**
   - K-12 teachers across all subjects
   - Active in professional development
   - Early adopters of technology
   - Located in various Louisiana districts

2. **District Coordinators**
   - Curriculum coordinators
   - Technology integration specialists
   - Professional development coordinators

3. **School Administrators**
   - Principals
   - Assistant principals
   - Instructional coaches

### Secondary Audience: Education Organizations

**Types:**
- Louisiana teacher associations
- Professional development networks
- Education technology groups
- Curriculum alignment organizations

---

## Outreach Channels

### 1. Direct Email
- Use OutreachEmail template for initial contact
- Personalize where possible (district, school, subject area)
- Follow up with FollowupEmail after 1 week

### 2. Organization Partnerships
- Use NetworkPartnerEmail for associations/networks
- Offer co-branding and collaboration opportunities
- Provide early access for members

### 3. Social Media
- Share beta program announcement
- Highlight Louisiana-specific value
- Engage with Louisiana educator communities

### 4. Professional Development Events
- Present at Louisiana education conferences
- Host workshops on AI integration
- Provide resources for PD sessions

---

## Messaging Pillars

### 1. Time-Saving
- "Save 3-5 hours per week"
- Practical examples with time savings
- Real impact on work-life balance

### 2. Louisiana-Specific
- Aligned to Louisiana standards
- Louisiana Educator Rubric integration
- Louisiana LEADS framework alignment
- Understanding of district policies

### 3. Platform-Agnostic
- Works with ANY AI tool
- No vendor lock-in
- Use tools already provided by district
- Flexible approach

### 4. Ethical & Responsible
- Built-in ethical guardrails
- Academic integrity focus
- FERPA compliance
- Professional judgment emphasized

### 5. Educator-Led
- Built by Louisiana educators
- Co-creation opportunities
- Responsive to user feedback
- Practical, not theoretical

---

## Call-to-Action Strategy

### Primary CTA: "Join the Beta Program"
- Links to: `https://pelicanai.org` (landing page with beta signup)
- Value proposition: Immediate platform access, shape future development

### Secondary CTAs:
- "Schedule a Conversation" (for organizations)
- "Learn More" (informational)
- "Reply to this email" (personal connection)

---

## Follow-up Sequence

### Sequence 1: Individual Educators
1. **Day 0:** Initial Outreach Email
2. **Day 7:** Follow-up Email (if no response)
3. **Day 14:** Final follow-up (optional, very light touch)

### Sequence 2: Organizations
1. **Day 0:** Network Partner Email
2. **Day 10:** Personalized follow-up (phone call preferred)
3. **Ongoing:** Relationship building

---

## Success Metrics

### Email Performance
- Open rate target: 25%+
- Click-through rate: 5%+
- Conversion rate (signup): 2%+

### User Acquisition
- Beta signups per week
- Sources of signups (email, social, partnerships)
- Geographic distribution (Louisiana districts)

### Engagement
- Platform activation rate
- Framework usage rate
- Feedback submission rate

---

## Notes

- All email templates use Pelican AI brand colors and fonts
- Louisiana-specific language and context throughout
- Platform-agnostic messaging emphasized
- Ethical AI use highlighted
- Beta program benefits clearly communicated

---

**Email Templates Location:**
- `src/emails/OutreachEmail.tsx`
- `src/emails/FollowupEmail.tsx`
- `src/emails/NetworkPartnerEmail.tsx`

**Last Updated:** November 3, 2025

