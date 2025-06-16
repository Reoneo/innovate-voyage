
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import TalentProfile from "./pages/TalentProfile";
import NotFound from "./pages/NotFound";
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
      </BrowserRouter>
    </AuthKitProvider>
  );
};

const App = () => {
  console.log("App.tsx: App component rendering");
  
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
