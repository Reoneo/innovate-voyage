
import * as React from "react"
import { useLocation } from "react-router-dom"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const location = useLocation()

  React.useEffect(() => {
    // Force desktop mode for talent profile pages
    const isTalentProfilePage = location.pathname.includes('.eth') || 
                               location.pathname.match(/^\/[^\/]+\/$/) ||
                               location.pathname.match(/^\/0x[a-fA-F0-9]{40}/)
    
    if (isTalentProfilePage) {
      setIsMobile(false)
      return
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [location.pathname])

  // For talent profile pages, always return false (desktop mode)
  const isTalentProfilePage = location.pathname.includes('.eth') || 
                             location.pathname.match(/^\/[^\/]+\/$/) ||
                             location.pathname.match(/^\/0x[a-fA-F0-9]{40}/)
  
  if (isTalentProfilePage) {
    return false
  }

  return !!isMobile
}
