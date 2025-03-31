
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import TalentProfile from "./pages/TalentProfile";
import NotFound from "./pages/NotFound";
import WalletConnectModal from "./components/wallet/WalletConnectModal";

// Create a new QueryClient instance with more aggressive caching
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

// Check for any hard-coded API keys in the codebase
if (import.meta.env.DEV) {
  console.log('Running in development mode - ensure all API keys are stored in environment variables');
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize connected wallet from localStorage on app load
  useEffect(() => {
    // This runs on initial load and sets up wallet connection from localStorage
    const storedAddress = localStorage.getItem('connectedWalletAddress');
    if (storedAddress) {
      window.connectedWalletAddress = storedAddress;
    }
    
    // Simulate initialization process and ensure content is loaded before rendering
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Slightly longer delay to ensure everything loads
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading state to prevent flashing of empty content
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:jobId" element={<JobDetail />} />
            {/* Profile routes */}
            <Route path="/profile/:ensNameOrAddress" element={<TalentProfile />} />
            <Route path="/recruitment.box/:userId" element={<TalentProfile />} />
            <Route path="/:ensNameOrAddress" element={<TalentProfile />} />
            <Route path="/address/:address" element={<TalentProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <WalletConnectModal />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
