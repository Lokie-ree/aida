# Authenticated Layout with Sidebar - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a unified authenticated layout with a persistent sidebar for desktop and aligned mobile menu for all authenticated routes.

**Architecture:** AuthenticatedLayout wraps all authenticated routes, providing sidebar (desktop) and mobile header (mobile). Routes use URL params for state. Shared dialogs extracted for reuse.

**Tech Stack:** React 19, React Router v7, Convex, shadcn/ui sidebar components, Tailwind CSS v4, Lucide icons

---

## Task 1: Extract Shared Dialog Components

**Files:**
- Create: `src/components/shared/RenameSessionDialog.tsx`
- Create: `src/components/shared/DeleteSessionDialog.tsx`

**Step 1: Create RenameSessionDialog component**

```tsx
// src/components/shared/RenameSessionDialog.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RenameSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTitle: string;
  onRename: (newTitle: string) => void;
}

export function RenameSessionDialog({
  open,
  onOpenChange,
  currentTitle,
  onRename,
}: RenameSessionDialogProps) {
  const [value, setValue] = useState(currentTitle);

  useEffect(() => {
    if (open) {
      setValue(currentTitle);
    }
  }, [open, currentTitle]);

  const handleRename = () => {
    if (value.trim()) {
      onRename(value.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Rename Session</DialogTitle>
          <DialogDescription>
            Give this session a new name to help you find it later.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Session name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleRename();
              }
            }}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={!value.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 2: Create DeleteSessionDialog component**

```tsx
// src/components/shared/DeleteSessionDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionTitle: string;
  onDelete: () => void;
}

