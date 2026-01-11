import { useNavigate } from "react-router-dom";
import { Lock, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { RefinementButton as RefinementButtonType } from "./refinement-definitions";

interface RefinementButtonProps {
  /** The refinement button configuration */
  refinement: RefinementButtonType;
  /** Whether this button is locked (requires profile data) */
  isLocked: boolean;
  /** Whether a refinement is currently being applied */
  isApplying: boolean;
  /** Whether this refinement was already applied */
  wasApplied: boolean;
  /** Callback when the button is clicked (only for unlocked buttons) */
  onApply: () => void;
}

/**
 * Individual refinement button component.
 * Renders as a locked button with popover CTA when profile data is missing,
 * or as an actionable button with tooltip when unlocked.
 */
export function RefinementButton({
  refinement,
  isLocked,
  isApplying,
  wasApplied,
  onApply,
}: RefinementButtonProps) {
  const navigate = useNavigate();
  const Icon = refinement.icon;

  // Locked state: show popover with profile completion CTA
  if (isLocked) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              // Base styles
              "text-xs rounded-full",
              "opacity-50 cursor-pointer border-dashed",
              "hover:opacity-70 transition-opacity",
              "shrink-0",
              // Mobile: icon-only compact button
              "h-8 w-8 p-0 sm:h-7 sm:w-auto sm:px-3"
            )}
          >
            <Lock className="h-3.5 w-3.5 sm:h-3 sm:w-3 sm:mr-1.5" />
            <span className="hidden sm:inline">{refinement.label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" side="top" align="start">
          <p className="text-sm text-muted-foreground mb-3">
            {refinement.lockedMessage}
          </p>
          <Button
            size="sm"
            className="w-full"
            onClick={() => navigate("/profile")}
          >
            Complete Profile
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  // Unlocked state: show actionable button with tooltip
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={wasApplied ? "secondary" : "outline"}
          size="sm"
          className={cn(
            // Base styles
            "text-xs rounded-full transition-all",
            "shrink-0",
            wasApplied && "opacity-60",
            isApplying && "animate-pulse",
            // Mobile: icon-only compact button
            "h-8 w-8 p-0 sm:h-7 sm:w-auto sm:px-3"
          )}
          onClick={onApply}
          disabled={isApplying}
        >
          {isApplying ? (
            <Loader2 className="h-3.5 w-3.5 sm:h-3 sm:w-3 sm:mr-1.5 animate-spin" />
          ) : (
            <Icon className="h-3.5 w-3.5 sm:h-3 sm:w-3 sm:mr-1.5" />
          )}
          <span className="hidden sm:inline">{refinement.label}</span>
          {wasApplied && <Check className="h-3 w-3 ml-1 sm:ml-1.5 text-green-500" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs">
        <p className="font-medium mb-1">{refinement.label}</p>
        <p className="text-muted-foreground">{refinement.promptModifier.slice(0, 100)}...</p>
      </TooltipContent>
    </Tooltip>
  );
}
