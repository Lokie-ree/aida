# IT Whitelisting Guide for Pelican AI

**Last Updated:** December 5, 2025

---

## Overview

Pelican AI (pelicanai.org) is an intelligent coaching assistant designed specifically for Louisiana K-12 educators. The platform helps teachers generate high-quality, Louisiana-aligned prompts for use in any AI tool (ChatGPT, Claude, Gemini, etc.). 

**What Pelican AI Does:**
- Provides conversational coaching to help teachers create better prompts
- Demonstrates knowledge of Louisiana Educator Rubric (LER), Louisiana Student Standards (LSS), and LEADS evaluation framework
- Generates copy-pasteable prompts that work in teachers' preferred AI tools
- Focuses on improving instructional practice, not replacing existing AI tools

**What Pelican AI Does NOT Do:**
- Does NOT replace ChatGPT, Claude, or Gemini
- Does NOT generate lesson content directly
- Does NOT collect student data
- Does NOT require students to access the platform

**Purpose:** This guide helps IT administrators whitelist pelicanai.org in Content Keeper, CK Express, and Mosyle filtering systems.

---

## Why Pelican AI Should Be Whitelisted

- **Educational Purpose:** Designed exclusively for Louisiana K-12 educators
- **CIPA Compliant:** Educational content with appropriate safeguards
- **Louisiana-Specific Intelligence:** Demonstrates knowledge of Louisiana Educator Rubric (LER), Louisiana Student Standards (LSS), and LEADS evaluation framework
- **Teacher Coaching Tool:** Helps teachers use AI tools more effectively within Louisiana education context
- **Platform-Agnostic:** Works with any AI tool teachers already use (ChatGPT, Claude, Gemini, etc.)
- **No Student Data Collection:** Platform is designed for teacher use only - students never access the site
- **Improves Practice:** Focuses on better-aligned, more thoughtful instructional prompts, not just time-saving

### Important Clarification: "AI" in Domain Name

**Why the domain name includes "AI":**
- Pelican AI helps teachers create prompts for use in AI tools (ChatGPT, Claude, Gemini)
- The platform itself uses AI to provide intelligent coaching conversations
- However, Pelican AI is **NOT** a student-facing AI chatbot or content generator
- It's a **coaching assistant** that helps teachers use AI tools more effectively
- Think of it as "AI coaching for teachers" rather than "AI for students"

**If your filter blocks "AI" related sites:** Please consider whitelisting pelicanai.org as an exception, as it serves a legitimate educational coaching purpose for teachers, not students.

---

## Whitelisting Instructions by Platform

### Content Keeper / CK Express

1. **Access Content Keeper Admin Console**
   - Log in to your Content Keeper administration panel
   - Navigate to **Policy Management** or **Web Filtering Rules**

2. **Add to Whitelist**
   - Go to **Allow List** or **Whitelist** section
   - Add the following domains:
     - `pelicanai.org`
     - `*.pelicanai.org` (if using subdomains)
   
3. **Category Override (if needed)**
   - If the site is incorrectly categorized, manually set category to **"Education"**
   - Ensure the category is set to **Allow** for teacher/admin user groups

4. **SSL Inspection (if enabled)**
   - Add `pelicanai.org` to SSL inspection bypass list if SSL inspection is causing issues
   - Or ensure SSL inspection allows the domain

5. **Save and Deploy**
   - Save the policy changes
   - Deploy to affected user groups (teachers, administrators)

**Contact Support:** If you need assistance, Content Keeper support can help with whitelisting: support@contentkeeper.com

---

### Mosyle MDM

1. **Access Mosyle Manager**
   - Log in to your Mosyle Manager console
   - Navigate to **Web Content Filtering** or **Content Filtering**

2. **Add to Allowed Sites**
   - Go to **Allowed Websites** or **Whitelist**
   - Add: `pelicanai.org`
   - Optionally add: `*.pelicanai.org` for subdomain support

3. **Content Category Settings**
   - Ensure **Educational** category is allowed for teacher/admin profiles
   - If pelicanai.org is miscategorized, manually assign to **Education** category

4. **User Group Assignment**
   - Apply whitelist to appropriate user groups:
     - Teachers
     - Administrators
     - IT Staff

5. **Save Configuration**
   - Save changes
   - Sync to devices (if required)

**Contact Support:** Mosyle support: support@mosyle.com

---

## Required Domains and URLs

### Primary Domain
- `pelicanai.org` (main site)

