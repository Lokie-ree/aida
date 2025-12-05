# Pelican AI Coach Interface Redesign - Full Implementation Plan

**Date:** December 4, 2024
**Objective:** Complete overhaul of coach interface using @prompt-kit components with minimal navigation complexity
**Architecture:** Option A - Single-Page App with Sheet Library

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Changes](#architecture-changes)
3. [Component Installation](#component-installation)
4. [File-by-File Implementation](#file-by-file-implementation)
5. [Component Usage Guide](#component-usage-guide)
6. [Migration Strategy](#migration-strategy)
7. [Testing Checklist](#testing-checklist)
8. [Rollback Plan](#rollback-plan)

---

## Overview

### Goals

✅ **Simplify navigation** - Remove all unnecessary touchpoints
✅ **Maximize conversation space** - Reclaim vertical space for chat
✅ **Professional AI chat UX** - Leverage @prompt-kit components
✅ **Mobile-first design** - Beta testers are teachers on mobile devices
✅ **Louisiana-specific intelligence** - Focus on coaching quality, not UI complexity

### What's Changing

| Before | After |
|--------|-------|
| Dashboard route + Coach route | Coach only (default route) |
| Top navigation with multiple links | Minimal header (logo, theme, sign out) |
| Page tabs (Coach/Library) | Coach always visible, Library in Sheet |
| Mobile hamburger menu | No menu needed |
| Floating Action Button | Single "My Prompts" button |
| Custom chat components | @prompt-kit components |
| ~140px header height | ~56px header height |

### Expected Outcomes

- **84px vertical space reclaimed** (140px → 56px header)
- **5+ touchpoints reduced to 2** (Theme toggle + Library trigger)
- **Professional chat interface** (production-ready components)
- **Faster development** (less custom code to maintain)
- **Better mobile experience** (simplified navigation)

---

## Architecture Changes

### New Route Structure

```typescript
// Before
/ → Landing page
/dashboard → Dashboard (user home)
/coach → Prompt Coach
/profile → User settings

// After
/ → Landing page
/coach → Prompt Coach (default authenticated route, redirects from /)
// No dashboard, no profile route (profile accessible via future settings menu)
```

### New Component Hierarchy

```
App.tsx
├── Routes
│   ├── / (Landing - public)
│   └── /coach (Coach - authenticated, default)
│       └── PromptCoach.tsx
│           ├── MinimalHeader.tsx (new)
│           ├── ChatInterface.tsx (refactored with @prompt-kit)
│           └── Sheet (shadcn)
│               └── PromptLibrary.tsx (existing, minimal changes)
```

### Visual Layout

```
┌─────────────────────────────────────────────────────┐
│ [Pelican AI Logo]         [🌙 Theme] [Sign Out]    │ ← 56px header
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│              CHAT INTERFACE                         │
│              (@prompt-kit components)               │
│                                                     │
│                                                     │
│                                                     │
│                                              [📚 →] │ ← Sheet trigger
└─────────────────────────────────────────────────────┘

// When "My Prompts" clicked:
┌──────────────────────────┬──────────────────────────┐
│                          │  MY PROMPTS              │
│   CHAT INTERFACE         │  ┌────────────────────┐  │
│   (dimmed overlay)       │  │ Saved Prompt 1     │  │
│                          │  │ Saved Prompt 2     │  │
│                          │  │ Saved Prompt 3     │  │
│                          │  └────────────────────┘  │
│                          │                          │
└──────────────────────────┴──────────────────────────┘
```

---

## Component Installation

### Phase 1: Install @prompt-kit Components

```bash
# Core chat components (required)
npx shadcn@latest add @prompt-kit/chat-container
npx shadcn@latest add @prompt-kit/message
npx shadcn@latest add @prompt-kit/prompt-input
npx shadcn@latest add @prompt-kit/markdown

# Empty state and interactions (required)
npx shadcn@latest add @prompt-kit/prompt-suggestion
npx shadcn@latest add @prompt-kit/loader

# Utilities (recommended)
npx shadcn@latest add @prompt-kit/scroll-button
npx shadcn@latest add @prompt-kit/feedback-bar

# Advanced features (optional - add later)
npx shadcn@latest add @prompt-kit/response-stream
npx shadcn@latest add @prompt-kit/reasoning
npx shadcn@latest add @prompt-kit/code-block
```

**Note:** If the registry format differs, you may need to check prompt-kit documentation for exact installation commands. The pattern should be similar to shadcn/ui.

### Phase 2: Verify Existing shadcn Components

These are already installed and will be used:

```bash
# Verify these exist in src/components/ui/
- sheet.tsx          # For library slide-out
- button.tsx         # For actions
- card.tsx           # For prompt cards in library
- avatar.tsx         # For user/AI avatars in chat
- scroll-area.tsx    # For scrollable areas
```

### Phase 3: Animation Enhancements (Optional - Post-Beta)

```bash
# Add later for polish
npx shadcn@latest add @magicui/shimmer
npx shadcn@latest add @magicui/text-shimmer
```

---

## File-by-File Implementation

### 1. `src/App.tsx` - Simplified Routing

**Changes:**
- Remove Dashboard route
- Set `/coach` as default authenticated route
- Remove CoachActionsContext (no longer needed)
- Simplify navigation logic

**New Implementation:**

```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import { ConvexProvider } from "convex/react";
import { ConvexReactClient } from "convex/react";
import { BetterAuthProvider } from "@/lib/auth-client";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

// Pages
import LandingPage from "@/components/landing/LandingPage";
import PromptCoach from "@/components/coach/PromptCoach";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function App() {
  return (
    <ConvexProvider client={convex}>
      <BetterAuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="pelican-theme">
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <Unauthenticated>
                  <LandingPage />
                </Unauthenticated>
              } />

              {/* Authenticated routes */}
              <Route path="/coach" element={
                <Authenticated>
                  <PromptCoach />
                </Authenticated>
              } />

              {/* Redirect authenticated users from / to /coach */}
              <Route path="/" element={
                <Authenticated>
                  <Navigate to="/coach" replace />
                </Authenticated>
              } />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </BetterAuthProvider>
    </ConvexProvider>
  );
}

export default App;
```

**Removed:**
- Dashboard route
- Profile route
- CoachActionsContext
- Complex routing logic

---

### 2. `src/components/coach/PromptCoach.tsx` - Complete Redesign

**Changes:**
- Add minimal header (inline component)
- Remove page-level tabs
- Remove FAB (Floating Action Button)
- Add Sheet for library
- Use @prompt-kit chat components

**New Implementation:**

```typescript
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuthClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { Library, LogOut } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import AnimatedThemeToggler from "@/components/shared/AnimatedThemeToggler";

// @prompt-kit components
import { ChatContainer } from "@/components/ui/chat-container";
import { ScrollButton } from "@/components/ui/scroll-button";

// Local components
import ChatInterface from "./ChatInterface";
import PromptLibrary from "./PromptLibrary";

export default function PromptCoach() {
  const { signOut } = useAuthClient();
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Fetch current conversation
  const conversation = useQuery(
    api.promptCoach.getConversation,
    currentConversationId ? { conversationId: currentConversationId } : "skip"
  );

  // Start new conversation mutation
  const startConversation = useMutation(api.promptCoach.startConversation);

  // Initialize first conversation on mount
  useEffect(() => {
    if (!currentConversationId) {
      startConversation({}).then((id) => setCurrentConversationId(id));
    }
  }, [currentConversationId, startConversation]);

  const handleStartNew = async () => {
    const newId = await startConversation({});
    setCurrentConversationId(newId);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Minimal Header */}
      <header className="h-14 border-b px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="Pelican AI" className="h-6 w-6" />
          <span className="font-bold text-lg">Pelican AI</span>
        </div>

        <div className="flex items-center gap-2">
          <AnimatedThemeToggler />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Chat Interface */}
      <main className="flex-1 overflow-hidden relative">
        <ChatContainer>
          <ChatInterface
            conversationId={currentConversationId}
            onStartNew={handleStartNew}
          />
          <ScrollButton />
        </ChatContainer>

        {/* Library Trigger Button - Fixed position */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Sheet open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="gap-2 shadow-lg">
                <Library className="h-5 w-5" />
                <span className="hidden sm:inline">My Prompts</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle>My Saved Prompts</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <PromptLibrary onClose={() => setIsLibraryOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>
      </main>
    </div>
  );
}
```

**Key Changes:**
- **Header:** Inline minimal header (56px height)
- **No tabs:** Chat is always visible
- **Library as Sheet:** Slide-out from right
- **ChatContainer wrapper:** Uses @prompt-kit container
- **ScrollButton:** Auto-scroll functionality from @prompt-kit
- **Fixed "My Prompts" button:** Replaces FAB pattern

---

### 3. `src/components/coach/ChatInterface.tsx` - Refactor with @prompt-kit

**Changes:**
- Use @prompt-kit Message component
- Use @prompt-kit PromptInput component
- Use @prompt-kit PromptSuggestion for empty state
- Use @prompt-kit Loader for loading states
- Use @prompt-kit Markdown for AI responses

**New Implementation:**

```typescript
import { useState, useRef, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, Lightbulb, GraduationCap, FlaskConical } from "lucide-react";

// @prompt-kit components
import { Message } from "@/components/ui/message";
import { PromptInput } from "@/components/ui/prompt-input";
import { PromptSuggestion } from "@/components/ui/prompt-suggestion";
import { Loader } from "@/components/ui/loader";
import { Markdown } from "@/components/ui/markdown";

// UI components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatInterfaceProps {
  conversationId: string | null;
  onStartNew: () => void;
}

export default function ChatInterface({ conversationId, onStartNew }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversation messages
  const conversation = useQuery(
    api.promptCoach.getConversation,
    conversationId ? { conversationId } : "skip"
  );

  // Send message action
  const sendMessage = useAction(api.promptCoach.sendMessage);

  // STEM-focused starter prompts for beta testers
  const starterPrompts = [
    {
      icon: FlaskConical,
      text: "Help me internalize Louisiana Science standards for my 8th grade unit on chemical reactions",
      category: "Curriculum Internalization"
    },
    {
      icon: GraduationCap,
      text: "I need to analyze LEAP assessment data for my Algebra 1 class and identify learning gaps",
      category: "Assessment Analysis"
    },
    {
      icon: Lightbulb,
      text: "Generate a differentiated lesson plan for IEP students in my physics class",
      category: "Differentiation"
    },
    {
      icon: Sparkles,
      text: "Collect evidence for TKS (Teacher Knowledge of Students) indicator for my LEADS observation",
      category: "LER Evidence"
    }
  ];

  const handleSubmit = async (text: string) => {
    if (!text.trim() || !conversationId || isLoading) return;

    setIsLoading(true);
    setInput("");

    try {
      await sendMessage({
        conversationId,
        message: text,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarterPromptClick = (promptText: string) => {
    handleSubmit(promptText);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  // Empty state - no conversation started yet
  if (!conversation || !conversation.messages || conversation.messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8 space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Bot className="h-12 w-12 md:h-16 md:w-16 text-primary" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">Welcome to Prompt Coach</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl">
            Your Louisiana-aligned instructional design partner. Tell me what you're teaching,
            and I'll help you create prompts that work in any AI tool.
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-3">
          <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Try these STEM examples:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {starterPrompts.map((prompt, idx) => {
              const IconComponent = prompt.icon;
              return (
                <PromptSuggestion
                  key={idx}
                  onClick={() => handleStarterPromptClick(prompt.text)}
                >
                  <div className="flex items-start gap-3 text-left">
                    <IconComponent className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight mb-1">
                        {prompt.text}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {prompt.category}
                      </p>
                    </div>
                  </div>
                </PromptSuggestion>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active conversation
  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {conversation.messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Message
                role={msg.role}
                avatar={
                  msg.role === "user" ? (
                    <Avatar>
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )
                }
              >
                {msg.role === "assistant" ? (
                  <Markdown content={msg.content} />
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </Message>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3"
          >
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted">
              <Loader variant="typing" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 space-y-2">
        <PromptInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(input);
          }}
          placeholder="Describe what you're teaching or ask a question..."
          disabled={isLoading}
        />

        {conversation.messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onStartNew}
            className="text-xs"
          >
            Start New Conversation
          </Button>
        )}
      </div>
    </div>
  );
}
```

**Key @prompt-kit Components Used:**
- `Message` - Chat message bubbles with avatar support
- `PromptInput` - Auto-resizing input with submit handling
- `PromptSuggestion` - Interactive starter prompts
- `Loader` - Typing indicator for AI thinking
- `Markdown` - Renders AI responses with formatting

---

### 4. `src/components/coach/PromptLibrary.tsx` - Minor Updates

**Changes:**
- Add `onClose` prop for Sheet integration
- Minor styling adjustments for Sheet context

**Updated Implementation:**

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { Copy, Check, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import { useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PromptLibraryProps {
  onClose?: () => void;
}

export default function PromptLibrary({ onClose }: PromptLibraryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch user's saved prompts
  const savedPrompts = useQuery(api.promptCoach.getSavedPrompts);

  // Delete prompt mutation
  const deletePrompt = useMutation(api.promptCoach.deletePrompt);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (promptId: string) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      await deletePrompt({ promptId });
    }
  };

  if (!savedPrompts || savedPrompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
        <p className="text-muted-foreground">
          No saved prompts yet. Generate your first Louisiana-aligned prompt to get started!
        </p>
        {onClose && (
          <Button onClick={onClose}>
            Start Coaching Session
          </Button>
        )}
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 pb-6">
        {savedPrompts.map((prompt, idx) => (
          <motion.div
            key={prompt._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-start justify-between gap-2">
                  <span className="flex-1">{prompt.title || "Generated Prompt"}</span>
                  <div className="flex items-center gap-1">
                    {prompt.workedInClassroom && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                        ✓ Classroom Tested
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {prompt.content}
                </p>

                {/* Metadata */}
                {(prompt.subject || prompt.gradeLevel) && (
                  <div className="flex gap-2 flex-wrap">
                    {prompt.subject && (
                      <Badge variant="outline">{prompt.subject}</Badge>
                    )}
                    {prompt.gradeLevel && (
                      <Badge variant="outline">Grade {prompt.gradeLevel}</Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(prompt.content, prompt._id)}
                      className="gap-2"
                    >
                      {copiedId === prompt._id ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Feedback indicators */}
                    {prompt.feedbackRating === "positive" && (
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                    )}
                    {prompt.feedbackRating === "negative" && (
                      <ThumbsDown className="h-4 w-4 text-red-600" />
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(prompt._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}
```

**Changes:**
- Added `onClose` prop for Sheet integration
- Empty state now has "Start Coaching Session" button
- Removed redundant navigation elements

---

### 5. Files to Delete/Archive

**Remove these files (no longer needed):**

```bash
# Dashboard components (not needed for beta)
src/components/dashboard/Dashboard.tsx
src/components/dashboard/DashboardCards.tsx
src/components/dashboard/RecentActivity.tsx
# Keep ProfileSettings.tsx for future use

# Archived navigation components
src/components/shared/Navigation.tsx  # Replaced by minimal header
```

**Archive approach:**
```bash
# Create archive folder
mkdir -p src/components/_archived

# Move files
mv src/components/dashboard src/components/_archived/
mv src/components/shared/Navigation.tsx src/components/_archived/
```

---

## Component Usage Guide

### @prompt-kit Component Props

#### ChatContainer
```typescript
<ChatContainer>
  {children} // Your chat interface content
</ChatContainer>
```
- Handles auto-scroll behavior
- Manages scroll-to-bottom functionality
- Works with ScrollButton component

#### Message
```typescript
<Message
  role="user" | "assistant"  // Required
  avatar={<Avatar>...</Avatar>}  // Optional
  actions={<div>...</div>}  // Optional action buttons
>
  {content}  // Message content (text or JSX)
</Message>
```

#### PromptInput
```typescript
<PromptInput
  value={string}
  onChange={(e) => setInput(e.target.value)}
  onSubmit={(e) => handleSubmit()}
  placeholder={string}
  disabled={boolean}
/>
```
- Auto-resizes as user types
- Supports multiline input
- Enter to submit (Shift+Enter for new line)

#### PromptSuggestion
```typescript
<PromptSuggestion
  onClick={() => handleClick()}
  variant="default" | "outline"  // Optional
>
  {content}  // Prompt suggestion content
</PromptSuggestion>
```
- Interactive button for starter prompts
- Supports highlighting
- Hover effects built-in

#### Loader
```typescript
<Loader
  variant="typing" | "dots" | "pulse" | "wave" | "shimmer"
/>
```
- 11+ variants available
- Use "typing" for chat thinking indicator

#### Markdown
```typescript
<Markdown
  content={string}  // Markdown string to render
  className={string}  // Optional custom styling
/>
```
- Supports GitHub Flavored Markdown
- Code block rendering with syntax highlighting
- Handles line breaks properly

---

## Migration Strategy

### Phase 1: Preparation (30 minutes)

**Step 1: Create feature branch**
```bash
git checkout -b feature/coach-redesign-prompt-kit
```

**Step 2: Backup current implementation**
```bash
# Archive current components
mkdir -p src/components/_archived/coach-v1
cp -r src/components/coach/* src/components/_archived/coach-v1/
```

**Step 3: Install dependencies**
```bash
# Install @prompt-kit components
npx shadcn@latest add @prompt-kit/chat-container
npx shadcn@latest add @prompt-kit/message
npx shadcn@latest add @prompt-kit/prompt-input
npx shadcn@latest add @prompt-kit/prompt-suggestion
npx shadcn@latest add @prompt-kit/loader
npx shadcn@latest add @prompt-kit/scroll-button
npx shadcn@latest add @prompt-kit/markdown
```

### Phase 2: Implementation (2-3 hours)

**Step 1: Update App.tsx** (15 min)
- Simplify routing
- Remove Dashboard route
- Remove CoachActionsContext

**Step 2: Redesign PromptCoach.tsx** (45 min)
- Implement minimal header
- Add Sheet for library
- Integrate ChatContainer

**Step 3: Refactor ChatInterface.tsx** (60 min)
- Replace custom chat components with @prompt-kit
- Update empty state with PromptSuggestion
- Integrate Loader for thinking indicator
- Update message rendering with Message component

**Step 4: Update PromptLibrary.tsx** (15 min)
- Add onClose prop
- Adjust styling for Sheet context

**Step 5: Clean up AppHeader.tsx** (15 min)
- Remove coach-specific quick actions
- Keep theme toggle and auth components for future use

### Phase 3: Testing (1 hour)

**Step 1: Build verification**
```bash
pnpm lint
```

**Step 2: Manual testing checklist**
- [ ] Landing page loads correctly
- [ ] Authentication flow works (signup/login)
- [ ] Default redirect to /coach after login
- [ ] Chat interface renders empty state
- [ ] Starter prompts clickable
- [ ] Message sending works
- [ ] AI responses display correctly
- [ ] Markdown rendering works in responses
- [ ] Loading indicator shows during AI thinking
- [ ] Sheet opens for library
- [ ] Saved prompts display in library
- [ ] Copy prompt to clipboard works
- [ ] Delete prompt works
- [ ] Sign out works
- [ ] Theme toggle works
- [ ] Mobile responsive (test at 375px, 768px, 1024px)

**Step 3: Cross-browser testing**
- Chrome
- Firefox
- Safari (if available)

### Phase 4: Deployment (15 minutes)

**Step 1: Commit changes**
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

**Step 2: Push and create PR**
```bash
git push origin feature/coach-redesign-prompt-kit
gh pr create --title "Coach Interface Redesign - @prompt-kit Integration" --body "See docs/coach-redesign-implementation-plan.md for details"
```

**Step 3: Deploy to production** (after review)
```bash
# Merge to main
git checkout main
git merge feature/coach-redesign-prompt-kit
git push origin main

# Convex automatically deploys backend
# Vite build for frontend
pnpm build
```

---

## Testing Checklist

### Functional Testing

**Authentication Flow:**
- [ ] User can sign up from landing page
- [ ] User can log in
- [ ] Authenticated users redirect to /coach
- [ ] Unauthenticated users redirect to landing page
- [ ] Sign out button works
- [ ] Sign out redirects to landing page

**Chat Interface:**
- [ ] Empty state displays on first visit
- [ ] Starter prompts render correctly (4 STEM examples)
- [ ] Clicking starter prompt sends message
- [ ] Manual message input works
- [ ] Message appears in chat history
- [ ] AI response appears after sending
- [ ] Markdown renders correctly in AI responses
- [ ] Code blocks render with syntax highlighting (if applicable)
- [ ] Loading indicator shows while AI thinks
- [ ] Conversation persists on page reload
- [ ] "Start New Conversation" button works
- [ ] New conversation clears previous messages

**Library Sheet:**
- [ ] "My Prompts" button opens Sheet
- [ ] Sheet slides in from right
- [ ] Sheet backdrop dims main content
- [ ] Clicking outside Sheet closes it
- [ ] Empty state shows if no saved prompts
- [ ] Saved prompts display as cards
- [ ] Copy button copies to clipboard
- [ ] "Copied!" confirmation shows
- [ ] Delete button shows confirmation
- [ ] Delete removes prompt from list
- [ ] Feedback indicators display (thumbs up/down)
- [ ] "Classroom Tested" badge shows when applicable
- [ ] Sheet is scrollable with many prompts

**Responsive Design:**
- [ ] Mobile (375px): All content readable and usable
- [ ] Mobile: Header fits on one line
- [ ] Mobile: "My Prompts" button accessible
- [ ] Mobile: Chat messages don't overflow
- [ ] Mobile: Input area always visible
- [ ] Tablet (768px): Optimal layout
- [ ] Desktop (1024px+): Optimal layout
- [ ] Sheet width appropriate on all sizes

**Theme Toggle:**
- [ ] Toggle switches between light/dark/system
- [ ] Theme persists on reload
- [ ] All components render correctly in both themes
- [ ] No contrast issues in dark mode

### Performance Testing

- [ ] Initial page load < 2 seconds
- [ ] Message send/receive feels instant
- [ ] Sheet animation smooth (60fps)
- [ ] No layout shifts during load
- [ ] Images load quickly
- [ ] No memory leaks after extended use

### Accessibility Testing

- [ ] Keyboard navigation works throughout
- [ ] Focus indicators visible
- [ ] Screen reader announces messages
- [ ] ARIA labels present on interactive elements
- [ ] Color contrast meets WCAG AA standards
- [ ] Form inputs have proper labels

### Browser Compatibility

**Chrome:**
- [ ] All features work
- [ ] Animations smooth

**Firefox:**
- [ ] All features work
- [ ] Animations smooth

**Safari:**
- [ ] All features work
- [ ] Animations smooth
- [ ] No webkit-specific issues

---

## Rollback Plan

### If Critical Issues Found

**Option 1: Quick Hotfix**
```bash
# Create hotfix branch from main
git checkout -b hotfix/coach-redesign-issue

# Make fixes
# Test
# Commit and merge
```

**Option 2: Full Rollback**
```bash
# Revert the merge commit
git revert -m 1 <merge-commit-hash>
git push origin main

# Restore from archive
cp -r src/components/_archived/coach-v1/* src/components/coach/
```

### Backup Locations

- **Code:** `src/components/_archived/coach-v1/`
- **Git:** Previous commit before merge
- **Documentation:** This file

---

## Post-Implementation Monitoring

### Week 1: Monitor Beta Usage

**Track:**
- Conversation start rate (target: 5/5 beta testers start at least 1 conversation)
- Message send rate (target: Average 10+ messages per conversation)
- Prompt save rate (target: 2+ prompts saved per tester)
- Library open rate (target: 50%+ of users open library)
- Error rates (target: <1% error rate)

### Week 2: Gather Feedback

**Questions for beta testers:**
1. Is the chat interface intuitive?
2. Do starter prompts help you get started?
3. Is the library easy to access and use?
4. Any navigation confusion?
5. Mobile vs. desktop experience?

### Week 3: Iterate

**Potential enhancements based on feedback:**
- Add more starter prompts
- Improve AI response formatting
- Add prompt categories in library
- Add search/filter in library
- Improve loading states

---

## Additional Notes

### Design Decisions

**Why Option A (Single-Page with Sheet)?**
- Maximizes space for primary use case (conversation)
- Minimizes navigation complexity
- Library as supporting feature (quick reference)
- Clean, focused experience
- Mobile-friendly pattern

**Why @prompt-kit over custom components?**
- Production-ready chat UX patterns
- Saves development time
- Professional polish
- Maintained by community
- Consistent with shadcn/ui ecosystem

**Why minimal header?**
- Beta testers need space for conversation, not navigation
- Only essential utilities (theme, sign out)
- No navigation needed (single route)
- More screen real estate for coaching

### Future Enhancements (Post-Beta)

**Phase 1 (Weeks 4-6):**
- Add @prompt-kit ResponseStream for streaming text effect
- Add @prompt-kit FeedbackBar for inline ratings
- Add @prompt-kit Reasoning if showing AI thinking process

**Phase 2 (Months 2-3):**
- Re-introduce Dashboard (if analytics needed)
- Add Profile settings page
- Add Community features (innovations, testimonials)
- Add Framework Library (populated from successful beta prompts)

**Phase 3 (Months 4-6):**
- Add Alignment Scorecard workflow
- Add Advanced RAG search features
- Add Prompt versioning/history
- Add Collaborative features (share prompts)

---

## Success Metrics

### Immediate (Post-Deployment)

✅ **Build succeeds** with no TypeScript errors
✅ **All routes work** (landing, coach, redirects)
✅ **Chat interface functional** (send/receive messages)
✅ **Library accessible** (Sheet opens, prompts display)
✅ **Mobile responsive** (375px to 1920px)

### Week 1 (Beta Usage)

✅ **5/5 beta testers** start at least 1 conversation
✅ **Average 10+ messages** per conversation
✅ **2+ prompts saved** per tester
✅ **<1% error rate** in production logs
✅ **Positive feedback** on simplified navigation

### Week 4 (Post-Beta Review)

✅ **75%+ prompts** rated "helpful" (thumbs up)
✅ **10+ prompts** marked "worked in classroom"
✅ **Qualitative feedback** confirms "intelligent coaching" feel
✅ **Zero critical bugs** reported
✅ **Beta testers recommend** to colleagues

---

**Document Version:** 1.0
**Last Updated:** December 4, 2024
**Implementation Status:** Ready for execution
**Estimated Time:** 4-5 hours total (prep + implementation + testing)
