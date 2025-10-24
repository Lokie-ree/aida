import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-6", 
    lg: "size-8",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Spinner className={cn(sizeClasses[size])} />
    </div>
  );
}

interface LoadingTextProps {
  text?: string;
  className?: string;
}

export function LoadingText({ text = "Loading...", className }: LoadingTextProps) {
  return (
    <div className={cn("flex items-center gap-3 text-muted-foreground", className)}>
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
  showHeader?: boolean;
  showContent?: boolean;
  lines?: number;
}

export function LoadingCard({ 
  className, 
  showHeader = true, 
  showContent = true, 
  lines = 3 
}: LoadingCardProps) {
  return (
    <Card className={className}>
      {showHeader && (
        <div className="p-6 pb-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      {showContent && (
        <div className="p-6 pt-0">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full mb-2" />
          ))}
        </div>
      )}
    </Card>
  );
}

interface LoadingGridProps {
  count?: number;
  className?: string;
}

export function LoadingGrid({ count = 6, className }: LoadingGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

interface LoadingListProps {
  count?: number;
  className?: string;
}

export function LoadingList({ count = 5, className }: LoadingListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface LoadingTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function LoadingTable({ rows = 5, columns = 4, className }: LoadingTableProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

interface LoadingPageProps {
  message?: string;
  className?: string;
}

export function LoadingPage({ message = "Loading...", className }: LoadingPageProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] space-y-4", className)}>
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ isVisible, message = "Loading...", className }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50",
      className
    )}>
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
