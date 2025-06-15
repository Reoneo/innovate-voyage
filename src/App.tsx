
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthKitProvider } from '@farcaster/auth-kit';
// import { WagmiProvider } from 'wagmi';
// import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
// import { config, createWagmiConfig } from './lib/wagmi';
// import { useWalletConnectConfig } from './hooks/useWalletConnectConfig';
import '@farcaster/auth-kit/styles.css';
// import '@rainbow-me/rainbowkit/styles.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from "./pages/Index";
import TalentProfile from "./pages/TalentProfile";
import NotFound from "./pages/NotFound";
import XmtpMessageModal from "./components/wallet/XmtpMessageModal";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Create a persistent QueryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1, // Reduced retries for faster loading
      staleTime: 300000, // 5 minutes
      gcTime: 3600000, // 1 hour
    },
  },
});

const farcasterConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'recruitment.box',
  siweUri: 'https://recruitment.box/login',
};

const AppContent = () => {
  // WalletKit does not need loading state since we provide async connect/disconnect in button
  // const { projectId, isLoading } = useWalletConnectConfig();
  // const [wagmiConfig, setWagmiConfig] = useState(config);

  // useEffect(() => {
  //   if (projectId && !isLoading) {
  //     setWagmiConfig(createWagmiConfig(projectId));
  //   }
  // }, [projectId, isLoading]);

  return (
    // Removed WagmiProvider and RainbowKitProvider
    <AuthKitProvider config={farcasterConfig}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
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
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Faster loading with minimal timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

export default App;
