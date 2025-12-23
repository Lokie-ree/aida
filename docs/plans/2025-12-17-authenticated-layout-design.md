# Authenticated Layout with Sidebar - Design Document

## Overview

This document describes the architecture for a unified authenticated layout with a persistent sidebar for Pelican AI. The goal is to provide consistent navigation across all authenticated routes while enabling scalability for future platform features.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Sidebar visibility | Always visible on desktop | Conversations are core; quick access from anywhere |
| Mobile approach | Keep hamburger menu | Existing implementation works well; avoid rework |
| My Prompts | Real route (`/prompts`) | Better for bookmarking, deep linking, independent growth |
| Conversation URLs | Nested route (`/coach/:conversationId`) | Clean, shareable URLs |
| State management | URL as source of truth | Simpler mental model, no context complexity |
| Collapsed sidebar | Icons only (Lucide) | Clean minimal view; conversations hidden until expanded |
| Mobile menu order | Aligned with sidebar | Consistent mental model across devices |
| Session overflow | Show 10, defer "view all" | Keep v1 scope tight; revisit when needed |
| Profile completion | Inline prompt only | Profile not currently used in conversation; don't block access |

## Route Structure

```
/coach                    → Welcome state / new chat
/coach/:conversationId    → Specific conversation
/prompts                  → My Prompts library
/profile                  → Profile settings
```

### App.tsx Structure

```tsx
<Authenticated>
  <Routes>
    <Route element={<AuthenticatedLayout />}>
      <Route path="/coach" element={<CoachPage />} />
      <Route path="/coach/:conversationId" element={<CoachPage />} />
      <Route path="/prompts" element={<PromptsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/coach" replace />} />
  </Routes>
</Authenticated>
```

## Component Architecture

### AuthenticatedLayout

The main layout wrapper that provides sidebar and mobile header to all authenticated routes.

```tsx
// src/components/layout/AuthenticatedLayout.tsx

export function AuthenticatedLayout() {
  const [collapsed, setCollapsed] = useState(() =>
    localStorage.getItem("sidebar-collapsed") === "true"
  );
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const location = useLocation();

  // Data fetching - queries live here, not in child pages
  const conversations = useQuery(api.promptCoach.listConversations);
  const savedPrompts = useQuery(api.promptCoach.getSavedPrompts);
  const userProfile = useQuery(api.userProfiles.getUserProfile);

  // Handlers
  const handleNewChat = async () => { /* start conversation, navigate */ };
  const handleSelectConversation = (id: string) => navigate(`/coach/${id}`);
  const handleRenameSession = async (id: string, title: string) => { ... };
  const handleDeleteSession = async (id: string) => { ... };

  return (
    <div className="h-dvh flex">
      {/* Desktop Sidebar - hidden on mobile */}
      <AppSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        conversations={conversations}
        currentConversationId={conversationId}
        promptCount={savedPrompts?.length ?? 0}
        currentPath={location.pathname}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <MobileHeader /> {/* Hamburger menu, visible md:hidden */}
        <Outlet />
      </main>
    </div>
  );
}
```

### AppSidebar Structure

```
┌─────────────────────────────┐
│ Pelican AI             [<>] │  ← Logo + collapse toggle
├─────────────────────────────┤
│ + New Chat                  │  ← Primary action
├─────────────────────────────┤
│ My Prompts (12)             │  ← Core feature, prominent
├─────────────────────────────┤
│ RECENT SESSIONS             │
│ RL.5.3 Character...      ⋮  │  ← Conversation list with kebab
│ 8th Grade Math...        ⋮  │
│ Fractions lesson...      ⋮  │
│ (max 10 shown)              │
├─────────────────────────────┤
│ ─────────── mt-auto ─────── │  ← Pushes rest to bottom
│ Profile                     │
│ Theme toggle                │
│ Sign Out                    │
└─────────────────────────────┘
```

### Collapsed Sidebar Behavior

When collapsed (icon-only mode):
- Logo becomes icon-only (Pelican icon)
- "New Chat" shows just `Plus` icon
- "My Prompts" shows just `Library` icon with tooltip
- Conversations section hidden entirely
- Footer items become icon-only with tooltips
- Width: 64px (w-16)

Expanded width: 256px (w-64)

### Mobile Menu Structure (aligned with sidebar)

