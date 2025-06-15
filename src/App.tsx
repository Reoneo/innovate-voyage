
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

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  
  useEffect(() => {
    console.log('App: Starting initialization');
    
    try {
      // Check basic requirements
      if (!document.getElementById('root')) {
        throw new Error('Root element not found');
      }
      
      if (typeof window === 'undefined') {
        throw new Error('Window object not available');
      }
      
      console.log('App: Basic checks passed');
      console.log('App: Current URL:', window.location.href);
      console.log('App: User Agent:', navigator.userAgent);
      
      // Faster loading with minimal timeout
      const timer = setTimeout(() => {
        console.log('App: Initialization complete');
        setIsLoading(false);
      }, 100);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('App: Initialization error:', error);
      setInitError(error instanceof Error ? error.message : 'Unknown initialization error');
      setIsLoading(false);
    }
  }, []);

  // Show initialization error
  if (initError) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        background: '#fff3cd',
        color: '#856404',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2>App Initialization Error</h2>
        <p>{initError}</p>
        <p>Please check the console for more details.</p>
      </div>
    );
  }

  // Show loading screen
  if (isLoading) {
    console.log('App: Showing loading screen');
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  console.log('App: Rendering main application');

  try {
    return (
      <HelmetProvider>
        <ThemeProvider>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider
                modalSize="compact"
                initialChain={mainnet}
                showRecentTransactions={true}
              >
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
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ThemeProvider>
      </HelmetProvider>
    );
  } catch (error) {
    console.error('App: Render error:', error);
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        background: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2>App Render Error</h2>
        <p>{error instanceof Error ? error.message : 'Unknown render error'}</p>
        <p>Please check the console for more details.</p>
      </div>
    );
  }
};

export default App;
