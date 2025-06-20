
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { HelmetProvider } from 'react-helmet-async';
import WalletConnectModal from "@/components/wallet/WalletConnectModal";
import XmtpMessageModal from "@/components/wallet/XmtpMessageModal";

// RainbowKit imports
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi';

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const TalentProfile = lazy(() => import("./pages/TalentProfile"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <ThemeProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                    <Suspense fallback={<div>Loading...</div>}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/recruitment.box/:ensName/" element={<TalentProfile />} />
                        <Route path="/jobs" element={<Jobs />} />
                        <Route path="/jobs/:jobId" element={<JobDetail />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                    <WalletConnectModal />
                    <XmtpMessageModal />
                  </div>
                </BrowserRouter>
              </TooltipProvider>
            </ThemeProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </HelmetProvider>
  );
}

export default App;
