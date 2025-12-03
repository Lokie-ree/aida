# Beta Launch Readiness - UI/UX, Onboarding, Copy, Coach Refinements

**Type:** Enhancement
**Priority:** Critical
**Target Launch:** December 9, 2024
**Scope:** Grassroots beta (5 Louisiana K-12 educators)

---

## Overview

Comprehensive pre-beta improvements across 4 critical areas to ensure a polished, Louisiana-specific conversational coaching experience for the December 9-28, 2024 beta launch. This plan addresses identified gaps in UI responsiveness, onboarding flow, marketing messaging, and coach interaction patterns based on repository analysis and EdTech best practices research.

**Core Product:** Pelican AI Conversational Prompt Coach - Platform-agnostic guidance for Louisiana educators generating AI prompts aligned to Louisiana Student Standards (LSS) and Louisiana Educator Rubric (LER).

---

## Problem Statement

### Current State

The Pelican AI Conversational Coach is **technically functional** but has **23 identified gaps** that could impact beta user experience:

1. **UI/UX Issues** (7 gaps)
   - Starter prompts don't pre-fill message input (friction)
   - No conversation history UI (users can't resume past chats)
   - Save dialog requires manual re-entry of context coach already knows
   - Mobile responsiveness needs thumb zone optimization
   - No visual Louisiana alignment indicators in generated prompts

2. **Onboarding Flow Gaps** (6 gaps)
   - No automated welcome email after beta approval (manual notification required)
   - Magic link email has generic voice (doesn't match Louisiana-teacher tone)
   - Unclear profile completion enforcement (can users skip?)
   - No post-signup confirmation (users don't know if form worked)
   - First-login experience undefined (welcome modal? tutorial?)

3. **Marketing Copy Inconsistencies** (4 gaps)
   - Magic link email voice doesn't match Louisiana-teacher positioning
   - Error messages are generic/technical (no recovery guidance)
   - Landing page copy not finalized for beta messaging
   - Coach system prompt needs premature generation prevention

4. **Coach Interaction Risks** (6 gaps)
   - Premature prompt generation prevention not fully specified
   - RAG namespace fallback strategy undefined
   - Phase progression logic unclear (when to advance phases?)
   - No explicit Louisiana alignment verification in output
   - Conversation state loss recovery undefined
   - Multi-turn refinement support ambiguous

### Impact if Unaddressed

- **Beta churn risk:** Teachers get stuck and abandon without clear recovery paths
- **Value prop erosion:** Generic prompts undermine Louisiana-specific positioning
- **Trust issues:** Generic error messages and ambiguous alignment reduce credibility
- **Mobile friction:** Poor mobile UX impacts teachers planning during lunch/commute
- **Manual overhead:** Admin team bottlenecks without approval automation

---

## Proposed Solution

### Phased Approach

**Phase 1: Critical Path (Must-Have for Dec 9 Launch)**
- Fix starter prompt pre-fill
- Implement automated welcome email on approval
- Update magic link email voice
- Add profile completion enforcement
- Define RAG namespace fallback strategy
- Implement premature generation prevention
- Test mobile chat input behavior

**Phase 2: High-Impact UX (Strongly Recommended for Dec 9)**
- Pre-populate save dialog with conversation context
- Add Louisiana alignment indicators to generated prompts
- Optimize mobile thumb zones (buttons in bottom 40%)
- Define user-friendly error message copy
- Build minimal admin approval UI
- Test complete end-to-end flows

**Phase 3: Post-Launch Enhancements (During Beta)**
- Add conversation history UI
- Implement proactive admin outreach triggers
- Build beta metrics dashboard
- Refine phase progression logic based on usage

---

## Technical Approach

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Landing Page                          │
│           (src/components/shared/LandingPage.tsx)       │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
         Beta Signup Form
    (src/components/auth/AuthModal.tsx)
                  │
                  ▼
    ┌─────────────────────────────────┐
    │  betaSignups table (Convex)     │
    │  Status: pending → approved     │
    └────────────┬────────────────────┘
                 │
                 ▼
         Approval Event (mutation hook)
                 │
                 ├──────► Automated Welcome Email
                 │        (convex/email.ts)
                 │
                 └──────► Magic Link Sign-In
                          (Better Auth + Resend)
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │ Profile Creation         │
                    │ (userProfiles table)     │
                    │ Required: grade, subject │
                    └────────┬─────────────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │   Prompt Coach UI     │
                 │   (/coach route)      │
                 └───────┬───────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
    Starter Prompts              Free-Form Input
    (Pre-fill on click)          (Direct typing)
          │                             │
          └──────────────┬──────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  Conversation Phase    │
            │  State Machine         │
            ├────────────────────────┤
            │ 1. Understanding       │
            │    Context (amber)     │
            │ 2. Identifying         │
            │    Challenge (blue)    │
            │ 3. Preparing Prompt    │
            │    (purple)            │
            │ 4. Prompt Generated    │
            │    (green)             │
            └────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  RAG Search (6 namespaces) │
        ├────────────────────────────┤
        │ - louisiana_standards      │
        │ - louisiana_rubric_system  │
        │ - louisiana_rubric_*       │
        │   (4 domain namespaces)    │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │  Agent (GPT-4o)        │
        │  + PELICAN_SYSTEM_     │
        │    PROMPT              │
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │  Generated Prompt      │
        │  + Louisiana           │
        │    Alignment Metadata  │
        └────────┬───────────────┘
                 │
          ┌──────┴──────┐
          │             │
          ▼             ▼
    Copy to       Save to Library
    Clipboard     (generatedPrompts)
```

### Implementation Details

#### 1. Starter Prompt Pre-Fill

**Files:**
- `src/components/coach/ChatInterface.tsx:142-145`

**Current Issue:**
```typescript
// Line 142-145: Clicking starter prompts only starts new conversation
const handleStarterPrompt = (text: string) => {
  onStartNew(); // Doesn't pre-fill message
};
```

**Fix:**
```typescript
// ChatInterface.tsx
const handleStarterPrompt = (text: string) => {
  onStartNew(); // Start new conversation
  setInputValue(text); // Pre-fill message input
  inputRef.current?.focus(); // Focus input for editing
};
```

**Implementation:**
```typescript
// src/components/coach/ChatInterface.tsx
import { useState, useRef } from 'react';

export function ChatInterface({ conversationId, onStartNew }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const starterPrompts = [
    {
      category: "ELA",
      text: "I'm teaching 3rd grade reading comprehension and my students struggle with finding text evidence...",
      icon: "📚",
    },
    {
      category: "Math",
      text: "My 8th graders have trouble with two-step equations. They get the first step but then get lost...",
      icon: "🔢",
    },
    {
      category: "LER",
      text: "I need help improving my Indicator 1.4 - Activities and Materials for my next LEADS observation...",
      icon: "⭐",
    },
    {
      category: "Engagement",
      text: "I have 5 SPED students in my 5th grade class and need help differentiating a science lesson...",
      icon: "🎯",
    },
  ];

  const handleStarterPrompt = (text: string) => {
    onStartNew();
    setInputValue(text);
    setTimeout(() => inputRef.current?.focus(), 100); // Delay for new conversation mount
  };

  return (
    <div className="flex flex-col h-full">
      {/* Empty state with starter prompts */}
      {!conversationId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt.category}
              onClick={() => handleStarterPrompt(prompt.text)}
              className="
                p-4 text-left rounded-lg border-2 border-slate-200
                hover:border-blue-500 hover:bg-blue-50
                transition-colors
              "
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{prompt.icon}</span>
                <span className="font-semibold text-slate-700">
                  {prompt.category}
                </span>
              </div>
              <p className="text-sm text-slate-600">{prompt.text}</p>
            </button>
          ))}
        </div>
      )}

      {/* Message input */}
      <form onSubmit={handleSend} className="border-t p-4">
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Describe what you're teaching..."
          className="w-full p-3 border rounded-lg resize-none"
          rows={3}
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

