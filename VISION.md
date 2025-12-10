# Pelican AI: Product Vision & North Star

**Last Updated**: November 29, 2025
**Status**: REFOCUSED - Back to Core Vision
**Launch Target**: December 9, 2025

---

## The Core Problem We're Solving

Louisiana teachers face **AI overwhelm**: they know AI tools like ChatGPT, Claude, and Gemini exist, but they don't know how to use them effectively within the Louisiana education context (LEADS evaluations, Louisiana Educator Rubric, Louisiana Student Standards).

**The result**: Either they avoid AI entirely, or they get generic outputs that don't align with Louisiana's specific frameworks.

---

## What Pelican AI Actually Is

**Pelican AI is an intelligent coaching layer that helps Louisiana teachers generate high-quality, Louisiana-aligned prompts for use in ANY AI tool.**

We are **NOT**:
- ❌ Replacing ChatGPT/Claude/Gemini
- ❌ Another generic AI assistant
- ❌ A content generator that does the teaching for them
- ❌ A dashboard full of features to learn

We **ARE**:
- ✅ A conversational guide that understands Louisiana education context
- ✅ Platform-agnostic (works with whatever AI tool teachers prefer)
- ✅ Teacher-to-teacher authentic (built by a Louisiana educator)
- ✅ Focused on improving practice, not just saving time

---

## The Experience We're Building

### **Act 1: The Conversation**

A teacher opens Pelican AI and sees a simple chat interface:

> **Pelican AI**: "Hey there! What are you working on this week?"

> **Teacher**: "I'm teaching 8th grade systems of equations. My students always get confused about when to use substitution vs elimination."

> **Pelican AI**: "Got it. So you're working toward Louisiana Algebra I standard A-REI.C.6, right? The one about solving systems algebraically?"

> **Teacher**: "Yes, exactly."

> **Pelican AI**: "And the confusion is specifically about choosing the right method - not the mechanics of doing it?"

> **Teacher**: "Right. They can do both methods, they just pick randomly."

### **Act 2: The Generated Prompt**

> **Pelican AI**: "Perfect. Here's a prompt you can use in ChatGPT, Claude, or whatever tool you prefer:"

```
You are an expert Algebra I instructional designer helping me teach Louisiana 
standard A-REI.C.6 (solving systems of linear equations algebraically).

CONTEXT:
- Grade Level: 8th grade (working toward Algebra I mastery)
- Student Challenge: Students can execute both substitution and elimination 
  methods but struggle to determine WHICH method is most efficient for a 
  given system
- Louisiana Educator Rubric Focus: I want to address LER Indicator "Thinking (TH)" 
  by helping students develop analytical decision-making skills

WHAT I NEED:
Create a decision-making flowchart or rubric that helps students analyze a 
system of equations and choose the most efficient method. Include:

1. 3-4 specific criteria students should look for (e.g., "Does one equation 
   already have a variable isolated?")
2. Clear decision points that lead to method selection
3. 2-3 example systems with think-aloud reasoning
4. A predictable misconception students might have and how to address it

Make this appropriate for 8th graders and include Louisiana Student Standards 
alignment language I can reference in my lesson plan.
```

> **Teacher**: "This is perfect. Can I save this?"

> **Pelican AI**: "Already saved to 'My Prompts.' You can also mark it as successful after you try it, and it might become a shareable exemplar for other Louisiana teachers."

### **Act 3: The Feedback Loop**

A few days later:

> **Pelican AI**: "How did that systems of equations prompt work out?"

> **Teacher**: "Really well! The flowchart helped. I did have to simplify the language a bit for my students."

> **Pelican AI**: "Want to add that note to the prompt so other teachers know? I can also help you refine it for next time."

---

## Core Design Principles

### 1. **Conversation Over Configuration**
- NO forms with dropdown menus
- NO "fill in the blank" templates
- YES natural conversation that gathers context intelligently

### 2. **Louisiana-Specific Intelligence**
Every generated prompt must demonstrate knowledge of:
- Louisiana Educator Rubric (LER) indicators
- Louisiana Student Standards (grade-specific)
- LEADS evaluation framework
- Common Louisiana curriculum resources

### 3. **Platform-Agnostic Output**
The generated prompts work in:
- ChatGPT (most common)
- Claude
- Gemini
- MagicSchool AI
- Any other AI tool

We don't lock teachers into our ecosystem.

### 4. **Teacher-to-Teacher Voice**
The conversational tone must sound like:
- A colleague in the teacher's lounge
- Someone who's been in a Louisiana classroom
- Authentic, not corporate EdTech

NOT like:
- A chatbot following a script
- Generic AI assistant
- Marketing copy

### 5. **Quality Over Speed**
We're not promising "10x faster lesson planning."

We're promising: "Better aligned, more thoughtful, Louisiana-specific prompts that improve your practice."

---

## The December 2025 Beta (Dec 9-28)

### **Beta Tester Experience**

**Week 1 (Dec 9-14): Generation**
- Goal: Each tester generates 2-3 prompts for real lessons
- Success Metric: Do the prompts feel personalized and Louisiana-specific?

**Week 2 (Dec 15-21): Implementation**
- Goal: Use the prompts in actual lesson planning
- Success Metric: Did it save time AND improve practice?

**Week 3 (Dec 22-28): Refinement**
- Goal: Collaborative editing of successful prompts
- Success Metric: Can we identify what makes a "high-quality" prompt?

**Outcome**: 8-12 field-tested exemplar prompts that become the inaugural Framework Library

### **What We're Testing**

**Primary Question**: Does the conversational experience feel like an intelligent coaching layer?

**Secondary Questions**:
- Do teachers understand how to use the generated prompts?
- Does Louisiana-specific alignment actually matter to them?
- What clarifying questions are most valuable?
- How do we balance guidance vs. efficiency?

