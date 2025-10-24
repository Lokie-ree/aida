import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  spacing?: "none" | "sm" | "md" | "lg";
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", spacing = "sm", ...props }, ref) => {
    const spacingClasses = {
      none: "",
      sm: orientation === "horizontal" ? "gap-2" : "gap-y-2",
      md: orientation === "horizontal" ? "gap-3" : "gap-y-3", 
      lg: orientation === "horizontal" ? "gap-4" : "gap-y-4",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "vertical" && "flex-col",
          spacingClasses[spacing],
          className
        )}
        {...props}
      />
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