```
┌─────────────────────────────┐
│ Menu                      X │
├─────────────────────────────┤
│ + New Chat                  │  ← Primary action (top)
├─────────────────────────────┤
│ NAVIGATION                  │
│ My Prompts (12)             │  ← Core feature prominent
├─────────────────────────────┤
│ RECENT SESSIONS             │
│ RL.5.3 Character...      ⋮  │
│ 8th Grade Math...        ⋮  │
├─────────────────────────────┤
│ Profile                     │
│ Sign Out                    │
├─────────────────────────────┤
│ [Theme Toggle]              │
└─────────────────────────────┘
```

## File Structure

### New Files to Create

```
src/components/layout/
├── AuthenticatedLayout.tsx    # Main layout wrapper
├── AppSidebar.tsx             # Desktop sidebar
├── SidebarHeader.tsx          # Logo + collapse toggle
├── SidebarNavItem.tsx         # Reusable nav item (icon, label, badge)
├── SidebarFooter.tsx          # Profile, theme, sign out
├── ConversationList.tsx       # Session list with kebab menus
├── MobileHeader.tsx           # Mobile-only header bar
└── index.ts                   # Exports

src/pages/
├── CoachPage.tsx              # Wraps ChatInterface, reads :conversationId
├── PromptsPage.tsx            # Wraps PromptLibrary
└── ProfilePage.tsx            # Wraps ProfileSettings

src/components/shared/
├── RenameSessionDialog.tsx    # Extracted from MobileMenu
└── DeleteSessionDialog.tsx    # Extracted from MobileMenu
```

### Files to Modify

```
src/App.tsx                    # New route structure with layout
src/components/navigation/
├── MobileMenu.tsx             # Reorder to match sidebar, use shared dialogs
└── types.ts                   # May need updates
```

### Files to Remove/Deprecate

```
src/components/coach/PromptCoach.tsx     # Logic moves to AuthenticatedLayout + CoachPage
src/components/routes/CoachRoute.tsx     # No longer needed (inline prompt instead)
src/components/navigation/AppHeader.tsx  # Replaced by MobileHeader
```

## Navigation Behavior

| Action | Result |
|--------|--------|
| Click logo | Navigate to `/coach` (welcome/new chat state) |
| Click "New Chat" | Create conversation, navigate to `/coach/:newId` |
| Click conversation | Navigate to `/coach/:id` |
| Click "My Prompts" | Navigate to `/prompts` |
| Delete active conversation | Navigate to `/coach`, clear selection |
| Deep link to invalid ID | Show "Conversation not found", offer to start new |

## State Management

| State | Source |
|-------|--------|
| Sidebar collapsed | `localStorage.getItem("sidebar-collapsed")` |
| Active conversation | `useParams().conversationId` |
| Active route | `useLocation().pathname` |
| Conversation list | Convex query (auto-updates) |
| Saved prompts count | Convex query (auto-updates) |

No React context needed. URL is the source of truth.

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| `< md` (768px) | Mobile header + hamburger menu, sidebar hidden |
| `≥ md` | Sidebar visible (collapsible), mobile header hidden |

## Edge Cases

### Loading States
- Layout shows skeleton while `conversations` query loads
- Each page handles its own loading state

### Error States
- Error boundary per-route (not whole layout)
- Conversation not found → friendly message + "Start new chat" button

### Empty States
- No conversations → "Start your first coaching session" message in sidebar
- No saved prompts → Empty state on `/prompts` page (existing)

### Profile Completion
- Show `InlineProfilePrompt` banner on coach page when profile incomplete
- No redirect blocking — profile not currently used in conversation

## Accessibility

- Sidebar collapse button: `aria-label="Collapse sidebar"` / `"Expand sidebar"`
- Collapsed icons: Tooltips for all items
- Keyboard navigation: Tab through sidebar items
- Focus management: After delete, focus returns to conversation list

## Animation Guidelines

Keep animations subtle and fast:
- Sidebar collapse: `transition-all duration-200`
- No staggered animations on conversation list
- Route transitions: Let React Router handle naturally

## Future Considerations (not in v1)

- **Keyboard shortcuts**: `Cmd+K` for quick search, `Cmd+N` for new chat
- **Session history**: `/coach/history` route with search/filter when users have many sessions
- **Shared prompts**: Team features, sharing URLs
- **Analytics dashboard**: Usage metrics for coaches/admins
