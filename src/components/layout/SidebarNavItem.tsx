import { Link, useLocation } from "react-router-dom";
import { type LucideIcon } from "lucide-react";
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
