# A.I.D.A. Dashboard Wireframes

## Desktop Layout (1440px+)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                          │
│ ┌─────────────┐ ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│ │ A.I.D.A.    │ │ [District-wide Coach ▼]     │ │ [User Menu ▼]              │ │
│ │ (brand)     │ │ (active space)              │ │ (profile/settings)         │ │
│ └─────────────┘ └─────────────────────────────┘ └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ MAIN CONTENT AREA                                                               │
│ ┌─────────────────────────────┐ ┌─────────────────────────────────────────────┐ │
│ │ VOICE HUB (1/3)             │ │ CONVERSATION (2/3)                          │ │
│ │ ┌─────────────────────────┐ │ │ ┌─────────────────────────────────────────┐ │ │
│ │ │ 🎤 Voice Interface      │ │ │ │ 💬 Ask A.I.D.A. anything...             │ │ │
│ │ │ [Large Voice Button]    │ │ │ │                                         │ │ │
│ │ │                         │ │ │ │ [Message History]                       │ │ │
│ │ │ Status: Ready           │ │ │ │                                         │ │ │
│ │ │ Sources: 3 docs         │ │ │ │ [Input Field] [Send]                    │ │ │
│ │ └─────────────────────────┘ │ │ └─────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────┐ │ │                                             │ │
│ │ │ Quick Actions           │ │ │                                             │ │
│ │ │ [Upload Doc] [Invite]   │ │ │                                             │ │
│ │ │ [Create Space]          │ │ │                                             │ │
│ │ └─────────────────────────┘ │ │                                             │ │
│ └─────────────────────────────┘ └─────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ CONTEXT TRAY (full width, collapsible)                                         │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ [Documents] [Sources] [Activity] │ [▼ Collapse]                            │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Document List | Source Citations | Recent Activity                     │ │ │
│ │ │ • Policy.pdf  | 1. District Policy | • Asked about attendance          │ │ │
│ │ │ • Handbook.md | 2. Student Handbook| • Uploaded new doc                 │ │ │
│ │ │ • Guide.pdf   | 3. LDOE Guidelines | • Created new space               │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Mobile Layout (768px and below)

```
┌─────────────────────────────────┐
│ HEADER                          │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ A.I.D.A.    │ │ [Menu ☰]    │ │
│ └─────────────┘ └─────────────┘ │
├─────────────────────────────────┤
│ VOICE HUB (full width)          │
│ ┌─────────────────────────────┐ │
│ │ 🎤 Voice Interface          │ │
│ │ [Large Voice Button]        │ │
│ │ Status: Ready | Sources: 3  │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ CONVERSATION (full width)       │
│ ┌─────────────────────────────┐ │
│ │ 💬 Ask A.I.D.A. anything... │ │
│ │ [Message History]           │ │
│ │ [Input Field] [Send]        │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ CONTEXT TRAY (collapsed)        │
│ [Documents] [Sources] [Activity]│
│ [▼ Expand]                      │
└─────────────────────────────────┘
```

## Empty States

### First-time user (no spaces)
```
┌─────────────────────────────────┐
│ VOICE HUB                       │
│ ┌─────────────────────────────┐ │
│ │ 🎤 Voice Interface          │ │
│ │ [Create Your First Space]   │ │
│ │ to get started              │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### No conversation yet
```
┌─────────────────────────────────┐
│ CONVERSATION                    │
│ ┌─────────────────────────────┐ │
│ │ Welcome to A.I.D.A.         │ │
│ │ Ask me anything about       │ │
│ │ your district policies      │ │
│ │                             │ │
│ │ [Start Voice Chat]          │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## Component Hierarchy

### VoiceHub (enhanced VoiceInterface)
- Voice button (primary CTA)
- Status indicators (ready/listening/speaking/error)
- Source count badge
- Quick actions (upload, invite, create space)

### Conversation (enhanced ConversationPane)
- Message history (scrollable)
- Input field with send button
- Typing indicators
- Message actions (copy, share, cite)

### ContextTray (new component)
- Tab navigation (Documents/Sources/Activity)
- Collapsible panel
- Document list with actions
- Source citations with links
- Activity feed with timestamps

### Header (enhanced)
- Brand logo/title
- Space selector dropdown
- User menu (profile, settings, sign out)
