import React from "react";
import { 
  Empty, 
  EmptyHeader, 
  EmptyTitle, 
  EmptyDescription, 
  EmptyContent, 
  EmptyMedia 
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  variant?: "default" | "icon";
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className,
  variant = "icon"
}: EmptyStateProps) {
  return (
    <Empty className={cn("py-12", className)}>
      <EmptyHeader>
        {icon && (
          <EmptyMedia variant={variant}>
            {icon}
          </EmptyMedia>
        )}
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && (
        <EmptyContent>
          {action}
        </EmptyContent>
      )}
    </Empty>
  );
}

// Common empty state variants
export function EmptyStateNoData({ 
  title = "No data found", 
  description = "There's nothing to show here yet.",
  action,
  className 
}: Omit<EmptyStateProps, 'icon' | 'variant'>) {
  return (
    <EmptyState
      icon={
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      }
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}

export function EmptyStateNotFound({ 
  title = "Not found", 
  description = "The requested item could not be found.",
  action,
  className 
}: Omit<EmptyStateProps, 'icon' | 'variant'>) {
  return (
    <EmptyState
      icon={
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      }
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}

export function EmptyStateNoResults({ 
  title = "No results found", 
  description = "Try adjusting your search terms or filters.",
  action,
  className 
}: Omit<EmptyStateProps, 'icon' | 'variant'>) {
  return (
    <EmptyState
      icon={
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}