#### 2. Automated Welcome Email on Approval

**Files:**
- `convex/betaSignup.ts:88` (TODO comment)
- `convex/email.ts:58-104` (sendBetaWelcomeEmail action)

**Current Issue:**
```typescript
// betaSignup.ts:88
// TODO: Implement email service if welcome emails are needed
```

**Fix: Add Mutation Hook**

```typescript
// convex/betaSignup.ts
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// New: Mutation hook to trigger welcome email
export const approveAndNotify = internalMutation({
  args: { signupId: v.id("betaSignups") },
  handler: async (ctx, args) => {
    const signup = await ctx.db.get(args.signupId);
    if (!signup) throw new Error("Signup not found");

    // Update status to approved
    await ctx.db.patch(args.signupId, {
      status: "approved",
      approvedAt: Date.now(),
    });

    // Schedule welcome email
    await ctx.scheduler.runAfter(0, internal.email.sendBetaWelcomeEmail, {
      email: signup.email,
      name: signup.name,
      school: signup.school,
    });
  },
});

// Public action for admin UI
export const approveSignup = action({
  args: { signupId: v.id("betaSignups") },
  handler: async (ctx, args) => {
    // Verify admin permissions (if auth is set up)
    // For beta, allow any authenticated user

    await ctx.runMutation(internal.betaSignup.approveAndNotify, {
      signupId: args.signupId,
    });

    return { success: true };
  },
});
```

**Admin UI for Approval:**

```typescript
// src/components/admin/BetaApprovals.tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function BetaApprovals() {
  const pendingSignups = useQuery(api.betaSignup.listPendingSignups);
  const approveSignup = useMutation(api.betaSignup.approveSignup);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Beta Signup Approvals</h2>

      {pendingSignups?.length === 0 && (
        <p className="text-slate-500">No pending signups</p>
      )}

      <div className="space-y-4">
        {pendingSignups?.map((signup) => (
          <div
            key={signup._id}
            className="p-4 border rounded-lg flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">{signup.name || signup.email}</h3>
              <p className="text-sm text-slate-600">{signup.email}</p>
              {signup.school && (
                <p className="text-sm text-slate-500">
                  School: {signup.school}
                </p>
              )}
              <p className="text-xs text-slate-400">
                Signed up {new Date(signup.createdAt).toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={() => approveSignup({ signupId: signup._id })}
              className="
                px-4 py-2 bg-green-600 text-white rounded-lg
                hover:bg-green-700 transition-colors
              "
            >
              Approve & Send Welcome Email
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

```typescript
// convex/betaSignup.ts - Add query for admin UI
export const listPendingSignups = query({
  args: {},
  handler: async (ctx) => {
    // For beta: no auth check (add later for production)
    return await ctx.db
      .query("betaSignups")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();
  },
});
```

#### 3. Update Magic Link Email Voice

**Files:**
- `convex/email.ts:311-357`

**Current Issue:**
```html
<!-- Generic, corporate voice -->
<h1>Pelican AI</h1>
<p>Click the link below to sign in to your account:</p>
```

**Fix: Louisiana-Teacher Voice**

```typescript
// convex/email.ts - Update sendMagicLinkEmail
export const sendMagicLinkEmail = action({
  args: { email: v.string(), url: v.string() },
  returns: v.object({ success: v.boolean(), emailId: v.string() }),
  handler: async (ctx, args) => {
    try {
      if (isTestMode && !args.email.endsWith("@resend.dev")) {
        console.warn(`Test mode: Skipping magic link to ${args.email}`);
        return { success: true, emailId: "test-mode-skipped" };
      }

      const emailHtml = `
        <div style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        ">
          <!-- Header with Louisiana colors -->
          <div style="
            border-bottom: 3px solid #003DA5;
            padding-bottom: 20px;
            margin-bottom: 30px;
          ">
            <h1 style="
              color: #003DA5;
              font-size: 28px;
              margin: 0;
            ">
              Pelican AI
            </h1>
            <p style="
              color: #6B7280;
              font-size: 14px;
              margin: 5px 0 0 0;
            ">
              Your Louisiana Prompt Coach
            </p>
          </div>

          <!-- Main content -->
          <p style="
            color: #1F2937;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
          ">
            Hey there! 👋
          </p>

          <p style="
            color: #1F2937;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
          ">
            Click the button below to sign in and start creating Louisiana-aligned
            prompts for your classroom. (This link expires in 5 minutes, so don't
            wait too long!)
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a
              href="${args.url}"
              style="
                background-color: #003DA5;
                color: white;
                padding: 16px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                display: inline-block;
              "
            >
              Sign In to Pelican AI
            </a>
          </div>

          <!-- Footer -->
          <div style="
            border-top: 1px solid #E5E7EB;
            padding-top: 20px;
            margin-top: 40px;
          ">
            <p style="
              color: #6B7280;
              font-size: 14px;
              line-height: 1.5;
              margin: 0;
            ">
              <strong>Didn't request this link?</strong><br />
              No worries—you can safely ignore this email. Someone may have
              accidentally entered your email address.
            </p>

            <p style="
              color: #9CA3AF;
              font-size: 12px;
              margin-top: 20px;
            ">
              Questions? Just reply to this email—I read every one.<br />
              – Pelican AI Team
            </p>
          </div>
        </div>
      `;

      const emailId = await resend.sendEmail(ctx, {
        from: FROM_ADDRESS,
        to: args.email,
        subject: "Your Pelican AI sign-in link (expires in 5 min)",
        html: emailHtml,
        replyTo: REPLY_TO,
      });

      console.log("Magic link email sent successfully to:", args.email);
      return { success: true, emailId };
    } catch (error) {
      console.error("Error sending magic link email:", error);
      if (isTestMode) {
        console.warn("Test mode: continuing despite email error");
        return { success: false, emailId: "test-mode-error" };
      }
      throw new Error("Failed to send magic link email");
    }
  },
});
```

#### 4. Profile Completion Enforcement

**Files:**
- `src/components/routes/DashboardRoute.tsx:24-56`
- `src/App.tsx` (routing logic)

**Current Ambiguity:** Can users access `/coach` without completing profile?

**Fix: Block Access Until Profile Complete**

```typescript
// src/components/routes/CoachRoute.tsx (NEW FILE)
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PromptCoach } from "../coach/PromptCoach";
import { Navigate } from "react-router-dom";