### API/Backend Endpoints (if needed)
- `kindly-setter.convex.cloud` (development backend)
- `outgoing-parttridge.convex.cloud` (production backend)

**Note:** The Convex backend domains may need whitelisting if your filter blocks API calls. However, these are typically categorized as cloud services and may already be allowed.

---

## Testing Access

After whitelisting, verify access:

1. **From District Network:**
   - Navigate to `https://pelicanai.org`
   - Verify the site loads completely
   - Test login functionality
   - Verify conversational coach interface works
   - Test prompt generation and saving functionality

2. **Check for Blocked Resources:**
   - Open browser developer tools (F12)
   - Check Network tab for any blocked requests
   - If resources are blocked, add those domains to whitelist

---

## Troubleshooting

### Site Still Blocked After Whitelisting

1. **Clear Browser Cache:** Users should clear browser cache and cookies
2. **Check User Group Assignment:** Ensure the whitelist applies to the correct user groups
3. **Verify Policy Deployment:** Confirm policy changes have been deployed
4. **Check SSL Inspection:** If SSL inspection is enabled, it may need configuration
5. **Category Override:** Manually set category to "Education" if auto-categorization is incorrect

### Partial Blocking (Some Resources Load, Others Don't)

1. **Check API Endpoints:** Backend API calls may need whitelisting
2. **Check CDN/Static Assets:** Static resources may be on different domains
3. **Review Browser Console:** Check for specific blocked resource errors

### Contact Information

**Pelican AI Support:**
- Email: hello@pelicanai.org
- Website: https://pelicanai.org
- For IT-specific issues, mention "IT Whitelisting Request" in subject line

---

## Additional Information

### Content Classification

Pelican AI should be classified as:
- **Primary Category:** Education
- **Secondary Categories:** Professional Development, Teacher Resources, Educational Technology
- **Content Rating:** General (G) - Educational content for adults (teachers only)
- **Specific Focus:** Louisiana K-12 education, instructional coaching, AI prompt generation

### Compliance

- **CIPA Compliant:** Yes - Educational content only
- **COPPA Compliant:** N/A - Platform designed for educators, not students
- **FERPA Compliant:** Yes - No student data collection

### Security

- **HTTPS:** All traffic encrypted (TLS 1.2+)
- **Authentication:** Secure authentication via Better Auth
- **Data Privacy:** No student PII collected or stored

---

## Quick Reference

**Domain to Whitelist:**
```
pelicanai.org
*.pelicanai.org
```

**Category:** Education

**User Groups:** Teachers, Administrators, IT Staff

**Contact for Issues:** hello@pelicanai.org

---

## Understanding How Filtering Systems Work

### Content Keeper / CK Express

**How They Filter:**
1. **URL/Domain Blocking:** Maintains blacklists and whitelists of specific domains
2. **Content Categorization:** Uses automated categorization services (like BrightCloud, Forcepoint, etc.) to classify websites
3. **Keyword Filtering:** Scans page content for specific keywords that trigger blocks
4. **SSL Inspection:** Can inspect encrypted HTTPS traffic (if enabled) to analyze content
5. **Category-Based Policies:** Applies allow/block rules based on website categories

**Why pelicanai.org Might Be Blocked:**
- The domain may not be in the categorization database yet (new site)
- Automated categorization may have miscategorized it
- The word "AI" in the domain might trigger certain filters that block AI-related sites
- Content analysis might flag it incorrectly as a student-facing AI tool
- May be confused with AI chatbots or content generators (Pelican AI is a coaching assistant, not a content generator)

### Mosyle MDM

**How It Filters:**
1. **Web Content Filtering:** Uses category-based filtering similar to Content Keeper
2. **Managed Device Policies:** Applies filtering rules to managed devices
3. **User Group Policies:** Different rules for different user groups (students vs. teachers)
4. **Safelist/Blocklist:** Manual lists of allowed/blocked sites

**Why pelicanai.org Might Be Blocked:**
- Not in the safelist
- Miscategorized by automated systems
- Policy may block "AI" related sites by default (even though Pelican AI is a coaching tool, not a student-facing AI)
- May be incorrectly flagged as a content generator or chatbot platform

---

## Our Technical Approach (Legitimate Solutions)

### ✅ What We've Implemented

1. **Educational Meta Tags**
   - Added explicit classification meta tags (`classification`, `category`, `audience`)
   - Added Dublin Core metadata (DC.title, DC.subject, DC.type) for library/educational classification systems
   - Enhanced keywords to include "K-12 education", "teacher resources", "educational tools"

