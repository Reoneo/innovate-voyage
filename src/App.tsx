
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthKitProvider } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import TalentProfile from "./pages/TalentProfile";
import NotFound from "./pages/NotFound";
import XmtpMessageModal from "./components/wallet/XmtpMessageModal";
import PrivacyPolicy from "./pages/PrivacyPolicy";

console.log("App.tsx: Starting to load");

// Create a persistent QueryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 300000,
      gcTime: 3600000,
    },
  },
});

console.log("App.tsx: QueryClient created");

const farcasterConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'recruitment.box',
  siweUri: 'https://recruitment.box/login',
};

const AppContent = () => {
  console.log("App.tsx: AppContent rendering");
  
  return (
    <AuthKitProvider config={farcasterConfig}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/recruitment.box/:userId" element={<TalentProfile />} />
            <Route path="/recruitment.box/recruitment.box/:userId" element={<Navigate to="/recruitment.box/:userId" replace />} />
            <Route path="/:ensNameOrAddress" element={<TalentProfile />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
          <XmtpMessageModal />
        </BrowserRouter>
      </TooltipProvider>
    </AuthKitProvider>
  );
};

const App = () => {
  console.log("App.tsx: App component rendering");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("App.tsx: useEffect for loading timer");
    const timer = setTimeout(() => {
      console.log("App.tsx: Setting loading to false");
      setIsLoading(false);
    }, 100);
    
    return () => {
      console.log("App.tsx: Cleaning up timer");
      clearTimeout(timer);
    };
  }, []);

  console.log("App.tsx: isLoading =", isLoading);

  if (isLoading) {
    console.log("App.tsx: Rendering loading spinner");
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  console.log("App.tsx: Rendering full app");
  return (
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

console.log("App.tsx: Exporting App component");
export default App;