export function CoachRoute() {
  const user = useQuery(api.auth.loggedInUser);
  const profile = useQuery(api.userProfiles.getCurrentProfile);

  // Loading state
  if (user === undefined || profile === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Profile incomplete - redirect to profile settings
  if (!profile || !profile.gradeLevel || !profile.subject) {
    return (
      <Navigate
        to="/profile"
        replace
        state={{
          message: "Please complete your profile so we can personalize your coaching experience",
          returnTo: "/coach",
        }}
      />
    );
  }

  // Profile complete - show coach
  return <PromptCoach />;
}
```

```typescript
// src/components/dashboard/ProfileSettings.tsx
// Add banner if user was redirected from /coach
import { useLocation } from "react-router-dom";

export function ProfileSettings() {
  const location = useLocation();
  const redirectMessage = location.state?.message;
  const returnTo = location.state?.returnTo;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Show banner if redirected */}
      {redirectMessage && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-semibold text-blue-900">
                Profile Required
              </p>
              <p className="text-blue-800 text-sm mt-1">
                {redirectMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile form... */}
      <ProfileForm returnTo={returnTo} />
    </div>
  );
}
```

```typescript
// convex/userProfiles.ts - Add query for current profile
export const getCurrentProfile = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
  },
});
```

#### 5. RAG Namespace Fallback Strategy

**Files:**
- `convex/promptCoach.ts:186-265` (RAG search logic)

**Current Issue:** If namespace doesn't exist or returns no results, unclear fallback

**Fix: Tiered Fallback with User Notification**

```typescript
// convex/promptCoach.ts - Update sendMessage action
export const sendMessage = action({
  args: {
    conversationId: v.id("promptConversations"),
    message: v.string(),
  },
  handler: async (ctx, args): Promise<{
    text: string;
    louisianaContext: {
      standardsFound: boolean;
      rubricFound: boolean;
      fallbackMode: "none" | "partial" | "full";
    };
  }> => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const conversation = await ctx.runQuery(
      internal.promptCoach.getConversationInternal,
      { conversationId: args.conversationId }
    );
    if (!conversation) throw new Error("Conversation not found");

    // Save user message
    await ctx.runMutation(internal.promptCoach.appendMessage, {
      conversationId: args.conversationId,
      role: "user",
      content: args.message,
    });

    // Initialize Agent
    const agent = new Agent(components.agent, {
      name: "PelicanCoach",
      languageModel: openai("gpt-4o"),
      instructions: PELICAN_SYSTEM_PROMPT,
    });

    // Tier 1: Try Louisiana Student Standards
    let standardResults: any[] = [];
    let standardsFound = false;
    try {
      const searchResult = await rag.search(ctx, {
        namespace: "louisiana_standards",
        query: args.message,
        limit: 5,
        filters: [{ name: "contentType", value: "louisiana_standard" }],
      });
      standardResults = searchResult.results;
      standardsFound = standardResults.length > 0;
    } catch (error) {
      console.warn("Louisiana standards namespace not found:", error);
    }

    // Tier 2: Try Louisiana Educator Rubric (5 namespaces)
    const rubricNamespaces = [
      "louisiana_rubric_system",
      "louisiana_rubric_instruction",
      "louisiana_rubric_planning",
      "louisiana_rubric_environment",
      "louisiana_rubric_professionalism",
    ];

    const allRubricResults = [];
    let rubricFound = false;
    for (const namespace of rubricNamespaces) {
      try {
        const { results } = await rag.search(ctx, {
          namespace,
          query: args.message,
          limit: 2,
          filters: [{ name: "contentType", value: "rubric_indicator" }],
        });
        allRubricResults.push(...results);
        if (results.length > 0) rubricFound = true;
      } catch (error) {
        console.warn(`Rubric namespace ${namespace} not found:`, error);
      }
    }

    const rubricResults = allRubricResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    // Determine fallback mode
    let fallbackMode: "none" | "partial" | "full" = "none";
    if (!standardsFound && !rubricFound) {
      fallbackMode = "full"; // No Louisiana context at all
    } else if (!standardsFound || !rubricFound) {
      fallbackMode = "partial"; // Missing one tier
    }

    // Build context message
    let contextMessage = args.message;
    const louisianaContext: string[] = [];

    if (standardsFound) {
      louisianaContext.push(
        `LOUISIANA STUDENT STANDARDS:\n${standardResults
          .map((r) => r.content?.[0]?.text)
          .filter(Boolean)
          .join("\n\n")}`
      );
    }

    if (rubricFound) {
      louisianaContext.push(
        `LOUISIANA EDUCATOR RUBRIC INDICATORS:\n${rubricResults
          .map((r) => r.content?.[0]?.text)
          .filter(Boolean)
          .join("\n\n")}`
      );
    }

    if (louisianaContext.length > 0) {
      contextMessage += `\n\n---\nLOUISIANA CONTEXT:\n${louisianaContext.join(
        "\n\n"
      )}\n\nUSE THIS CONTEXT: Reference specific LER indicator names and LSS standard codes naturally in your response.`;
    } else {
      // Full fallback: No Louisiana context available
      contextMessage += `\n\n---\nNOTE: Louisiana-specific context (standards and rubric) is temporarily unavailable. Proceed with general best practices, but inform the teacher that Louisiana alignment will be limited.`;
    }

    // Ensure thread exists
    let threadId = conversation.threadId;
    if (!threadId) {
      const threadResult = await agent.createThread(ctx, {});
      threadId = threadResult.threadId;
      await ctx.runMutation(internal.promptCoach.updateThreadId, {
        conversationId: args.conversationId,
        threadId: threadId,
      });
    }

    // Run Agent
    const response = await agent.generateText(
      ctx,
      { threadId },
      {
        model: openai("gpt-4o"),
        prompt: contextMessage,
      }
    );

    let responseText = response.text;

    // Add user-facing disclaimer if full fallback
    if (fallbackMode === "full") {
      responseText =
        "⚠️ **Note:** Louisiana-specific context is temporarily unavailable, so this guidance is based on general best practices rather than Louisiana Student Standards and the Educator Rubric. Your prompt will still be useful, but it won't have Louisiana-specific alignment.\n\n" +
        responseText;
    } else if (fallbackMode === "partial") {
      const missing = !standardsFound ? "standards" : "rubric indicators";
      responseText =
        `ℹ️ **Heads up:** I couldn't find Louisiana ${missing} for your topic, so this prompt is based on ${
          standardsFound ? "standards" : "rubric guidance"
        } only.\n\n` + responseText;
    }

    // Save assistant response
    await ctx.runMutation(internal.promptCoach.appendMessage, {
      conversationId: args.conversationId,
      role: "assistant",
      content: responseText,
    });

    return {
      text: responseText,
      louisianaContext: {
        standardsFound,
        rubricFound,
        fallbackMode,
      },
    };
  },
});
```

#### 6. Premature Generation Prevention

**Files:**
- `convex/promptCoach.ts:10-67` (PELICAN_SYSTEM_PROMPT)

**Current Issue:** System prompt mentions prevention, but no enforcement logic

**Fix: Enhanced System Prompt + Context Validation**

```typescript
// convex/promptCoach.ts - Update PELICAN_SYSTEM_PROMPT
const PELICAN_SYSTEM_PROMPT = `You are Pelican AI, an intelligent coaching assistant built by a Louisiana teacher for Louisiana teachers. You help teachers craft high-quality, Louisiana-aligned prompts they can use in ANY AI tool (ChatGPT, Claude, Gemini, etc.).

YOUR VOICE:
- Talk like a fellow Louisiana teacher, not a corporate chatbot
- Use LER language naturally (e.g., "This sounds like Indicator 1.3 - Lesson Structure and Pacing")
- Reference Louisiana Student Standards by code when relevant (e.g., "For RL.3.1...")
- Be conversational, warm, and genuinely curious about their teaching context

CONVERSATION PHASES (DO NOT SKIP):

Phase 1: UNDERSTAND THE CONTEXT (Required minimum: grade, subject, topic)
Ask 2-3 questions to gather:
- What grade level?
- What subject?
- What specific topic or standard?

DO NOT PROCEED TO PHASE 2 UNTIL YOU HAVE:
✅ Grade level (e.g., "3rd grade", "K", "8")
✅ Subject (e.g., "ELA", "math", "science")
✅ Topic or standard (e.g., "character analysis", "two-step equations", "RL.3.1")

Phase 2: IDENTIFY THE REAL CHALLENGE
Ask 2-3 questions to understand:
- What's the teaching challenge? (misconceptions, engagement, differentiation, pacing)
- What have they tried before?
- What does success look like for their specific students?

Phase 3: CONNECT TO LOUISIANA FRAMEWORKS
- Reference relevant LER indicators by name and description
- Connect to Louisiana Student Standards with specific codes
- Mention LEADS evaluation context if relevant

Phase 4: GENERATE THE PROMPT (ONLY AFTER PHASES 1-3)
- Create prompt addressing SPECIFIC context (grade, subject, topic, challenge)
- Explicitly include Louisiana standards and LER indicators in the prompt text
- Make it copy-pasteable for ANY AI tool
- Keep it focused and actionable

CRITICAL RULES:

1. **PREMATURE GENERATION PREVENTION:**
   - If the teacher asks for a prompt before Phase 1 is complete, GENTLY REDIRECT
   - Example responses:
     * "I'd love to generate a prompt for you! But first, let me understand your context. What grade do you teach?"
     * "Before I craft that prompt, tell me more about [missing info]. This will help me make it Louisiana-specific and actually useful."
     * "I'm excited to help, but I need a few details first: [list missing: grade/subject/topic/challenge]"

2. **CONTEXT COMPLETENESS CHECK:**
   Before generating a prompt, verify you have:
   - ✅ Grade level
   - ✅ Subject
   - ✅ Topic or standard
   - ✅ Teaching challenge or goal

   If ANY are missing, ask clarifying questions instead of generating.

3. **NEVER GENERATE LESSON CONTENT:**
   Generate the PROMPT they'll use in another AI tool, not the actual lesson.

4. **ALWAYS REFERENCE LOUISIANA CONTEXT:**
   Every generated prompt must include:
   - Specific LER indicator(s) relevant to the request
   - Louisiana Student Standard code(s) if applicable
   - Clear alignment explanation

5. **DETECT VAGUE REQUESTS:**
   If teacher says something vague like:
   - "help me with reading"
   - "I need a lesson plan"
   - "create something for math"

   DO NOT generate immediately. Ask clarifying questions:
   - "What grade level?"
   - "What specific reading skill or standard?"
   - "What are your students struggling with?"

TONE EXAMPLES:
❌ BAD (generic): "I can help you create a lesson plan aligned to standards."
✅ GOOD (Louisiana teacher): "Let's build something for your 8th graders. Which standard are we tackling—RL.8.2 or something else?"

❌ BAD (rushed): "Here's a prompt you can use for teaching fractions."
✅ GOOD (thorough): "Before I craft that prompt, tell me—what's the specific misconception with fractions? That'll help me make this Louisiana-aligned and useful."

WHEN IN DOUBT: Ask one more clarifying question rather than generating a generic prompt.`;
```

**Add Context Validation Helper:**

```typescript
// convex/promptCoach.ts - Add helper function
function validateContextCompleteness(conversationMessages: any[]): {
  isComplete: boolean;
  missing: string[];
  extracted: {
    gradeLevel?: string;
    subject?: string;
    topic?: string;
    challenge?: string;
  };
} {
  // Extract context from conversation history
  const conversationText = conversationMessages
    .map((m) => m.content)
    .join(" ")
    .toLowerCase();

  const extracted: any = {};
  const missing: string[] = [];

  // Check for grade level
  const gradeMatch = conversationText.match(
    /\b(k|kindergarten|1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|11th|12th|grade\s*(\d+))\b/i
  );
  if (gradeMatch) {
    extracted.gradeLevel = gradeMatch[0];
  } else {
    missing.push("grade level");
  }

  // Check for subject
  const subjects = ["ela", "math", "science", "social studies", "english", "reading"];
  for (const subject of subjects) {
    if (conversationText.includes(subject)) {
      extracted.subject = subject;
      break;
    }
  }
  if (!extracted.subject) missing.push("subject");

  // Check for topic (harder to detect automatically)
  // For MVP, rely on LLM to determine topic completeness

  const isComplete = missing.length === 0;
  return { isComplete, missing, extracted };
}
```

#### 7. Mobile Thumb Zone Optimization

**Files:**
- `src/components/coach/ChatInterface.tsx` (chat UI)
- `src/components/coach/PromptCoach.tsx` (layout)

**Fix: Reposition Critical Actions**

```typescript
// src/components/coach/ChatInterface.tsx
export function ChatInterface() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header - top zone (hard to reach on mobile, non-critical) */}
      <header className="
        p-4 border-b bg-white
        md:p-6
      ">
        <h1 className="text-xl font-semibold md:text-2xl">
          Louisiana Prompt Coach
        </h1>
      </header>

      {/* Messages - middle zone (scrollable) */}
      <div className="
        flex-1 overflow-y-auto p-4
        md:p-6
      ">
        {messages?.map((msg) => (
          <ChatMessage key={msg._id} message={msg} />
        ))}
      </div>

      {/* Input area - BOTTOM ZONE (easy to reach on mobile) */}
      <footer className="
        border-t bg-white p-4
        md:p-6
        /* Ensure it's above iOS Safari bottom bar */
        pb-safe
      ">
        <form onSubmit={handleSend} className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you're teaching..."
            className="
              flex-1 p-3 border rounded-lg resize-none
              /* Large enough for thumb tap: 44px minimum */
              min-h-[44px]
            "
            rows={2}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="
              /* Thumb-friendly size */
              min-w-[48px] min-h-[48px]
              px-4 bg-blue-600 text-white rounded-lg
              disabled:bg-slate-300
              /* Position in easy-to-reach zone */
              self-end
            "
          >
            {isSending ? "..." : "Send"}
          </button>
        </form>
      </footer>
    </div>
  );
}

