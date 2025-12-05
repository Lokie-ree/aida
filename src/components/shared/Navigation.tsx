import React from "react";
import { useQuery } from "convex/react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  User,
  Menu,
  X,
  Clock,
  Shield,
  FileCheck,
  MessageSquare,
  PlusCircle,
  Library
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
  onCoachAction?: (action: 'newSession' | 'viewLibrary') => void;
}

export function Navigation({ className, onCoachAction }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const isOnCoachRoute = location.pathname === '/coach';

  const navigationItems = [
    {
      path: "/coach",
      label: "Coach",
      icon: MessageSquare,
      description: "Louisiana-aligned prompt coaching"
    },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview and quick start"
    },
    {
      path: "/profile",
      label: "Profile",
      icon: User,
      description: "Settings and preferences"
    }
  ];

  // Post-beta features removed for December 2025 launch:
  // - Frameworks library
  // - Alignment scorecard
  // - Time tracking
  // - Admin dashboard
  // See git history to restore

  const adminItems: any[] = [];

  return (
    <>
      {/* Desktop Navigation */}
      <NavigationMenu className={cn("hidden md:flex", className)}>
        <NavigationMenuList>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavigationMenuItem key={item.path}>
                <NavigationMenuLink asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center gap-2 min-h-[44px] h-11 px-3", // Changed from h-9 to h-11 for WCAG AA compliance
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : ""
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
          
          {/* Admin Navigation - Only show for admin users */}
          {isAdmin && adminItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavigationMenuItem key={item.path}>
                <NavigationMenuLink asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center gap-2 min-h-[44px] h-11 px-3 border-l ml-2 pl-4", // Changed from h-9 to h-11 for WCAG AA compliance
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : ""
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation-menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
          <span>Menu</span>
        </Button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div 
              className="fixed top-16 left-0 right-0 bg-background border-b shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
              id="mobile-navigation-menu"
              role="menu"
              aria-label="Navigation menu"
            >
              <div className="p-4 space-y-1">
                {/* Coach Route Quick Actions */}
                {isOnCoachRoute && onCoachAction && (
                  <>
                    <div className="px-3 py-1">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Quick Actions
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onCoachAction('newSession');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 h-12 w-full rounded-md px-3 text-left transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
                      role="menuitem"
                    >
                      <PlusCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">New Coaching Session</div>
                        <div className="text-xs text-muted-foreground truncate">
                          Start a fresh conversation
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        onCoachAction('viewLibrary');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 h-12 w-full rounded-md px-3 text-left transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
                      role="menuitem"
                    >
                      <Library className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">View My Prompts</div>
                        <div className="text-xs text-muted-foreground truncate">
                          Browse saved prompts
                        </div>
                      </div>
                    </button>
                    <div className="border-t border-border my-2" />
                  </>
                )}

                {/* Main Navigation Items */}
                {navigationItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 h-12 w-full rounded-md px-3 text-left transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                      role="menuitem"
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{item.label}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </div>
                      </div>
                    </NavLink>
                  );
                })}
                
                {/* Admin Mobile Navigation */}
                {isAdmin && (
                  <>
                    <div className="border-t border-border my-2" />
                    <div className="px-3 py-1">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Administration
                      </div>
                    </div>
                    {adminItems.map((item) => {
                      const Icon = item.icon;
                      
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) => cn(
                            "flex items-center gap-3 h-12 w-full rounded-md px-3 text-left transition-colors",
                            isActive 
                              ? "bg-primary text-primary-foreground" 
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                          role="menuitem"
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{item.label}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </div>
                          </div>
                        </NavLink>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}