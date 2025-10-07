import { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

interface GradientTextProps extends ComponentPropsWithoutRef<"span"> {
  gradient?: string
  className?: string
  children: React.ReactNode
}

export function GradientText({
  gradient = "from-blue-500 to-purple-600",
  className,
  children,
  ...props
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        gradient,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
