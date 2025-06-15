
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthKitProvider } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import '@/styles/rainbowkit-overrides.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from "./pages/Index";
import TalentProfile from "./pages/TalentProfile";
import NotFound from "./pages/NotFound";
import XmtpMessageModal from "./components/wallet/XmtpMessageModal";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ErrorBoundary from "./components/ErrorBoundary";

// Create a persistent QueryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on certain errors that are likely permanent
        if (error instanceof Error && error.message.includes('Network Error')) {
          return failureCount < 1;
        }
        return failureCount < 1;
      },
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

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Faster loading with minimal timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  // Minimal loading screen for faster perceived performance
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                <ErrorBoundary>
                  <RainbowKitProvider
                    modalSize="compact"
                    initialChain={mainnet}
                    showRecentTransactions={true}
                  >
                    <ErrorBoundary>
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
                    </ErrorBoundary>
                  </RainbowKitProvider>
                </ErrorBoundary>
              </QueryClientProvider>
            </ErrorBoundary>
          </WagmiProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
