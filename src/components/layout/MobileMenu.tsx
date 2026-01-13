import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Clock, Plus, Library, User, LogOut, MoreVertical, Pencil, Trash2, Sun } from "lucide-react";
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
          className="w-full sm:w-[320px] p-0 border-l border-border/50 bg-background/95 backdrop-blur-xl"
        >
          <SheetHeader className="p-6 pb-4 border-b border-border/50 bg-muted/30">
            <SheetTitle className="text-lg font-semibold tracking-tight text-foreground">
              Menu
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-[calc(100%-80px)]">
            <div className="flex-1 overflow-y-auto py-2">
              {/* Primary Action: New Chat */}
              <div className="px-3 pb-3">
                <motion.div custom={0} initial="hidden" animate="visible" variants={menuItemVariants}>
                  <Button onClick={onNewChat} className="w-full justify-start h-10 gap-2.5 rounded-lg">
                    <Plus className="h-4 w-4" />
                    New Chat
                  </Button>
                </motion.div>
              </div>

              {/* Navigation */}
              <nav className="px-3 py-3 border-t border-border/40">
                <p className="px-2 mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Navigation
                </p>
                <motion.div custom={1} initial="hidden" animate="visible" variants={menuItemVariants}>
                  <Button
                    variant={location.pathname === "/prompts" ? "secondary" : "ghost"}
                    asChild
                    className="w-full justify-start h-10 px-2.5 rounded-lg"
                    onClick={() => onOpenChange(false)}
                  >
                    <Link to="/prompts">
                      <Library className="h-4 w-4 mr-2.5" />
                      <span>My Prompts</span>
                      {promptCount > 0 && (
                        <span className="ml-auto px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted">
                          {promptCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                </motion.div>
              </nav>

              {/* Recent Sessions */}
              {recentSessions && recentSessions.length > 0 && (
                <div className="px-3 py-3 border-t border-border/40">
                  <p className="px-2 mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Recent Sessions
                  </p>
                  <div className="flex flex-col gap-1">
                    {recentSessions.map((session, index) => (
                      <motion.div
                        key={session.id}
                        custom={index + 2}
                        initial="hidden"
                        animate="visible"
                        variants={menuItemVariants}
                        className="flex items-center gap-0.5"
                      >
                        <Button
                          variant={session.isActive ? "secondary" : "ghost"}
                          asChild
                          className="flex-1 justify-start h-auto min-h-10 px-2.5 py-2 rounded-lg"
                          onClick={() => onOpenChange(false)}
                          title={session.title}
                        >
                          <Link to={`/coach/${session.id}`}>
                            <Clock className="h-4 w-4 mr-2.5 shrink-0 text-muted-foreground" />
                            <div className="flex flex-col items-start min-w-0 gap-0.5">
                              <span className="text-sm truncate w-full text-left">
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
                              className="h-9 w-9 shrink-0 rounded-lg touch-manipulation"
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

              {/* Account Section */}
              <div className="px-3 py-3 border-t border-border/40">
                <p className="px-2 mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Account
                </p>
                <div className="flex flex-col gap-1">
                  <motion.div custom={7} initial="hidden" animate="visible" variants={menuItemVariants}>
                    <Button
                      variant={location.pathname === "/profile" ? "secondary" : "ghost"}
                      asChild
                      className="w-full justify-start h-10 px-2.5 rounded-lg"
                      onClick={() => onOpenChange(false)}
                    >
                      <Link to="/profile">
                        <User className="h-4 w-4 mr-2.5 text-muted-foreground" />
                        <span>Profile</span>
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div custom={8} initial="hidden" animate="visible" variants={menuItemVariants}>
                    <div className="flex items-center justify-between px-2.5 h-10 rounded-lg hover:bg-accent/50 transition-colors">
                      <span className="text-sm flex items-center gap-2.5">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        Theme
                      </span>
                      <AnimatedThemeToggler className="h-8 w-8 p-1.5 rounded-md" />
                    </div>
                  </motion.div>
                  <motion.div custom={9} initial="hidden" animate="visible" variants={menuItemVariants}>
                    <Button
                      variant="ghost"
                      onClick={onSignOut}
                      className="w-full justify-start h-10 px-2.5 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4 mr-2.5" />
                      <span>Sign Out</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
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
