import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
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
  currentView: "dashboard" | "frameworks" | "community" | "profile" | "admin" | "time-tracking";
  onViewChange: (view: "dashboard" | "frameworks" | "community" | "profile" | "admin" | "time-tracking") => void;
  className?: string;
}

export function Navigation({ currentView, onViewChange, className }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isAdmin = useQuery(api.admin.checkIsAdmin);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const navigationItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview and quick start"
    },
    {
      id: "frameworks" as const,
      label: "Framework Library",
      icon: BookOpen,
      description: "Browse AI guidance frameworks"
    },
    {
      id: "community" as const,
      label: "Community",
      icon: Users,
      description: "Innovations and testimonials"
    },
    {
      id: "time-tracking" as const,
      label: "Time Tracking",
      icon: Clock,
      description: "Track your productivity gains"
    },
    {
      id: "profile" as const,
      label: "Profile",
      icon: User,
      description: "Settings and preferences"
    }
  ];

  // Admin-only navigation items
  const adminItems = [
    {
      id: "admin" as const,
      label: "Admin",
      icon: Shield,
      description: "Manage platform and content",
      isAdmin: true
    }
  ];

  return (
    <>
      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 bg-yellow-100 border border-yellow-300 rounded p-2 text-xs z-50">
          <div>Email: {loggedInUser?.email || 'Not logged in'}</div>
          <div>Admin: {isAdmin ? 'Yes' : 'No'}</div>
        </div>
      )}
      
      {/* Desktop Navigation */}
      <nav className={cn("hidden md:flex items-center gap-1", className)}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex items-center gap-2 h-9 px-3",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          );
        })}
        
        {/* Admin Navigation - Only show for admin users */}
        {isAdmin && adminItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex items-center gap-2 h-9 px-3 border-l ml-2 pl-4",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2"
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
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed top-16 left-0 right-0 bg-background border-b shadow-lg">
              <div className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      size="lg"
                      onClick={() => {
                        onViewChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full justify-start gap-3 h-12",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
                
                {/* Admin Mobile Navigation */}
                {isAdmin && adminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      size="lg"
                      onClick={() => {
                        onViewChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full justify-start gap-3 h-12 border-t pt-4 mt-4",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
