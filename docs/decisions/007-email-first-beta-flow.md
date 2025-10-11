# ADR 007: Email-First Beta Signup Flow

**Date:** October 11, 2025  
**Status:** ✅ Completed  
**Deciders:** Development Team, Product Manager  
**Technical Story:** Refactor beta signup to follow email-first approach with manual approval

---

## Context

During Phase 5 implementation, the beta signup flow was initially configured to:
1. Automatically approve beta signups
2. Generate temporary passwords immediately
3. Create user accounts instantly
4. Grant immediate platform access

This approach had several issues:
- **Contradicted Phase 1 MVP vision**: Email-first approach with manual approval control
- **Security concerns**: Automatic password generation and account creation
- **Quality control**: No ability to vet signups before granting access
- **Email integration issues**: Beta Welcome email code directly in `email.ts` instead of separate React components

**Impact:** Beta program launch at risk due to lack of quality control and inconsistent email branding.

---

## Decision

Implement an **email-first beta signup flow** with the following changes:

### 1. Beta Signup Flow
- Create beta signups with `"pending"` status (not `"approved"`)
- Send only a simple beta welcome email upon signup
- No temporary credentials or immediate platform access
- Display simple confirmation message on landing page
- Keep "Sign In" button available for admin access

### 2. Manual Approval Process
- Admin reviews beta signups in admin dashboard
- Admin generates temporary password and approves signup
- System sends separate "Platform Access" email with credentials
- User can then log in with provided credentials

### 3. Email System Improvements
- Create dedicated React Email components for all emails
- Implement webhook handling for delivery status tracking
- Separate concerns: actions in Node.js files, mutations elsewhere
- Follow Convex best practices for email integration

---

## Rationale

### User Experience
- ✅ **Clear Expectations**: Users know they're joining a waitlist, not getting instant access
- ✅ **Better Communication**: Separate emails for welcome vs. platform access
- ✅ **Brand Consistency**: Professional email templates using React Email
- ✅ **Trust Building**: Manual approval shows curation and quality control

### Product Management
- ✅ **Quality Control**: Review each signup before granting access
- ✅ **Capacity Management**: Control beta user onboarding pace
- ✅ **Beta Program Integrity**: Ensure only intended users get access
- ✅ **Flexibility**: Can add interview or screening steps before approval

### Technical Excellence
- ✅ **Convex Best Practices**: Proper separation of actions and mutations
- ✅ **Email Deliverability**: Webhook tracking for monitoring delivery status
- ✅ **Code Organization**: Modular React Email components
- ✅ **Maintainability**: Clean separation of concerns

---

## Implementation Details

### Files Created

**Email Components:**
- `src/emails/BetaWelcomeEmail.tsx` - Welcome email for new signups
- `src/emails/PlatformAccessEmail.tsx` - Credentials email for approved users

**Backend Functions:**
- `convex/emailEvents.ts` - Webhook handler for email delivery status (internal mutation)

### Files Modified

**Backend:**
- `convex/email.ts`
  - Added `"use node";` directive
  - Moved `sendBetaWelcomeEmail` action here
  - Moved `sendPlatformAccessEmail` action here
  - Configured Resend with webhook handler
  - Removed `handleEmailEvent` (moved to `emailEvents.ts`)

- `convex/betaSignup.ts`
  - Removed `"use node";` directive
  - Changed status from `"approved"` to `"pending"`
  - Removed immediate account creation
  - Removed temporary password generation
  - Updated to call `api.email.sendBetaWelcomeEmail`
  - Added `temporaryPassword` parameter to `approveBetaSignup`

- `convex/http.ts`
  - Verified webhook endpoint at `/resend-webhook`

**Frontend:**
- `src/components/shared/LandingPage.tsx`
  - Removed credential display logic
  - Simplified success message to confirmation
  - Updated user feedback for email-first approach

**Documentation:**
- `docs/RESEND_TESTING.md` - Added webhook configuration instructions

---

## Technical Architecture

### File Organization

```
convex/
├── email.ts ("use node" - actions only)
│   ├── sendWelcomeEmail
│   ├── sendBetaWelcomeEmail ← Moved here
│   ├── sendPlatformAccessEmail ← Moved here
│   ├── sendVoiceInteractionSummary
│   ├── sendWeeklyPromptEmail
│   ├── sendBetaInviteEmail
│   └── sendWeeklyEmailsToAllUsers
├── emailEvents.ts (no "use node" - mutations only)
│   └── handleEmailEvent ← Moved here (internal mutation)
└── betaSignup.ts (no "use node" - mutations/queries/action)
    ├── signupForBeta (mutation)
    ├── createUserAccountFromBetaSignup (action)
    ├── approveBetaSignup (mutation) ← Updated
    └── [other queries/mutations]
```