export function DeleteSessionDialog({
  open,
  onOpenChange,
  sessionTitle,
  onDelete,
}: DeleteSessionDialogProps) {
  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Session</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{sessionTitle}"? This action cannot be undone.
            Any saved prompts from this session will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Step 3: Verify files compile**

Run: `pnpm build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/shared/RenameSessionDialog.tsx src/components/shared/DeleteSessionDialog.tsx
git commit -m "feat: extract shared dialog components for session management"
```

---

## Task 2: Create SidebarNavItem Component

**Files:**
- Create: `src/components/layout/SidebarNavItem.tsx`

**Step 1: Create reusable nav item component**

```tsx
// src/components/layout/SidebarNavItem.tsx
import { Link, useLocation } from "react-router-dom";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
  collapsed?: boolean;
}

export function SidebarNavItem({
  icon: Icon,
  label,
  href,
  badge,
  collapsed,
}: SidebarNavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={collapsed ? label : undefined}
      >
        <Link to={href}>
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
      {badge !== undefined && badge > 0 && (
        <SidebarMenuBadge>{badge}</SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
}
```

**Step 2: Verify file compiles**

Run: `pnpm build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/layout/SidebarNavItem.tsx
git commit -m "feat: add SidebarNavItem component"
```

---

## Task 3: Create ConversationList Component

**Files:**
- Create: `src/components/layout/ConversationList.tsx`

**Step 1: Create conversation list with kebab menus**

```tsx
// src/components/layout/ConversationList.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RenameSessionDialog } from "@/components/shared/RenameSessionDialog";
import { DeleteSessionDialog } from "@/components/shared/DeleteSessionDialog";
import { Id } from "../../../convex/_generated/dataModel";

interface Conversation {
  _id: Id<"promptConversations">;
  title?: string;
  lastUpdated: number;
  messages?: Array<{ role: string; content: string }>;
}

interface ConversationListProps {
  conversations: Conversation[] | undefined;
  currentConversationId?: string;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  maxItems?: number;
}

export function ConversationList({
  conversations,
  currentConversationId,
  onRename,
  onDelete,
  maxItems = 10,
}: ConversationListProps) {
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; id: string; title: string }>({
    open: false,
    id: "",
    title: "",
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; title: string }>({
    open: false,
    id: "",
    title: "",
  });

  if (!conversations || conversations.length === 0) {
    return (
      <div className="px-2 py-4 text-center">
        <p className="text-xs text-muted-foreground">No conversations yet</p>
        <p className="text-xs text-muted-foreground mt-1">Start a new chat to begin</p>
      </div>
    );
  }

  const getTitle = (conv: Conversation) => {
    if (conv.title) return conv.title;
    const firstUserMessage = conv.messages?.find((m) => m.role === "user");
    if (firstUserMessage?.content) {
      return firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? "…" : "");
    }
    return "Untitled session";
  };

  const displayedConversations = conversations.slice(0, maxItems);

  return (
    <>
      <SidebarMenu>
        {displayedConversations.map((conv) => {
          const title = getTitle(conv);
          const isActive = currentConversationId === conv._id;
          const timeAgo = formatDistanceToNow(conv.lastUpdated, { addSuffix: true });

          return (
            <SidebarMenuItem key={conv._id}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className="pr-8"
              >
                <Link to={`/coach/${conv._id}`}>
                  <Clock className="h-4 w-4 shrink-0" />
                  <div className="flex flex-col items-start min-w-0 gap-0.5">
                    <span className="truncate w-full text-sm">{title}</span>
                    <span className="text-[10px] text-muted-foreground">{timeAgo}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Session options</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => setRenameDialog({ open: true, id: conv._id, title })}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteDialog({ open: true, id: conv._id, title })}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>

      <RenameSessionDialog
        open={renameDialog.open}
        onOpenChange={(open) => setRenameDialog((prev) => ({ ...prev, open }))}
        currentTitle={renameDialog.title}
        onRename={(newTitle) => onRename(renameDialog.id, newTitle)}
      />

      <DeleteSessionDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        sessionTitle={deleteDialog.title}
        onDelete={() => onDelete(deleteDialog.id)}
      />
    </>
  );
}
```

**Step 2: Verify file compiles**

Run: `pnpm build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/layout/ConversationList.tsx
git commit -m "feat: add ConversationList component with rename/delete"
```

---

## Task 4: Create AppSidebar Component

**Files:**
- Create: `src/components/layout/AppSidebar.tsx`

**Step 1: Create the main sidebar component**

```tsx
// src/components/layout/AppSidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { Plus, Library, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Logo, LogoIcon } from "@/components/shared/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarNavItem } from "./SidebarNavItem";
import { ConversationList } from "./ConversationList";
import { Id } from "../../../convex/_generated/dataModel";

interface Conversation {
  _id: Id<"promptConversations">;
  title?: string;
  lastUpdated: number;
  messages?: Array<{ role: string; content: string }>;
}

interface AppSidebarProps {
  conversations: Conversation[] | undefined;
  currentConversationId?: string;
  promptCount: number;
  onNewChat: () => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
  onSignOut: () => void;
}

export function AppSidebar({
  conversations,
  currentConversationId,
  promptCount,
  onNewChat,
  onRenameSession,
  onDeleteSession,
  onSignOut,
}: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      {/* Header: Logo */}
      <SidebarHeader className="border-b border-border">
        <Link to="/coach" className="flex items-center gap-2 px-2 py-1">
          {collapsed ? (
            <LogoIcon className="h-8 w-8" />
          ) : (
            <Logo />
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Primary Action: New Chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <Button
              onClick={onNewChat}
              className="w-full justify-start gap-2"
              size={collapsed ? "icon" : "default"}
            >
              <Plus className="h-4 w-4" />
              {!collapsed && <span>New Chat</span>}
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Core Navigation: My Prompts */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem
                icon={Library}
                label="My Prompts"
                href="/prompts"
                badge={promptCount}
                collapsed={collapsed}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Conversations List */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Recent Sessions</SidebarGroupLabel>
          <SidebarGroupContent>
            <ConversationList
              conversations={conversations}
              currentConversationId={currentConversationId}
              onRename={onRenameSession}
              onDelete={onDeleteSession}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: Profile, Theme, Sign Out */}
      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === "/profile"}
              tooltip={collapsed ? "Profile" : undefined}
            >
              <Link to="/profile">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={collapsed ? "Theme" : undefined}
              className="justify-start"
            >
              <AnimatedThemeToggler className="h-4 w-4" />
              {!collapsed && <span>Theme</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onSignOut}
              tooltip={collapsed ? "Sign Out" : undefined}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
```

**Step 2: Verify file compiles**

Run: `pnpm build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/layout/AppSidebar.tsx
git commit -m "feat: add AppSidebar component"
```

---

## Task 5: Create MobileHeader Component

**Files:**
- Create: `src/components/layout/MobileHeader.tsx`

**Step 1: Create mobile header with hamburger**

```tsx
// src/components/layout/MobileHeader.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";
import { MobileMenu } from "./MobileMenu";

interface Conversation {
  _id: string;
  title?: string;
  lastUpdated: number;
  messages?: Array<{ role: string; content: string }>;
}

interface MobileHeaderProps {
  conversations: Conversation[] | undefined;
  currentConversationId?: string;
  promptCount: number;
  onNewChat: () => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
  onSignOut: () => void;
}

export function MobileHeader({
  conversations,
  currentConversationId,
  promptCount,
  onNewChat,
  onRenameSession,
  onDeleteSession,
  onSignOut,
}: MobileHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background">
      <Link to="/coach">
        <Logo className="scale-90" />
      </Link>
      <MobileMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        promptCount={promptCount}
        onNewChat={() => {
          onNewChat();
          setMenuOpen(false);
        }}
        onRenameSession={onRenameSession}
        onDeleteSession={(id) => {
          onDeleteSession(id);
          setMenuOpen(false);
        }}
        onSignOut={onSignOut}
      />
    </header>
  );
}
```

**Step 2: Verify file compiles**

Run: `pnpm build`
Expected: Build succeeds (will have import error until MobileMenu is updated)

---

## Task 6: Update MobileMenu Component

**Files:**
- Modify: `src/components/layout/MobileMenu.tsx` (moved from navigation)

**Step 1: Create updated MobileMenu in layout folder**

```tsx
// src/components/layout/MobileMenu.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Clock, Plus, Library, User, LogOut, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { formatDistanceToNow } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RenameSessionDialog } from "@/components/shared/RenameSessionDialog";
import { DeleteSessionDialog } from "@/components/shared/DeleteSessionDialog";

interface Conversation {
  _id: string;
  title?: string;
  lastUpdated: number;
  messages?: Array<{ role: string; content: string }>;
}

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversations: Conversation[] | undefined;
  currentConversationId?: string;
  promptCount: number;
  onNewChat: () => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
  onSignOut: () => void;
}

const menuItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export function MobileMenu({
  open,
  onOpenChange,
  conversations,
  currentConversationId,
  promptCount,
  onNewChat,
  onRenameSession,
  onDeleteSession,
  onSignOut,
}: MobileMenuProps) {
  const location = useLocation();
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; id: string; title: string }>({
    open: false,
    id: "",
    title: "",
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; title: string }>({
    open: false,
    id: "",
    title: "",
  });

  const getTitle = (conv: Conversation) => {
    if (conv.title) return conv.title;
    const firstUserMessage = conv.messages?.find((m) => m.role === "user");
    if (firstUserMessage?.content) {
      return firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? "…" : "");
    }
    return "Untitled session";
  };

  const recentSessions = conversations?.slice(0, 5).map((conv) => ({
    id: conv._id,
    title: getTitle(conv),
    timeAgo: formatDistanceToNow(conv.lastUpdated, { addSuffix: true }),
    isActive: currentConversationId === conv._id,
  }));

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="sr-only">Toggle menu</span>
            </Button>
          </motion.div>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-[300px] sm:w-[320px] p-0 border-l border-border/50 bg-background/95 backdrop-blur-xl"
        >
          <SheetHeader className="p-6 pb-4 border-b border-border/50 bg-muted/30">
            <SheetTitle className="text-lg font-semibold tracking-tight text-foreground">
              Menu
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-[calc(100%-80px)]">
            <div className="flex-1 overflow-y-auto">
              {/* Primary Action: New Chat */}
              <div className="px-4 py-4">
                <motion.div custom={0} initial="hidden" animate="visible" variants={menuItemVariants}>
                  <Button onClick={onNewChat} className="w-full justify-start h-11 gap-2">
                    <Plus className="h-4 w-4" />
                    New Chat
                  </Button>
                </motion.div>
              </div>

              {/* Navigation */}
              <nav className="px-4 py-2 border-t border-border/50">
                <p className="px-3 mb-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Navigation
                </p>
                <motion.div custom={1} initial="hidden" animate="visible" variants={menuItemVariants}>
                  <Button
                    variant={location.pathname === "/prompts" ? "secondary" : "ghost"}
                    asChild
                    className="w-full justify-start h-11 px-3 rounded-xl"
                    onClick={() => onOpenChange(false)}
                  >
                    <Link to="/prompts">
                      <Library className="h-4 w-4 mr-3" />
                      <span>My Prompts</span>
                      {promptCount > 0 && (
                        <span className="ml-auto px-2 py-0.5 text-[10px] font-semibold rounded-full bg-muted">
                          {promptCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                </motion.div>
              </nav>

              {/* Recent Sessions */}
              {recentSessions && recentSessions.length > 0 && (
                <div className="px-4 py-4 border-t border-border/50">
                  <p className="px-3 mb-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Recent Sessions
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {recentSessions.map((session, index) => (
                      <motion.div
                        key={session.id}
                        custom={index + 2}
                        initial="hidden"
                        animate="visible"
                        variants={menuItemVariants}
                        className="flex items-stretch gap-1"
                      >
                        <Button
                          variant={session.isActive ? "secondary" : "ghost"}
                          asChild
                          className="flex-1 justify-start h-auto px-3 py-2.5 rounded-xl"
                          onClick={() => onOpenChange(false)}
                        >
                          <Link to={`/coach/${session.id}`}>
                            <Clock className="h-3.5 w-3.5 mr-3 shrink-0 text-muted-foreground" />
                            <div className="flex flex-col items-start min-w-0">
                              <span className="text-sm font-medium truncate w-full text-left">
                                {session.title}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {session.timeAgo}
                              </span>
                            </div>
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-auto w-9 shrink-0 rounded-xl hover:bg-accent/50"
                            >
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              <span className="sr-only">Session options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() =>
                                setRenameDialog({ open: true, id: session.id, title: session.title })
                              }
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setDeleteDialog({ open: true, id: session.id, title: session.title })
                              }
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Account Actions */}
              <div className="px-4 py-4 border-t border-border/50">
                <div className="flex flex-col gap-1.5">
                  <motion.div custom={7} initial="hidden" animate="visible" variants={menuItemVariants}>
                    <Button
                      variant={location.pathname === "/profile" ? "secondary" : "ghost"}
                      asChild
                      className="w-full justify-start h-11 px-3 rounded-xl"
                      onClick={() => onOpenChange(false)}
                    >
                      <Link to="/profile">
                        <User className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span>Profile</span>
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div custom={8} initial="hidden" animate="visible" variants={menuItemVariants}>
                    <Button
                      variant="ghost"
                      onClick={onSignOut}
                      className="w-full justify-start h-11 px-3 rounded-xl"
                    >
                      <LogOut className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span>Sign Out</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="px-4 py-4 border-t border-border/50 bg-muted/30"
            >
              <div className="flex items-center justify-center">
                <AnimatedThemeToggler className="h-9 w-9 p-2 rounded-lg hover:bg-accent transition-colors" />
              </div>
            </motion.div>
          </div>
        </SheetContent>
      </Sheet>

      <RenameSessionDialog
        open={renameDialog.open}
        onOpenChange={(open) => setRenameDialog((prev) => ({ ...prev, open }))}
        currentTitle={renameDialog.title}
        onRename={(newTitle) => onRenameSession(renameDialog.id, newTitle)}
      />

      <DeleteSessionDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        sessionTitle={deleteDialog.title}
        onDelete={() => onDeleteSession(deleteDialog.id)}
      />
    </>
  );
}
```

**Step 2: Verify file compiles**

Run: `pnpm build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/layout/MobileMenu.tsx src/components/layout/MobileHeader.tsx
git commit -m "feat: add MobileHeader and updated MobileMenu components"
```

---

## Task 7: Create AuthenticatedLayout Component

**Files:**
- Create: `src/components/layout/AuthenticatedLayout.tsx`

**Step 1: Create the main layout wrapper**

```tsx
// src/components/layout/AuthenticatedLayout.tsx
import { useCallback } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { MobileHeader } from "./MobileHeader";
import { Id } from "../../../convex/_generated/dataModel";

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId: string }>();

  // Data fetching
  const conversations = useQuery(api.promptCoach.listConversations);
  const savedPrompts = useQuery(api.promptCoach.getSavedPrompts);

  // Mutations
  const startConversation = useMutation(api.promptCoach.startConversation);
  const renameConversation = useMutation(api.promptCoach.renameConversation);
  const deleteConversation = useMutation(api.promptCoach.deleteConversation);

  // Handlers
  const handleNewChat = useCallback(async () => {
    const newId = await startConversation({ title: "New Coaching Session" });
    navigate(`/coach/${newId}`);
  }, [startConversation, navigate]);

  const handleRenameSession = useCallback(
    async (id: string, newTitle: string) => {
      try {
        await renameConversation({
          conversationId: id as Id<"promptConversations">,
          title: newTitle,
        });
      } catch (error) {
        console.error("Failed to rename session:", error);
      }
    },
    [renameConversation]
  );

  const handleDeleteSession = useCallback(
    async (id: string) => {
      try {
        // If deleting current conversation, navigate away first
        if (conversationId === id) {
          navigate("/coach");
        }
        await deleteConversation({
          conversationId: id as Id<"promptConversations">,
        });
      } catch (error) {
        console.error("Failed to delete session:", error);
      }
    },
    [deleteConversation, conversationId, navigate]
  );

  const handleSignOut = useCallback(async () => {
    await authClient.signOut();
    navigate("/");
  }, [navigate]);

  const promptCount = savedPrompts?.length ?? 0;

  // Get default sidebar state from localStorage
  const defaultOpen = typeof window !== "undefined"
    ? localStorage.getItem("sidebar_state") !== "false"
    : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        conversations={conversations}
        currentConversationId={conversationId}
        promptCount={promptCount}
        onNewChat={handleNewChat}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
        onSignOut={handleSignOut}
      />
      <SidebarInset className="flex flex-col h-dvh">
        <MobileHeader
          conversations={conversations}
          currentConversationId={conversationId}
          promptCount={promptCount}
          onNewChat={handleNewChat}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 min-h-0 overflow-hidden">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

**Step 2: Create layout index file**

```tsx
// src/components/layout/index.ts
export { AuthenticatedLayout } from "./AuthenticatedLayout";
export { AppSidebar } from "./AppSidebar";
export { MobileHeader } from "./MobileHeader";
export { MobileMenu } from "./MobileMenu";
export { SidebarNavItem } from "./SidebarNavItem";
export { ConversationList } from "./ConversationList";
```

**Step 3: Verify files compile**

Run: `pnpm build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/layout/AuthenticatedLayout.tsx src/components/layout/index.ts
git commit -m "feat: add AuthenticatedLayout component"
```

---

## Task 8: Create Page Components

**Files:**
- Create: `src/pages/CoachPage.tsx`
- Create: `src/pages/PromptsPage.tsx`
- Create: `src/pages/ProfilePage.tsx`
- Create: `src/pages/index.ts`

**Step 1: Create CoachPage**

```tsx
// src/pages/CoachPage.tsx
import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChatInterface } from "@/components/coach/ChatInterface";
import { InlineProfilePrompt } from "@/components/coach/InlineProfilePrompt";
import { Metadata } from "@/components/shared/Metadata";
import { Id } from "../../convex/_generated/dataModel";
import { spacing } from "@/lib/spacing";

