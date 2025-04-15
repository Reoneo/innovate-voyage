
import * as React from "react"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<"div"> {
  value: number;
  max?: number;
  indicatorClassName?: string;
  getValueLabel?(value: number, max: number): string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, indicatorClassName, getValueLabel, ...props }, ref) => {
    const percentage = value != null ? Math.min(Math.max(value, 0), max) / max * 100 : 0
    const valueLabel = getValueLabel?.(value, max)

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueLabel}
        className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <div
          className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
