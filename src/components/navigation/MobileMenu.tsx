import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Clock, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { NavItem, NavAction, RecentSession } from "./types";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navItems?: NavItem[];
  actions?: NavAction[];
  showThemeToggle?: boolean;
  recentSessions?: RecentSession[];
  onSelectSession?: (id: string) => void;
  onRenameSession?: (id: string, newTitle: string) => void;
  onDeleteSession?: (id: string) => void;
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
  navItems,
  actions,
  showThemeToggle = true,
  recentSessions,
  onSelectSession,
  onRenameSession,
  onDeleteSession,
}: MobileMenuProps) {
  // Rename dialog state
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameSessionId, setRenameSessionId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [deleteSessionTitle, setDeleteSessionTitle] = useState("");

  const handleAction = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  const handleSelectSession = (id: string) => {
    onSelectSession?.(id);
    onOpenChange(false);
  };

  const openRenameDialog = (session: RecentSession) => {
    setRenameSessionId(session.id);
    setRenameValue(session.title);
    setRenameDialogOpen(true);
  };

  const handleRename = () => {
    if (renameSessionId && renameValue.trim()) {
      onRenameSession?.(renameSessionId, renameValue.trim());
      setRenameDialogOpen(false);
      setRenameSessionId(null);
      setRenameValue("");
    }
  };

  const openDeleteDialog = (session: RecentSession) => {
    setDeleteSessionId(session.id);
    setDeleteSessionTitle(session.title);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteSessionId) {
      onDeleteSession?.(deleteSessionId);
      setDeleteDialogOpen(false);
      setDeleteSessionId(null);
      setDeleteSessionTitle("");
      onOpenChange(false);
    }
  };

  const hasNavItems = navItems && navItems.length > 0;
  const hasActions = actions && actions.length > 0;
  const hasRecentSessions = recentSessions && recentSessions.length > 0;
  const hasSessionManagement = onRenameSession || onDeleteSession;

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 rounded-full"
          >
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
            {/* Navigation Section */}
            {hasNavItems && (
              <nav className="px-4 py-5">
                <p className="px-3 mb-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Navigation
                </p>
                <div className="flex flex-col gap-1.5">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = item.active;

                    return (
                      <motion.div
                        key={index}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={menuItemVariants}
                      >
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          onClick={() => item.onClick && handleAction(item.onClick)}
                          className={`
                            w-full justify-start h-11 px-3 rounded-xl
                            transition-all duration-200
                            ${isActive
                              ? "bg-primary/10 text-primary font-medium shadow-sm border border-primary/20"
                              : "hover:bg-accent/50"
                            }
                          `}
                        >
                          {Icon && (
                            <Icon
                              className={`h-4 w-4 mr-3 transition-colors ${
                                isActive ? "text-primary" : "text-muted-foreground"
                              }`}
                            />
                          )}
                          <span className="text-sm font-medium tracking-tight">{item.label}</span>
                          {item.badge !== undefined && item.badge !== null && (
                            <span className={`ml-auto px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                              isActive
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>
            )}

            {/* Recent Sessions Section */}
            {hasRecentSessions && (
              <div className="px-4 py-4 border-t border-border/50">
                <p className="px-3 mb-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Recent Sessions
                </p>
                <div className="flex flex-col gap-1.5">
                  {recentSessions.slice(0, 5).map((session, index) => {
                    const itemIndex = (navItems?.length || 0) + index;

                    return (
                      <motion.div
                        key={session.id}
                        custom={itemIndex}
                        initial="hidden"
                        animate="visible"
                        variants={menuItemVariants}
                        className="flex items-stretch gap-1"
                      >
                        <Button
                          variant={session.isActive ? "secondary" : "ghost"}
                          onClick={() => handleSelectSession(session.id)}
                          className={`
                            flex-1 justify-start h-auto px-3 py-2.5 rounded-xl
                            transition-all duration-200
                            ${session.isActive
                              ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                              : "hover:bg-accent/50"
                            }
                          `}
                        >
                          <Clock
                            className={`h-3.5 w-3.5 mr-3 shrink-0 transition-colors ${
                              session.isActive ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                          <div className="flex flex-col items-start min-w-0">
                            <span className="text-sm font-medium tracking-tight truncate w-full text-left">
                              {session.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {session.timeAgo}
                            </span>
                          </div>
                        </Button>
                        {hasSessionManagement && (
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
                              {onRenameSession && (
                                <DropdownMenuItem onClick={() => openRenameDialog(session)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Rename
                                </DropdownMenuItem>
                              )}
                              {onDeleteSession && (
                                <DropdownMenuItem
                                  onClick={() => openDeleteDialog(session)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions Section */}
            {hasActions && (
              <div className="px-4 py-4 border-t border-border/50">
                <div className="flex flex-col gap-1.5">
                  {actions.map((action, index) => {
                    const Icon = action.icon;
                    const isDestructive = action.variant === "destructive";
                    const itemIndex = (navItems?.length || 0) + (recentSessions?.length || 0) + index;

                    return (
                      <motion.div
                        key={index}
                        custom={itemIndex}
                        initial="hidden"
                        animate="visible"
                        variants={menuItemVariants}
                      >
                        <Button
                          variant="ghost"
                          onClick={() => handleAction(action.onClick)}
                          className={`
                            w-full justify-start h-11 px-3 rounded-xl
                            transition-all duration-200
                            hover:bg-accent/50
                            ${isDestructive
                              ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                              : ""
                            }
                          `}
                        >
                          <Icon
                            className={`h-4 w-4 mr-3 transition-colors ${
                              isDestructive ? "text-destructive" : "text-muted-foreground"
                            }`}
                          />
                          <span className="text-sm font-medium tracking-tight">{action.label}</span>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Theme Toggle */}
          {showThemeToggle && (
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
          )}
        </div>
      </SheetContent>
    </Sheet>

    {/* Rename Dialog */}
    <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Rename Session</DialogTitle>
          <DialogDescription>
            Give this session a new name to help you find it later.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
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
          <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={!renameValue.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Session</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{deleteSessionTitle}"? This action cannot be undone.
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
    </>
  );
}