---

## Technical Implementation Priorities

### **MUST HAVE for Dec 9 Launch**

1. **Conversational Interface**
   - Simple chat input/output
   - Conversation history visible
   - Clear indication when AI is "thinking"

2. **Intelligent Prompt Generation**
   - GPT-5.1-2025-11-13 integration with Louisiana-aligned RAG
   - System prompt that embodies teacher-to-teacher voice
   - Ability to ask clarifying questions
   - Output formatted as copy-pasteable prompt

3. **Prompt Management**
   - "Save to My Prompts" functionality
   - Simple list view of saved prompts
   - Ability to copy prompt again later

4. **Feedback Collection**
   - Simple 👍/👎 on generated prompts
   - Optional text comment
   - "This worked in my classroom" flag

### **NICE TO HAVE (Post-Beta)**

- Prompt editing/refinement interface
- Public Framework Library (populated from beta successes)
- Prompt templates based on common use cases
- Integration with Google Docs/Drive
- Time tracking analytics
- Alignment Scorecard visualization

### **EXPLICITLY OUT OF SCOPE**

- Community chat features (hidden until larger user base)
- Complex onboarding flows
- All 10 original frameworks pre-loaded
- Perfect UI polish
- Mobile app

---

## System Prompt Foundation

The conversational AI must operate with this core system prompt:

```
You are Pelican AI, an intelligent coaching assistant built by a Louisiana 
teacher for Louisiana teachers. Your role is to help teachers generate 
high-quality, Louisiana-aligned prompts they can use in any AI tool 
(ChatGPT, Claude, Gemini, etc.).

CORE BEHAVIORS:
1. Ask clarifying questions like a colleague would, not like a form
2. Demonstrate knowledge of Louisiana Educator Rubric, Louisiana Student 
   Standards, and LEADS framework
3. Generate prompts that are immediately usable and Louisiana-specific
4. Use teacher-to-teacher voice (authentic, not corporate)
5. Focus on improving practice, not just saving time

CONVERSATION FLOW:
1. Understand what they're teaching (grade, subject, specific topic)
2. Identify the real challenge (misconception, pacing, differentiation, etc.)
3. Connect to Louisiana frameworks naturally (LER indicator, standards)
4. Generate a prompt that addresses their specific context
5. Explain how to use it

WHAT YOU HAVE ACCESS TO:
- Complete Louisiana Educator Rubric with all indicators
- Louisiana Student Standards (all grades, all subjects)
- LEADS evaluation framework
- Common Louisiana curriculum resources

CRITICAL: Never generate the lesson content itself. Generate the PROMPT 
that teachers can use in their preferred AI tool to get Louisiana-aligned 
support.
```

---

## Success Metrics

### **Beta Success** (Dec 9-28)
- All 4 beta testers generate at least 2 prompts
- 75%+ of generated prompts rated "helpful" (👍)
- At least 8 prompts marked "worked in my classroom"
- Qualitative feedback confirms "intelligent coaching" feel

### **Post-Beta Success** (Q1 2025)
- Beta testers continue using Pelican AI after beta ends
- At least 3 beta testers refer a colleague
- Framework Library has 15+ high-quality exemplars
- Average time from conversation to usable prompt: <5 minutes

---

## What We're NOT Building (And Why)

### **We're NOT building a replacement for ChatGPT/Claude**
**Why**: Teachers already have access to powerful AI tools. They need help using them well, not another tool to learn.

### **We're NOT building generic frameworks**
**Why**: The original 10 frameworks felt stale because they tried to be everything to everyone. Louisiana-specific, context-aware prompts are the differentiation.

### **We're NOT building a complex platform**
**Why**: Teachers are overwhelmed. They need simplicity and intelligence, not features and dashboards.

### **We're NOT building for scale (yet)**
**Why**: 4 beta testers who love the product are worth more than 100 who are confused by it.

---

## Decision-Making Filter

When evaluating any feature, design choice, or technical decision, ask:

**"Does this help a Louisiana teacher get a better, more aligned prompt faster?"**

If yes → consider it  
If no → cut it  
If maybe → ask a beta tester

---

## The Vision in One Sentence

**Pelican AI is the intelligent colleague who helps Louisiana teachers transform vague AI interactions into Louisiana-aligned instructional excellence.**

---

## Appendix: Original Vision Documents Reference

The following documents capture the original vision and should inform prompt generation:

1. **Lesson Objective Unpacker & Success Criteria Builder** (AIB-001)
   - Addresses: Hidden Complexity, Success Criteria Overwhelm, Misconception Blindness
   - 3-step process: Gather ingredients → Copy prompt → Understand output

2. **Comprehensive Support Plan: Solving Systems of Equations**
   - Phased approach aligned to LEAP 2025 Achievement Level Descriptors
   - Teacher-to-teacher scaffolding language

3. **Strategic Guide to Professional Growth (Louisiana Educator Rubric)**
   - Self-assessment → Goal setting → Action planning cycle
   - All 4 domains: Instruction, Planning, Environment, Professionalism

These exemplify the quality and Louisiana-specificity we're aiming for in generated prompts.

---

## Questions This Document Should Answer

- **What is Pelican AI?** → An intelligent coaching layer for Louisiana teachers
- **Who is it for?** → Louisiana K-12 teachers navigating LEADS evaluations
- **What does it do?** → Generates Louisiana-aligned prompts for any AI tool
- **Why not just use ChatGPT directly?** → Teachers need Louisiana-specific guidance
- **What's the beta testing?** → Whether the conversational experience feels intelligent
- **What's success look like?** → Teachers feeling coached, not just served

---

**This document is the North Star. When in doubt, return to this vision.**