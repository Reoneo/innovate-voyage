
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    // Combine refs to handle both forwardRef and our internal ref
    React.useImperativeHandle(ref, () => inputRef.current!);
    
    // Improve focus behavior for iOS web apps
    const handleClick = React.useCallback(() => {
      // Ensure the input is focused when clicked
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={inputRef}
        onClick={handleClick}
        // Add properties to improve mobile keyboard behavior
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
