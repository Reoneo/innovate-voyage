
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import Talent from "./pages/Talent";
import JobDetail from "./pages/JobDetail";
import TalentProfile from "./pages/TalentProfile";
import NotFound from "./pages/NotFound";
import WalletConnectModal from "./components/wallet/WalletConnectModal";
import { useEffect } from "react";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Check for any hard-coded API keys in the codebase
if (import.meta.env.DEV) {
  console.log('Running in development mode - ensure all API keys are stored in environment variables');
}

const App = () => {
  // Initialize connected wallet from localStorage on app load
  useEffect(() => {
    const storedAddress = localStorage.getItem('connectedWalletAddress');
    if (storedAddress) {
      window.connectedWalletAddress = storedAddress;
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/talent" element={<Talent />} />
            <Route path="/jobs/:jobId" element={<JobDetail />} />
            <Route path="/talent/:ensName" element={<TalentProfile />} />
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
