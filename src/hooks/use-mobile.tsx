
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      
      // Force mobile layout adjustments
      if (mobile) {
        document.body.style.overflowX = 'hidden'
        document.documentElement.style.overflowX = 'hidden'
        document.body.style.width = '100vw'
        document.body.style.maxWidth = '100vw'
      } else {
        document.body.style.overflowX = ''
        document.documentElement.style.overflowX = ''
        document.body.style.width = ''
        document.body.style.maxWidth = ''
      }
    }
    
    mql.addEventListener("change", onChange)
    onChange() // Set initial state
    
    return () => {
      mql.removeEventListener("change", onChange)
      // Clean up styles on unmount
      document.body.style.overflowX = ''
      document.documentElement.style.overflowX = ''
      document.body.style.width = ''
      document.body.style.maxWidth = ''
    }
  }, [])

  return !!isMobile
}
