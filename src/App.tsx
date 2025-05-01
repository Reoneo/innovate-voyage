
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import TalentProfile from "./pages/TalentProfile";
import NotFound from "./pages/NotFound";
import WalletConnectModal from "./components/wallet/WalletConnectModal";
import XmtpMessageModal from "./components/wallet/XmtpMessageModal";

// Create a persistent QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 300000, // 5 minutes
      gcTime: 3600000, // 1 hour (replacement for deprecated cacheTime)
    },
  },
});

if (import.meta.env.DEV) {
  console.log('Running in development mode - ensure all API keys are stored in environment variables');
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const storedAddress = localStorage.getItem('connectedWalletAddress');
    if (storedAddress) {
      window.connectedWalletAddress = storedAddress;
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    // Clean up URL - remove duplicate paths and trailing slashes
    const cleanupUrl = () => {
      const path = window.location.pathname;
      
      // Fix duplicate recruitment.box in URL
      if (path.includes('recruitment.box/recruitment.box/')) {
        const cleanPath = path.replace('recruitment.box/recruitment.box/', 'recruitment.box/');
        window.history.replaceState({}, document.title, cleanPath);
      }
      
      // Remove trailing slashes
      if (path.length > 1 && path.endsWith('/')) {
        const cleanPath = path.replace(/\/+$/, '');
        window.history.replaceState({}, document.title, cleanPath);
      }
    };
    
    // Clean URL on load
    cleanupUrl();
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* Special route for recruitment.box domain - no trailing slash */}
              <Route path="/recruitment.box/:userId" element={<TalentProfile />} />
              {/* Catch and fix duplicate paths */}
              <Route path="/recruitment.box/recruitment.box/:userId" element={<Navigate to="/recruitment.box/:userId" replace />} />
              {/* Regular profile route - no trailing slash */}
              <Route path="/:ensNameOrAddress" element={<TalentProfile />} />
              {/* Handle trailing slash redirects */}
              <Route path="/:ensNameOrAddress/" element={<Navigate to="/:ensNameOrAddress" replace />} />
              <Route path="/recruitment.box/:userId/" element={<Navigate to="/recruitment.box/:userId" replace />} />
              {/* Handle 404 and redirects */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
            <WalletConnectModal />
            <XmtpMessageModal />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
