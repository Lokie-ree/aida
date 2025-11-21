# Pelican AI: Beta Core Frameworks Overview

**Last Updated:** November 21, 2025  
**Status:** Archived Reference - Detailed prompts maintained in `convex/seedFrameworks.ts`

---

## Overview

Pelican AI launched with 10 platform-agnostic AI guidance frameworks designed for Louisiana educators. These frameworks work with ANY AI tool (ChatGPT, Gemini, MagicSchool AI, Claude, etc.) and are organized into two modules.

For the complete, up-to-date framework prompts and details, see `convex/seedFrameworks.ts`.

---

## AI Basics Hub (6 Frameworks)

### Advanced Louisiana-Specific Frameworks

**AIB-001: Louisiana Lesson Alignment Analyzer**
- **Purpose:** Cross-reference lesson plans against Louisiana Student Standards, Louisiana Educator Rubric, and LEAP expectations
- **Time:** ~20 minutes
- **Difficulty:** Advanced
- **Key Output:** 5-part analysis (Standard Breakdown, Rigor Check, LER Alignment, LEAP Readiness, Refinement)
- **Why It Matters:** Addresses "Alignment Anxiety" - helps educators confidently verify their lessons meet Louisiana standards before teaching

**AIB-006: 10-Minute Curriculum Internalizer**
- **Purpose:** Extract essential knowledge from district-adopted curriculum guides
- **Time:** ~15 minutes
- **Difficulty:** Advanced
- **Key Output:** 6 outputs (Big Idea, Instructional Structure, Non-Negotiables, Flex Points, Misconceptions, Prep Checklist)
- **Why It Matters:** Solves "Curriculum Overwhelm" - helps teachers understand what to preserve (fidelity) and where to adapt (flexibility)

**AIB-008: Louisiana Contextualization Engine**
- **Purpose:** Transform generic curriculum examples into Louisiana-specific contexts
- **Time:** ~10 minutes
- **Difficulty:** Advanced
- **Key Output:** 4 outputs (Louisiana Context, Local Hooks, Authenticity Check, Extension Opportunities)
- **Why It Matters:** Reduces cognitive load and increases engagement by making learning relevant to students' communities

### Essential Productivity Frameworks

**AIB-002: Document Summarization for Professional Reading**
- **Purpose:** Extract key information from educational research, curriculum guides, and policy documents
- **Time:** ~8 minutes
- **Difficulty:** Beginner

**AIB-003: Email Drafting for Parent Communication**
- **Purpose:** Draft professional, compassionate parent emails
- **Time:** ~10 minutes
- **Difficulty:** Beginner

**AIB-004: Meeting Notes and Action Item Extraction**
- **Purpose:** Organize key decisions and action items from meetings
- **Time:** ~5 minutes
- **Difficulty:** Beginner

---

## Instructional Expert Hub (4 Frameworks)

**IEH-001: Unpacking Louisiana State Standards**
- **Purpose:** Break down complex Louisiana standards into clear, measurable learning objectives
- **Time:** ~20 minutes
- **Difficulty:** Intermediate
- **LER Alignment:** Domain 1 (INSTRUCTION) - Standards and Objectives (SO)

**IEH-002: Creating Standards-Aligned 'I Can' Statements**
- **Purpose:** Translate standards into student-friendly "I can" statements at three levels
- **Time:** ~15 minutes
- **Difficulty:** Intermediate

**IEH-003: Anticipating Student Misconceptions**
- **Purpose:** Identify potential misconceptions before teaching and plan instructional strategies
- **Time:** ~18 minutes
- **Difficulty:** Intermediate

**IEH-004: Creating Exemplar Work and Rubrics**
- **Purpose:** Design clear rubrics and exemplar work that help students understand expectations
- **Time:** ~25 minutes
- **Difficulty:** Intermediate

---

## Framework Design Philosophy

### Consistent Structure

Each framework follows the same empowering structure:
1. **Challenge** - Identifies a specific pain point that consumes valuable time and creates anxiety
2. **Solution** - Provides a streamlined step-by-step process
3. **Sample Prompt** - Copy-paste ready prompt for any AI platform
4. **Ethical Guardrail** - Reminds educators they remain the professional decision-maker
5. **Tips & Variations** - Practical implementation guidance

### Platform-Agnostic Approach

All frameworks work with:
- MagicSchool AI
- Gemini
- SchoolAI
- ChatGPT
- Claude
- Any other AI tool

This ensures no vendor lock-in and respects educators' existing tool preferences.

### Louisiana-Specific Integration

The three advanced frameworks (AIB-001, AIB-006, AIB-008) are built on:
- Louisiana Student Standards
- Louisiana Educator Rubric (LER)
- LEAP Achievement Level Descriptors
- LEADS evaluation system

This competitive advantage cannot be replicated by generic AI tools that lack Louisiana's specific instructional frameworks.

---

## Framework Evolution

Additional frameworks will be added based on educator feedback. The current 10 frameworks address the most pressing daily challenges identified through teacher pain point research:

1. **Alignment Anxiety** → AIB-001
2. **Curriculum Overwhelm** → AIB-006
3. **Distant Curriculum Problem** → AIB-008
4. **Professional Reading Overload** → AIB-002
5. **Parent Communication Time** → AIB-003
6. **Meeting Note Organization** → AIB-004
7. **Standards Unpacking** → IEH-001, IEH-002
8. **Anticipating Misconceptions** → IEH-003
9. **Creating Clear Expectations** → IEH-004

---

## For Developers

**Source of Truth:** `convex/seedFrameworks.ts`

All framework prompts, metadata, and configuration are maintained in the `seedFrameworks.ts` file. This document provides a high-level overview only.

To seed frameworks in the database:
```bash
npx convex run seedFrameworks:seedInitialFrameworks
```

---

**Note:** This document is archived reference material. For active development and current framework details, refer to `convex/seedFrameworks.ts`.
