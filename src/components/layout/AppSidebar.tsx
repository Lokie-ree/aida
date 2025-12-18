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
      <SidebarHeader className="border-b border-border/60">
        <Link to="/coach" className="flex items-center gap-2 px-1 py-0.5">
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
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onNewChat} tooltip={collapsed ? "New Chat" : undefined}>
                  <Plus className="h-4 w-4" />
                  <span>New Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
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

        {/* Conversations List - hidden when collapsed */}
        {!collapsed && (
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
        )}
      </SidebarContent>

      {/* Footer: Profile, Theme, Sign Out */}
      <SidebarFooter className="border-t border-border/60">
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
            <AnimatedThemeToggler
              className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!"
            />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onSignOut}
              tooltip={collapsed ? "Sign Out" : undefined}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
