
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
              {/* Special route for recruitment.box domain */}
              <Route path="/recruitment.box/:userId" element={<TalentProfile />} />
              {/* Regular profile route */}
              <Route path="/:ensNameOrAddress" element={<TalentProfile />} />
              {/* Handle 404 and redirects */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
            <WalletConnectModal />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
