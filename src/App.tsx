
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';

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

// Lazy load components to prevent blocking
const Index = React.lazy(() => import('./pages/Index'));
const Jobs = React.lazy(() => import('./pages/Jobs'));
const TalentProfile = React.lazy(() => import('./pages/TalentProfile'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

const AppContent = () => {
  console.log("App.tsx: AppContent rendering");
  
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
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
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => {
  console.log("App.tsx: App component rendering");
  
  return (
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthKitProvider config={farcasterConfig}>
            <AppContent />
            <Toaster />
          </AuthKitProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

console.log("App.tsx: Exporting App component");
export default App;