export function CoachPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();

  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const startConversation = useMutation(api.promptCoach.startConversation);

  const handleStartNew = useCallback(async () => {
    const newId = await startConversation({ title: "New Coaching Session" });
    navigate(`/coach/${newId}`);
  }, [startConversation, navigate]);

  const handleSelectConversation = useCallback(
    (id: Id<"promptConversations">) => {
      navigate(`/coach/${id}`);
    },
    [navigate]
  );

  const typedConversationId = conversationId
    ? (conversationId as Id<"promptConversations">)
    : null;

  return (
    <div className="h-full flex flex-col">
      <Metadata
        title="Prompt Coach - Pelican AI"
        description="Get personalized AI coaching to generate Louisiana-aligned prompts for your lessons."
        url="/coach"
        noindex={true}
      />

      <div className={`${spacing.chartContainer} w-full flex-1 min-h-0 flex flex-col ${spacing.container} py-4`}>
        {/* Inline Profile Prompt - shows when profile is incomplete */}
        {userProfile && (!userProfile.gradeLevel || !userProfile.subject) && (
          <InlineProfilePrompt />
        )}

        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatInterface
            conversationId={typedConversationId}
            onStartNew={handleStartNew}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create PromptsPage**

```tsx
// src/pages/PromptsPage.tsx
import { useNavigate } from "react-router-dom";
import { PromptLibrary } from "@/components/coach/PromptLibrary";
import { Metadata } from "@/components/shared/Metadata";
import { spacing } from "@/lib/spacing";

export function PromptsPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col">
      <Metadata
        title="My Prompts - Pelican AI"
        description="View and manage your saved Louisiana-aligned prompts."
        url="/prompts"
        noindex={true}
      />

      <div className={`${spacing.chartContainer} w-full flex-1 min-h-0 flex flex-col ${spacing.container} py-4`}>
        {/* Page Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground">My Prompts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your saved Louisiana-aligned prompts
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <PromptLibrary
            onSelectPrompt={(prompt) => {
              if (!prompt) {
                navigate("/coach");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Create ProfilePage**

```tsx
// src/pages/ProfilePage.tsx
import ProfileSettings from "@/components/dashboard/ProfileSettings";

export function ProfilePage() {
  return <ProfileSettings />;
}
```

**Step 4: Create index file**

```tsx
// src/pages/index.ts
export { CoachPage } from "./CoachPage";
export { PromptsPage } from "./PromptsPage";
export { ProfilePage } from "./ProfilePage";
```

**Step 5: Verify files compile**

Run: `pnpm build`
Expected: Build succeeds

**Step 6: Commit**

```bash
git add src/pages/
git commit -m "feat: add page components for CoachPage, PromptsPage, ProfilePage"
```

---

## Task 9: Update App.tsx Routes

**Files:**
- Modify: `src/App.tsx`

**Step 1: Update route structure**

```tsx
// src/App.tsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { LoadingPage } from "./components/shared/LoadingStates";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { AuthenticatedLayout } from "./components/layout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Lazy load route components
const LandingPage = lazy(() => import("./components/shared/LandingPage"));
const CoachPage = lazy(() =>
  import("./pages").then((m) => ({ default: m.CoachPage }))
);
const PromptsPage = lazy(() =>
  import("./pages").then((m) => ({ default: m.PromptsPage }))
);
const ProfilePage = lazy(() =>
  import("./pages").then((m) => ({ default: m.ProfilePage }))
);

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Authenticated>
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route
                  element={
                    <ProtectedRoute>
                      <AuthenticatedLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/coach" element={<CoachPage />} />
                  <Route path="/coach/:conversationId" element={<CoachPage />} />
                  <Route path="/prompts" element={<PromptsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
                {/* Redirect all other routes to coach */}
                <Route path="*" element={<Navigate to="/coach" replace />} />
              </Routes>
            </Suspense>
          </Authenticated>

          <Unauthenticated>
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route path="/*" element={<LandingPage />} />
              </Routes>
            </Suspense>
          </Unauthenticated>

          <Toaster position="top-right" />
        </BrowserRouter>
      </ThemeProvider>
      <Analytics />
      <SpeedInsights />
    </ErrorBoundary>
  );
}
```

**Step 2: Verify app compiles and routes work**

Run: `pnpm build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: update routes to use AuthenticatedLayout"
```

---

## Task 10: Test and Fix Integration Issues

**Step 1: Run dev server**

Run: `pnpm dev`

**Step 2: Test all routes**

Manual testing checklist:
- [ ] `/coach` - Shows welcome state, new chat works
- [ ] `/coach/:id` - Shows conversation, messages work
- [ ] `/prompts` - Shows prompt library
- [ ] `/profile` - Shows profile settings
- [ ] Sidebar collapse/expand works
- [ ] Mobile menu works
- [ ] Rename/delete sessions work
- [ ] Theme toggle works
- [ ] Sign out works
- [ ] Navigation between routes preserves sidebar state

**Step 3: Fix any issues found**

(Issues will be addressed as discovered during testing)

**Step 4: Run build to verify no errors**

Run: `pnpm build`
Expected: Build succeeds

**Step 5: Commit fixes**

```bash
git add -A
git commit -m "fix: resolve integration issues from layout migration"
```

---

## Task 11: Clean Up Deprecated Files

**Files:**
- Delete: `src/components/coach/PromptCoach.tsx`
- Delete: `src/components/routes/CoachRoute.tsx`
- Delete: `src/components/navigation/AppHeader.tsx`
- Modify: `src/components/navigation/index.ts` (update exports)

**Step 1: Remove deprecated files**

```bash
rm src/components/coach/PromptCoach.tsx
rm src/components/routes/CoachRoute.tsx
rm src/components/navigation/AppHeader.tsx
```

**Step 2: Update navigation exports**

```tsx
// src/components/navigation/index.ts
export type { NavItem, NavAction, RecentSession, NavConfig } from "./types";
export { DesktopNav } from "./DesktopNav";
export { DesktopActions } from "./DesktopActions";
// Removed: AppHeader, MobileMenu (moved to layout)
```

**Step 3: Verify build still works**

Run: `pnpm build`
Expected: Build succeeds

**Step 4: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove deprecated navigation components"
```

---

## Task 12: Final Verification and Documentation

**Step 1: Run full test suite**

Run: `pnpm lint && pnpm build`
Expected: All checks pass

**Step 2: Test E2E manually**

- Complete user flow: sign in → coach → create session → save prompt → view in library → profile → sign out

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete authenticated layout with sidebar implementation

- Add desktop sidebar with collapsible state
- Add unified mobile header with aligned menu
- Convert My Prompts to real route /prompts
- Use nested routes /coach/:conversationId
- Extract shared dialogs for rename/delete
- Clean up deprecated components

🤖 Generated with Claude Code"
```

---

## Summary

**Files Created:**
- `src/components/shared/RenameSessionDialog.tsx`
- `src/components/shared/DeleteSessionDialog.tsx`
- `src/components/layout/SidebarNavItem.tsx`
- `src/components/layout/ConversationList.tsx`
- `src/components/layout/AppSidebar.tsx`
- `src/components/layout/MobileHeader.tsx`
- `src/components/layout/MobileMenu.tsx`
- `src/components/layout/AuthenticatedLayout.tsx`
- `src/components/layout/index.ts`
- `src/pages/CoachPage.tsx`
- `src/pages/PromptsPage.tsx`
- `src/pages/ProfilePage.tsx`
- `src/pages/index.ts`

**Files Modified:**
- `src/App.tsx`
- `src/components/navigation/index.ts`

**Files Deleted:**
- `src/components/coach/PromptCoach.tsx`
- `src/components/routes/CoachRoute.tsx`
- `src/components/navigation/AppHeader.tsx`