2. **robots.txt**
   - Created robots.txt with educational content signals
   - Helps categorization bots understand the site's purpose

3. **Enhanced Open Graph Tags**
   - Added educational tags to Open Graph metadata
   - Helps when the site is shared or indexed

### ❌ What We Cannot Do (And Why)

**We cannot bypass filters through code because:**
1. **Ethical Concerns:** Bypassing security filters violates network policies
2. **Technical Limitations:** Filters operate at the network level, before content reaches the browser
3. **Legal Issues:** Attempting to bypass filters may violate terms of service
4. **Security Risk:** If we could bypass filters, so could malicious sites

**What doesn't work:**
- ❌ Changing domain names or using redirects to bypass
- ❌ Hiding content or using obfuscation techniques
- ❌ Using proxy services or VPNs (violates policy)
- ❌ Modifying code to "trick" filters

---

## Recommended Solution: Whitelisting

### The Proper Approach

**Whitelisting is the correct and only reliable solution** because:

1. **Compliance:** Works within the filtering system's intended design
2. **Reliability:** Once whitelisted, access is guaranteed
3. **Policy Alignment:** Respects network security policies
4. **Scalability:** Works for all users in the district

### Steps to Get Whitelisted

1. **Contact IT Department**
   - Provide this IT Whitelisting Guide
   - Explain that Pelican AI is a coaching assistant that helps teachers create better prompts for use in ChatGPT, Claude, Gemini, etc.
   - Clarify that it's NOT a replacement for those tools, but a coaching layer
   - Emphasize Louisiana-specific educational purpose (LER, LSS, LEADS alignment)
   - Request whitelisting for teacher/admin user groups

2. **Provide Documentation**
   - Share this IT Whitelisting Guide
   - Explain the conversational coaching experience
   - Clarify platform-agnostic approach (works with any AI tool)
   - Explain CIPA/COPPA compliance and teacher-only access

3. **Follow Up**
   - Test access after whitelisting
   - Report any issues immediately
   - Maintain communication with IT department

---

## How Our Code Changes Help

### Meta Tags for Categorization

The educational meta tags we've added help filtering systems' automated categorization engines understand that pelicanai.org is:
- An intelligent coaching assistant for Louisiana K-12 educators
- Designed to help teachers use AI tools more effectively (not replace them)
- Focused on Louisiana-specific education context (LER, LSS, LEADS)
- Compliant with educational content standards
- Teacher-only platform (no student access)

**However:** These tags only help with **automated categorization**. If a site is manually blacklisted or the filter uses URL-based blocking, meta tags won't help.

### robots.txt

The robots.txt file signals to web crawlers and categorization bots that this is educational content. This helps when:
- Filtering systems use web crawlers to categorize sites
- Search engines index the site (which filtering systems may reference)
- Automated categorization services analyze the site

---

## Alternative Approaches (If Whitelisting Delays)

### 1. Request Category Reclassification

If the site is miscategorized, IT can:
- Manually set category to "Education"
- Override automated categorization
- Allow the "Education" category for teacher user groups

### 2. Temporary Workarounds (Not Recommended)

**Note:** These are temporary solutions while waiting for whitelisting:

- **Mobile Hotspot:** Teachers could use personal mobile hotspots (not ideal)
- **Off-Network Access:** Access from home or non-district networks
- **VPN:** Not recommended as it may violate district policy

**We strongly recommend pursuing proper whitelisting instead.**

---

## Long-Term Strategy

### 1. Get Listed in Educational Directories

- Submit to educational website directories
- Get listed in state education department resources
- Register with educational content categorization services

### 2. Build Relationships with IT Departments

- Create a streamlined whitelisting process
- Provide clear documentation
- Offer support for IT administrators

### 3. Monitor and Maintain

- Regularly test access from district networks
- Keep documentation updated
- Maintain communication with districts using the platform

---

## Summary

**The Reality:**
- Code modifications can help with automated categorization
- But they cannot bypass network-level filtering
- Whitelisting is the only reliable, compliant solution

**Our Approach:**
1. ✅ Added educational meta tags (helps categorization)
2. ✅ Created robots.txt (signals educational content)
3. ✅ Created IT Whitelisting Guide (facilitates proper whitelisting)
4. ✅ Enhanced keywords and descriptions (improves categorization)

**Next Steps:**
1. Share IT Whitelisting Guide with affected districts
2. Contact IT departments to request whitelisting
3. Monitor categorization and adjust meta tags if needed

---

*Last Updated: December 5, 2025*

