import React from "react";
import { cn } from "@/lib/utils";

interface ButtonGroupProps {
  children: React.ReactNode;
  spacing?: "sm" | "md" | "lg";
  className?: string;
}

const spacingClasses = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

export function ButtonGroup({ children, spacing = "md", className }: ButtonGroupProps) {
  return (
    <div className={cn("flex items-center", spacingClasses[spacing], className)}>
      {children}
    </div>
  );
}