### Flow Diagram

**Before (Auto-Approval):**
```
User Submits → Create Signup (approved) → Generate Password → Create Account → Send Welcome Email → Display Credentials
```

**After (Email-First):**
```
User Submits → Create Signup (pending) → Send Welcome Email → Display Confirmation
                                                                       ↓
Admin Reviews → Approve Signup → Generate Password → Create Account → Send Access Email
```

---

## Node.js Runtime Constraints

### Problem
Convex has strict separation between Node.js actions and non-Node.js functions:
- Only **actions** can use `"use node";` directive
- **Mutations and queries** cannot be in files with `"use node";`
- Components like `@react-email/render` require Node.js runtime

### Solution
1. **Email-sending actions** → `convex/email.ts` (with `"use node";`)
2. **Email event handler** → `convex/emailEvents.ts` (no `"use node";`)
3. **Beta signup logic** → `convex/betaSignup.ts` (no `"use node";`)

This ensures proper separation while maintaining functionality.

---

## Consequences

### Positive
- ✅ **Better Control**: Manual approval gives product team control over beta program
- ✅ **Professional Communication**: React Email components ensure brand consistency
- ✅ **Email Monitoring**: Webhook handling enables delivery tracking
- ✅ **Code Quality**: Proper separation of concerns following Convex best practices
- ✅ **Security**: No automatic password generation or account creation
- ✅ **Scalability**: Modular email system easy to extend

### Negative
- ⚠️ **Manual Process**: Requires admin action to approve each signup
- ⚠️ **Delayed Access**: Users must wait for approval (intentional for beta)
- ⚠️ **More Steps**: Two-email flow vs. single email

### Neutral
- **Admin Overhead**: Requires regular monitoring of pending signups
- **User Expectations**: Must clearly communicate waitlist nature
- **Process Documentation**: Need clear admin workflow documentation

---

## Success Criteria

### ✅ Achieved
- [x] Beta signups create `"pending"` status records
- [x] Simple welcome email sent immediately
- [x] No temporary credentials displayed on landing page
- [x] Admin can manually approve signups
- [x] Platform access email sent only after approval
- [x] React Email components for all beta emails
- [x] Webhook handling for email delivery status
- [x] Proper Node.js runtime constraint handling
- [x] All linter errors resolved
- [x] Convex deployment successful

### Future Enhancements
- [ ] Admin dashboard notification for pending signups
- [ ] Bulk approval functionality
- [ ] Email delivery status dashboard
- [ ] Automated reminder emails for pending approvals

---

## Testing Completed

### Backend Testing
- ✅ Beta signup creates pending record
- ✅ Welcome email scheduled correctly
- ✅ Approval flow updates status and sends access email
- ✅ Webhook endpoint receives Resend events
- ✅ All Convex functions deploy without errors

### Frontend Testing
- ✅ Landing page displays confirmation message
- ✅ No credential display after signup
- ✅ Sign In button remains available
- ✅ Error handling for failed signups

### Email Testing
- ✅ Beta Welcome email renders correctly
- ✅ Platform Access email renders with credentials
- ✅ Email delivery events logged via webhook

---

## Review Date

**Status:** ✅ **COMPLETED** - October 11, 2025  
**Next Review:** After first 10 beta signups (monitor manual approval process)

**Criteria for Review:**
- Admin approval workflow efficiency
- Email delivery success rates
- User feedback on waitlist communication
- Time from signup to approval

---

## References

- [Convex Resend Component](https://www.convex.dev/components/resend)
- [React Email Documentation](https://react.email/)
- [Convex Actions Documentation](https://docs.convex.dev/functions/actions)
- [ADR 005: Phase 5 P0 Implementation](005-phase5-p0-implementation.md)
- [ADR 006: Beta Authentication Flow](006-beta-auth-investigation.md)
- [Resend Testing Documentation](../RESEND_TESTING.md)

---

## Notes

- Email components follow Pelican AI brand guidelines
- Webhook handling provides foundation for future email analytics
- Manual approval process aligns with Phase 1 MVP "email-first" vision
- Node.js runtime constraint resolution demonstrates proper Convex architecture
- System ready for beta program launch with quality control in place