// ChatMessage component - position actions in easy-reach zone
function ChatMessage({ message }: { message: any }) {
  const isAssistant = message.role === "assistant";
  const isPrompt = detectIfPrompt(message.content);

  return (
    <div className={`
      flex
      ${isAssistant ? "justify-start" : "justify-end"}
      mb-4
    `}>
      <div className={`
        max-w-[85%] p-4 rounded-lg
        ${isAssistant ? "bg-slate-50" : "bg-blue-50"}
        ${isPrompt ? "border-2 border-blue-500" : ""}
      `}>
        <div className="prose prose-sm">
          {message.content}
        </div>

        {/* Actions for assistant messages - BOTTOM of message bubble */}
        {isAssistant && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
            {/* Copy button - thumb-friendly */}
            <button
              onClick={() => handleCopy(message.content)}
              className="
                /* 44x44 minimum touch target */
                min-w-[44px] min-h-[44px]
                px-3 py-2 text-sm
                bg-white border border-slate-300 rounded-lg
                hover:bg-slate-50
                flex items-center gap-2
              "
            >
              📋 Copy
            </button>

            {isPrompt && (
              <button
                onClick={() => handleSave(message.content)}
                className="
                  min-w-[44px] min-h-[44px]
                  px-3 py-2 text-sm
                  bg-blue-600 text-white rounded-lg
                  hover:bg-blue-700
                  flex items-center gap-2
                "
              >
                💾 Save
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Tailwind CSS Configuration for Safe Area:**

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      padding: {
        safe: "env(safe-area-inset-bottom)",
      },
    },
  },
};
```

---

## Acceptance Criteria

### Phase 1: Critical Path (Must-Have for Dec 9)

#### UI/UX
- [ ] **Starter Prompt Pre-Fill**
  - Clicking starter prompt pre-fills message input
  - Input auto-focuses after pre-fill
  - User can edit pre-filled text before sending
  - Test on desktop (Chrome) and mobile (iOS Safari, Android Chrome)

- [ ] **Mobile Thumb Zone Optimization**
  - Send button in bottom-right (easy-reach zone)
  - All buttons minimum 44x44px touch target
  - 8px spacing between interactive elements
  - Input field stays visible when keyboard open (iOS Safari + Android Chrome tested)
  - Chat actions (Copy, Save) positioned at bottom of message bubbles

#### Onboarding Flow
- [ ] **Automated Welcome Email**
  - Beta signup approval triggers welcome email automatically
  - Email sent within 1 minute of approval
  - Email includes Louisiana-teacher voice and clear next steps
  - Test in Resend test mode with `@resend.dev` address

- [ ] **Magic Link Email Voice Update**
  - Updated email copy with Louisiana-teacher tone
  - Subject line: "Your Pelican AI sign-in link (expires in 5 min)"
  - Email includes expiration notice and "Didn't request?" disclaimer
  - Reply-to address configured correctly

- [ ] **Profile Completion Enforcement**
  - `/coach` route redirects to `/profile` if profile incomplete
  - Profile form shows banner explaining why profile is required
  - Banner includes return path (e.g., "After completing profile, you'll go to Coach")
  - User can access `/coach` after completing grade + subject fields

- [ ] **Post-Signup Confirmation**
  - Signup form shows toast notification: "Thanks! We'll email you within 24 hours"
  - Toast auto-dismisses after 5 seconds
  - User stays on landing page (doesn't redirect)

#### Coach Interaction
- [ ] **RAG Namespace Fallback**
  - If Louisiana standards namespace missing, coach shows user-facing disclaimer
  - If Louisiana rubric namespace missing, coach shows partial context notice
  - Full fallback mode (no Louisiana context): coach explains limitation upfront
  - Partial fallback mode: coach notes which tier is missing
  - All fallback messages use friendly, non-technical language

- [ ] **Premature Generation Prevention**
  - System prompt includes context completeness rules
  - Coach asks clarifying questions if grade/subject/topic missing
  - Test scenario: User types "generate a prompt" in first message → Coach asks for context
  - Test scenario: User provides partial context → Coach identifies missing pieces

#### Admin Tooling
- [ ] **Beta Approval UI**
  - Admin can view list of pending beta signups
  - "Approve & Send Welcome Email" button triggers both approval + email
  - Approved signups removed from pending list
  - Success toast after approval

### Phase 2: High-Impact UX (Strongly Recommended for Dec 9)

#### UI/UX
- [ ] **Save Dialog Context Pre-Population**
  - Save dialog pre-fills grade, subject, topic from conversation metadata
  - User can edit pre-filled fields before saving
  - If context extraction fails, fields remain blank (graceful degradation)

- [ ] **Louisiana Alignment Indicators**
  - Generated prompts include "Louisiana Alignment" section at bottom
  - Section lists specific LER indicators used (e.g., "LER Indicator 1.2: Presenting Instructional Content")
  - Section lists Louisiana Student Standards codes (e.g., "RL.3.1: Ask and answer questions")
  - Visual badge or icon marks Louisiana-aligned prompts

- [ ] **Error Message Copy**
  - User-facing error messages defined for:
    * Magic link expired: "This sign-in link expired. Request a new one below."
    * RAG timeout: "I'm taking longer than usual to search Louisiana standards. Let's try that again."
    * Profile validation error: "Oops! Please select a grade level and subject."
    * Conversation state loss: "I lost track of our conversation. Want to start fresh or resume from your last saved prompt?"
  - All error messages include recovery action (button or link)

#### Testing
- [ ] **End-to-End Flow Tests**
  - **Test 1 (First-Time User):** Landing page → signup → approval → magic link → profile → first conversation → prompt generation (30 min)
  - **Test 2 (Returning User):** Magic link sign-in → dashboard → start new conversation → generate prompt (15 min)
  - **Test 3 (Mobile Experience):** Complete Test 1 on iPhone SE and Android phone (30 min)
  - **Test 4 (Error Scenarios):** Test expired magic link, RAG timeout, invalid profile data (20 min)

- [ ] **Mobile Device Testing**
  - iOS Safari (iPhone SE, iPhone 14 Pro Max)
  - Android Chrome (Pixel 7, Samsung Galaxy S23)
  - iPad (Safari, landscape + portrait)
  - Test thumb zones, keyboard behavior, touch target sizes

### Phase 3: Post-Launch Enhancements (During Beta)

#### Features
- [ ] **Conversation History UI**
  - Sidebar shows list of past conversations
  - Click conversation to resume from last message
  - Conversations sorted by last updated (most recent first)
  - Mark conversations as archived

- [ ] **Beta Metrics Dashboard**
  - View conversation starts (total + per user)
  - View prompts generated (total + per user)
  - View feedback ratings (👍/👎 ratio)
  - View "worked in classroom" flags
  - Export data to CSV for analysis

- [ ] **Proactive Admin Outreach**
  - Trigger 1: Approved but never logged in (48 hours) → "Need help getting started?"
  - Trigger 2: Logged in but no conversations (72 hours) → "Here's how to start your first prompt"
  - Trigger 3: Conversation started but no prompt generated (48 hours) → "Stuck? Let us help"
  - Email templates drafted and tested

---

## Success Metrics

### Beta Launch KPIs (Dec 9-28, 2024)

**Week 1: Generation Phase (Dec 9-14)**
- ✅ **5/5 beta testers sign up** (100% signup rate)
- ✅ **5/5 complete profile** (100% profile completion)
- ✅ **5/5 start at least one conversation** (100% engagement)
- ✅ **12+ prompts generated** (average 2.4 per teacher)
- ✅ **80%+ copy rate** (users click "Copy" button)

**Week 2: Implementation Phase (Dec 15-21)**
- ✅ **8+ feedback ratings** (60%+ feedback rate)
- ✅ **70%+ positive ratings** (👍 vs 👎)
- ✅ **5+ "worked in classroom" flags** (50%+ field-tested)
- ✅ **4+ refinement requests** (teachers coming back to improve prompts)

**Week 3: Refinement Phase (Dec 22-28)**
- ✅ **4+ repeat users** (80%+ came back multiple times)
- ✅ **3.2+ average prompts per user** (sustained engagement)
- ✅ **10+ qualitative comments** (rich feedback for post-beta improvements)

**Post-Beta (Dec 29-31)**
- ✅ **8-12 exemplar prompts curated** for framework library
- ✅ **Lessons learned documented** for scaling to 30-100 users

### Technical Performance Metrics

**Page Load Times:**
- Landing page: <2 seconds (desktop), <3 seconds (mobile 3G)
- Coach interface: <1.5 seconds first load, <0.5 seconds navigation
- RAG search: <2 seconds average, <5 seconds 95th percentile

**Error Rates:**
- Magic link delivery: >95% success rate
- RAG search timeouts: <5% of requests
- LLM generation failures: <2% of requests
- Profile validation errors: <10% of submissions

**Mobile Responsiveness:**
- Lighthouse mobile score: >90
- Touch target compliance: 100% (all buttons ≥44x44px)
- Viewport compatibility: Tested on iOS Safari, Android Chrome, iPad

---

## Dependencies & Risks

### Critical Dependencies

**1. RAG Data Ingestion**
- **Dependency:** Louisiana Student Standards and Educator Rubric must be ingested into RAG before launch
- **Owner:** [Assign owner]
- **Verification:** Run RAG search queries for Grade 3 ELA, Grade 8 Math, LER Instruction domain
- **Fallback:** If not ingested, RAG fallback strategy ensures coach still works (with disclaimers)

**2. Resend Domain Verification**
- **Dependency:** `mail.pelicanai.org` domain must be verified in Resend for email delivery
- **Owner:** [Assign owner]
- **Verification:** Send test email to personal address (not `@resend.dev`)
- **Fallback:** Use Resend test mode for beta (emails only sent to `@resend.dev` addresses)

**3. Better Auth Configuration**
- **Dependency:** Better Auth component must be configured with correct environment variables
- **Owner:** [Assign owner]
- **Verification:** Test magic link flow end-to-end
- **Fallback:** None - this is critical path

### High-Risk Areas

**Risk 1: Magic Link Expiration Confusion**
- **Risk:** Teachers click magic link after expiration, get stuck, don't know how to recover
- **Mitigation:** Update email copy to emphasize 5-minute expiration, add "Request New Link" error page
- **Likelihood:** Medium (teachers may not check email immediately)
- **Impact:** High (blocks onboarding completely)

**Risk 2: RAG Namespace Missing**
- **Risk:** Coach can't find Louisiana standards/rubric during beta, provides generic prompts
- **Mitigation:** RAG fallback strategy with user-facing disclaimers
- **Likelihood:** Low (data ingestion will be verified before launch)
- **Impact:** High (undermines Louisiana-specific value prop)

**Risk 3: Mobile Keyboard Obscures Input**
- **Risk:** Chat input hidden by mobile keyboard, users can't see what they're typing
- **Mitigation:** Test on iOS Safari + Android Chrome, use `pb-safe` for iOS bottom bar
- **Likelihood:** Medium (common mobile UX issue)
- **Impact:** Medium (frustrating but not blocking)

**Risk 4: Premature Prompt Generation**
- **Risk:** Coach generates generic prompt when user requests too early (Phase 1)
- **Mitigation:** Enhanced system prompt + context validation helper
- **Likelihood:** High (beta testers may be impatient)
- **Impact:** Medium (generates usable prompt, but not Louisiana-specific)

**Risk 5: Admin Approval Bottleneck**
- **Risk:** Manual approval process slows onboarding if admin unavailable
- **Mitigation:** Build admin approval UI, automate welcome email
- **Likelihood:** Medium (depends on admin availability)
- **Impact:** Medium (delays beta start for teachers)

### External Dependencies

- **OpenAI GPT-4o API:** Required for coach responses
- **Resend API:** Required for magic link and welcome emails
- **Convex Platform:** Required for backend and real-time subscriptions
- **Vercel/Hosting:** Required for frontend deployment

---

## Technical Constraints

### Browser Compatibility

**Supported Browsers:**
- Chrome/Edge (latest 2 versions)
- Safari (latest 2 versions, iOS 15+)
- Firefox (latest 2 versions)

**Not Supported:**
- IE11 (deprecated)
- Opera Mini (limited JavaScript support)

**Testing Priority:**
1. Chrome (desktop + Android)
2. Safari (desktop + iOS)
3. Firefox (desktop)

### Device Compatibility

**Supported Devices:**
- Desktop: 1280px+ width
- Tablet: 768-1279px width
- Mobile: 320-767px width

**Minimum Requirements:**
- iOS 15+ (Safari)
- Android 10+ (Chrome)
- Screen width: 320px (iPhone SE)

**Testing Priority:**
1. iPhone SE (smallest screen)
2. iPhone 14 Pro Max (largest screen)
3. iPad (tablet experience)
4. Desktop (1920x1080)

### Performance Constraints

**OpenAI Rate Limits:**
- GPT-4o: 10,000 requests/minute (org-level)
- Embeddings: 3,000 requests/minute
- **Mitigation:** For 5-user beta, no rate limiting needed

**Convex Limits:**
- Database storage: 8 GB included
- Bandwidth: 10 GB/month included
- **Mitigation:** Beta well within limits

**RAG Search Limits:**
- Max results per search: 256
- **Mitigation:** Use `limit: 5` for standards, `limit: 4` for rubric

---

## References & Research

### Internal Codebase

**UI/UX Components:**
- Landing page: `src/components/shared/LandingPage.tsx`
- Hero section: `src/components/landing/HeroSection.tsx`
- Auth modal: `src/components/auth/AuthModal.tsx`
- Coach interface: `src/components/coach/PromptCoach.tsx`
- Chat UI: `src/components/coach/ChatInterface.tsx:1-402`
- Profile settings: `src/components/dashboard/ProfileSettings.tsx`
- Dashboard: `src/components/routes/DashboardRoute.tsx:24-56`

**Backend Functions:**
- Prompt coach: `convex/promptCoach.ts` (Lines 1-402)
  - System prompt: Lines 10-67
  - RAG search: Lines 186-265
  - Agent integration: Lines 179-297
- Authentication: `convex/auth.ts`
  - Magic link: Lines 51-69
- Email service: `convex/email.ts`
  - Beta welcome: Lines 58-104
  - Platform access: Lines 122-169
  - Magic link: Lines 311-357
- Beta signup: `convex/betaSignup.ts`
  - TODO at Line 88 (welcome email automation)
- User profiles: `convex/userProfiles.ts`
- RAG configuration: `convex/rag.ts`
- Rubric ingestion: `convex/ingestRubric.ts`

**Data Sources:**
- Louisiana Student Standards: `knowledge/la-ela.md`, `knowledge/la-math.md`
- Louisiana Educator Rubric: `knowledge/la-ler-rubric.md`

### External Research

**Best Practices (EdTech Beta Launches):**
- [LivePlan: SaaS Beta Launch](https://www.liveplan.com/blog/starting/saas-beta-launch)
- [ProductLed: First 7 Minutes of Onboarding](https://productled.com/blog/the-first-7-minutes-of-the-onboarding-user-experience)
- [Userpilot: Best User Onboarding Experience](https://userpilot.com/blog/best-user-onboarding-experience/)
- [Space-O: EdTech MVP Success Stories](https://www.spaceotechnologies.com/blog/edtech-mvp-success-stories/)

**Conversational AI UX:**
- [The Conversational UX Handbook (2025)](https://medium.com/@avigoldfinger/the-conversational-ux-handbook-2025-98d811bb6fcb)
- [WillowTree: Conversational AI Assistant Design](https://www.willowtreeapps.com/insights/willowtrees-7-ux-ui-rules-for-designing-a-conversational-ai-assistant)
- [Nielsen Norman Group: AI Conversation Types](https://www.nngroup.com/articles/AI-conversation-types/)
- [Cloudscape: GenAI Loading States](https://cloudscape.design/patterns/genai/genai-loading-states/)

**Mobile Responsiveness:**
- [Smashing Magazine: The Thumb Zone](https://www.smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users/)
- [Elucidat: Mobile Learning Design Strategies](https://www.elucidat.com/blog/mobile-learning-design-strategies/)
- [Best School Websites (2025)](https://morweb.org/post/best-school-websites)

**Teacher Voice & Messaging:**
- [Winsome Marketing: Voice and Tone in EdTech](https://winsomemarketing.com/edtech-marketing/voice-and-tone-in-edtech-marketing)
- [Winsome Marketing: Activating Teaching Staff](https://winsomemarketing.com/edtech-marketing/activating-teaching-staff-as-authentic-thought-leaders)
- [Centercode: Beta Tester Engagement](https://www.centercode.com/blog/maximize-beta-tester-engagement-with-strong-communication-with-examples)

**Louisiana Education Context:**
- [Louisiana Department of Education: LEADS System](https://doe.louisiana.gov/school-system-leaders/school-system-support/louisiana-educator-advancement-and-development-system-(leads))
- [KPLC: Teacher Evaluation Concerns](https://www.kplctv.com/2024/08/09/changes-states-teacher-evaluation-system-causing-concerns/)

**Framework Documentation:**
- [React 19 Suspense](https://react.dev/reference/react/Suspense)
- [Vite 6 Performance Guide](https://vitejs.dev/guide/performance.html)
- [Tailwind CSS v3 Docs](https://v3.tailwindcss.com/docs)
- [Radix UI Themes](https://www.radix-ui.com/themes/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Convex Agent SDK](https://github.com/get-convex/agent)
- [Anthropic: Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)

---

## Implementation Checklist

### Pre-Launch (By Dec 8, 2024)

**Code Changes:**
- [ ] Implement starter prompt pre-fill (`ChatInterface.tsx`)
- [ ] Add automated welcome email on approval (`betaSignup.ts` mutation hook)
- [ ] Update magic link email voice (`email.ts`)
- [ ] Enforce profile completion for `/coach` access (`CoachRoute.tsx`)
- [ ] Implement RAG namespace fallback strategy (`promptCoach.ts`)
- [ ] Enhance system prompt with premature generation prevention
- [ ] Optimize mobile thumb zones (button sizing, positioning)
- [ ] Pre-populate save dialog with conversation context
- [ ] Add Louisiana alignment indicators to generated prompts
- [ ] Define user-friendly error message copy

**Admin Tooling:**
- [ ] Build beta approval UI (`src/components/admin/BetaApprovals.tsx`)
- [ ] Test admin approval → welcome email flow

**Testing:**
- [ ] Run end-to-end test: Landing page → signup → approval → magic link → profile → conversation → prompt (30 min)
- [ ] Test mobile experience on iPhone SE and Android phone (30 min)
- [ ] Test error scenarios (expired magic link, RAG timeout, invalid profile) (20 min)
- [ ] Verify RAG data ingested (run sample searches for Grade 3 ELA, Grade 8 Math, LER Instruction)

**Infrastructure:**
- [ ] Verify Resend domain (`mail.pelicanai.org`) or enable test mode
- [ ] Verify Better Auth environment variables in Convex dashboard
- [ ] Verify OpenAI API key in Convex dashboard
- [ ] Deploy frontend to production hosting
- [ ] Deploy Convex backend to production

### Launch Day (Dec 9, 2024)

**Morning:**
- [ ] Final smoke test (all flows working)
- [ ] Monitor Convex error logs (set up alert system)
- [ ] Prepare welcome email copy for manual sends (if automation fails)

**Afternoon:**
- [ ] Manually approve first beta signups (if using admin UI)
- [ ] Verify welcome emails sent
- [ ] Monitor magic link delivery and click rates

**Evening:**
- [ ] Check beta metrics (signups, logins, conversations, prompts)
- [ ] Respond to any beta tester questions/issues

### Week 1 Monitoring (Dec 9-14)

**Daily:**
- [ ] Check Convex error logs for critical failures
- [ ] Monitor beta metrics (conversation starts, prompts generated)
- [ ] Respond to beta tester feedback within 24 hours

**Mid-Week:**
- [ ] Send engagement check-in email to testers who haven't generated prompts (Day 3)
- [ ] Review qualitative feedback from first prompts

**End of Week:**
- [ ] Analyze Week 1 metrics (did we hit targets?)
- [ ] Document any bugs or UX friction points discovered
- [ ] Plan fixes for Week 2

### Post-Beta (Dec 29-31)

**Cleanup:**
- [ ] Export all beta data (conversations, prompts, feedback)
- [ ] Curate 8-12 exemplar prompts for framework library
- [ ] Document lessons learned

**Next Steps:**
- [ ] Plan conversation history UI (if high demand)
- [ ] Plan framework library seeding with exemplars
- [ ] Plan scaling to 30-100 users (invite next cohort)

---

## Related Issues & PRs

- **Current branch:** `refactor/beta-focused-cleanup` (cursor agent fixes)
- **Main branch:** `main` (merge target for beta launch)

**Recent Commits:**
- `d2e1657`: "refactor: Beta-focused cleanup and conversational coach improvements"
- `448dc30`: "Merge pull request #121 from Lokie-ree/docs/readme-landing-page-rag-plan"
- `7990c19`: "docs: Add README, update landing page, and create RAG ingestion plan"

---

## Notes

### Design Decisions

**Decision 1: Prioritize Mobile Experience**
- **Rationale:** Teachers plan during lunch/commute on phones
- **Tradeoff:** Desktop experience remains clean but less feature-rich (no advanced filtering, etc.)

**Decision 2: Require Profile Completion Before Coach Access**
- **Rationale:** Core value prop (Louisiana-specific guidance) requires grade/subject
- **Tradeoff:** Adds 30-60 seconds to onboarding, but ensures personalization

**Decision 3: RAG Fallback with User-Facing Disclaimers**
- **Rationale:** Transparency builds trust; better to admit limitation than fake Louisiana alignment
- **Tradeoff:** May reduce perceived value, but maintains credibility

**Decision 4: Automate Welcome Email on Approval**
- **Rationale:** Reduces admin bottleneck, ensures consistent messaging
- **Tradeoff:** Adds complexity to approval workflow (mutation hook + scheduler)

### Future Considerations

**Post-Beta Enhancements (Priority Order):**
1. Conversation history UI (users can resume past chats)
2. Multi-turn refinement within same conversation
3. Framework library seeding with beta-tested exemplars
4. Community features (innovations, testimonials)
5. Alignment Scorecard workflow (comprehensive standards mapping)

**Scaling Considerations (30-100 Users):**
- Rate limiting for OpenAI API calls
- Admin dashboard for beta metrics
- Proactive outreach triggers (automated engagement emails)
- Framework library with 20+ exemplars
- Weekly prompt email sequence (currently feature-flagged)

**Technical Debt:**
- Conversation state persistence needs robust error recovery
- RAG search optimization (caching, composite filters)
- Test coverage for critical flows (magic link, profile, coach)

---

## Appendix: Critical Questions & Answers

### Q1: How long is the magic link valid?
**Answer:** 5 minutes (300 seconds) - configured in `convex/auth.ts:66`

### Q2: Can users access `/coach` without completing profile?
**Answer:** No - profile completion (grade + subject) is enforced via CoachRoute redirect

### Q3: What happens if RAG namespace is missing?
**Answer:** Tiered fallback strategy:
- Missing standards only: Show partial context notice
- Missing rubric only: Show partial context notice
- Missing both: Show full disclaimer ("Louisiana context temporarily unavailable")

### Q4: How does premature generation prevention work?
**Answer:** Two-layer approach:
1. Enhanced system prompt with explicit context completeness rules
2. LLM-driven detection (agent checks for grade/subject/topic before generating)

### Q5: Is welcome email automated?
**Answer:** Yes - mutation hook in `betaSignup.ts` triggers welcome email when status changes to "approved"

### Q6: Are there conversation history and resume features?
**Answer:** Not for Dec 9 launch (deferred to Phase 3 / post-beta)

### Q7: Does the chat interface work on mobile?
**Answer:** Yes - optimized for thumb zones, tested on iOS Safari and Android Chrome

### Q8: What if OpenAI API goes down during beta?
**Answer:** Coach will show error message: "I'm having trouble right now. Let's try again in a moment." (retry button provided)

---

**Plan Status:** ✅ Ready for Implementation
**Next Step:** Review this plan, then choose `/work` to begin implementation or `/plan_review` for multi-agent feedback