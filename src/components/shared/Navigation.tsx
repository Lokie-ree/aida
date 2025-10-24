import React from "react";
import { useQuery } from "convex/react";
import { NavLink, useNavigate } from "react-router-dom";
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
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const isAdmin = useQuery(api.admin.checkIsAdmin);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const navigationItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview and quick start"
    },
    {
      path: "/frameworks",
      label: "Framework Library",
      icon: BookOpen,
      description: "Browse AI guidance frameworks"
    },
    {
      path: "/community",
      label: "Community",
      icon: Users,
      description: "Innovations and testimonials"
    },
    {
      path: "/time-tracking",
      label: "Time Tracking",
      icon: Clock,
      description: "Track your productivity gains"
    },
    {
      path: "/profile",
      label: "Profile",
      icon: User,
      description: "Settings and preferences"
    }
  ];

  // Admin-only navigation items
  const adminItems = [
    {
      path: "/admin",
      label: "Admin",
      icon: Shield,
      description: "Manage platform and content",
      isAdmin: true
    }
  ];

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
                      "flex items-center gap-2 h-9 px-3",
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
                      "flex items-center gap-2 h-9 px-3 border-l ml-2 pl-4",
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