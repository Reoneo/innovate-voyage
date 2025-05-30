
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useAccount } from 'wagmi';
import { AuthKitProvider } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';
import Index from "./pages/Index";
import TalentProfile from "./pages/TalentProfile";
import NotFound from "./pages/NotFound";
import XmtpMessageModal from "./components/wallet/XmtpMessageModal";
import PrivacyPolicy from "./pages/PrivacyPolicy";

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

// Farcaster AuthKit configuration
const farcasterConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'recruitment.box',
  siweUri: 'https://recruitment.box/login',
};

if (import.meta.env.DEV) {
  console.log('Running in development mode - ensure all API keys are stored in environment variables');
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();
  
  useEffect(() => {
    // If connected via wagmi, use that address
    if (isConnected && address) {
      window.connectedWalletAddress = address;
      localStorage.setItem('connectedWalletAddress', address);
    } else {
      // Otherwise check for stored address from previous session
      const storedAddress = localStorage.getItem('connectedWalletAddress');
      if (storedAddress) {
        window.connectedWalletAddress = storedAddress;
      }
    }
    
    // Use a shorter timeout to reduce blank screen time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    // Listen for URL changes to clean up duplicate recruitment.box in URL
    const cleanupUrl = () => {
      if (window.location.pathname.includes('recruitment.box/recruitment.box/')) {
        const cleanPath = window.location.pathname.replace('recruitment.box/recruitment.box/', 'recruitment.box/');
        window.history.replaceState({}, document.title, cleanPath);
      }
    };
    
    // Clean URL on load
    cleanupUrl();
    
    return () => clearTimeout(timer);
  }, [address, isConnected]);

  // Show minimal loading spinner instead of blank screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <AuthKitProvider config={farcasterConfig}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                {/* Special route for recruitment.box domain - Fix duplication issue */}
                <Route path="/recruitment.box/:userId" element={<TalentProfile />} />
                {/* Catch and fix duplicate paths */}
                <Route path="/recruitment.box/recruitment.box/:userId" element={<Navigate to="/recruitment.box/:userId" replace />} />
                {/* Regular profile route */}
                <Route path="/:ensNameOrAddress" element={<TalentProfile />} />
                {/* Handle 404 and redirects */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" />} />
              </Routes>
              <XmtpMessageModal />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthKitProvider>
    </HelmetProvider>
  );
};

export default App;
