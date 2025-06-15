
import React from 'react';
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
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from "./pages/Index";
import TalentProfile from "./pages/TalentProfile";
import NotFound from "./pages/NotFound";
import XmtpMessageModal from "./components/wallet/XmtpMessageModal";
import PrivacyPolicy from "./pages/PrivacyPolicy";

console.log('App.tsx: Starting App component initialization');

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

console.log('App.tsx: QueryClient created');

const farcasterConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'recruitment.box',
  siweUri: 'https://recruitment.box/login',
};

console.log('App.tsx: Farcaster config created');

// Error Boundary Component with proper TypeScript types
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    console.log('App.tsx: ErrorBoundary constructor called');
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('App Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary Details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      console.log('App.tsx: ErrorBoundary rendering error state');
      return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
          <div className="text-center max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">Please refresh the page to try again.</p>
            {this.state.error && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground mb-2">Error Details</summary>
                <pre className="bg-muted p-4 rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('App component mounting...');
  
  useEffect(() => {
    console.log('App useEffect running...');
    // Check if all required components are available
    try {
      console.log('App: Checking component availability');
      
      // Test component imports
      if (!Index) {
        throw new Error('Index component not available');
      }
      if (!TalentProfile) {
        throw new Error('TalentProfile component not available');
      }
      if (!NotFound) {
        throw new Error('NotFound component not available');
      }
      if (!PrivacyPolicy) {
        throw new Error('PrivacyPolicy component not available');
      }
      
      console.log('App: All components available');
      
      // Faster loading with minimal timeout
      const timer = setTimeout(() => {
        console.log('App loading complete');
        setIsLoading(false);
      }, 50); // Reduced from 100ms
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('App: Error during initialization:', error);
      setIsLoading(false);
    }
  }, []);

  // Enhanced loading screen for debugging
  if (isLoading) {
    console.log('App showing loading screen');
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  console.log('App rendering main content');

  try {
    return (
      <ErrorBoundary>
        <HelmetProvider>
          <ThemeProvider>
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
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
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('App: Error rendering main content:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Application Error</h1>
          <p className="text-gray-600 mb-4">Failed to render the application.</p>
          <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto text-left mb-4">
            {error.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};

export default App;
