import React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BetaTesterBadgeProps {
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export function BetaTesterBadge({ 
  size = "md", 
  showTooltip = false,
  className 
}: BetaTesterBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5",
  };

  return (
    <Badge 
      className={cn(
        "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 border-yellow-300 font-semibold shadow-sm hover:shadow-md transition-all duration-200",
        sizeClasses[size],
        className
      )}
      variant="outline"
    >
      <Sparkles className={cn("mr-1.5", iconSizes[size])} />
      Beta Tester
    </Badge>
  );
}