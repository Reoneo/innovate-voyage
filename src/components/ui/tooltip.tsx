
import * as React from "react"

// Simplified tooltip components to avoid initialization issues
const TooltipProvider = ({ children, delayDuration, ...props }: { children: React.ReactNode; delayDuration?: number }) => {
  return <>{children}</>;
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
  if (asChild) {
    return <>{children}</>;
  }
  return <span {...props}>{children}</span>;
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    hidden?: boolean;
  }
>(({ className = "", children, side, align, hidden, ...props }, ref) => {
  if (hidden) {
    return null;
  }
  
  return (
    <div
      ref={ref}
      className={`z-50 overflow-hidden rounded-md border bg-white px-3 py-1.5 text-sm shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
